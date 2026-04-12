package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const globalTrendsCacheKey = "global_emotional_trends"

func (s *Server) GetGlobalEmotionalTrends(ctx context.Context, _ *pb.GetGlobalTrendsRequest) (*pb.GetEmotionalTrendsResponse, error) {
	log.Println("Fetching Global Emotional Trends from Gemini API...")

	cachedData, err := s.rdb.Get(ctx, globalTrendsCacheKey).Result()
	if err == nil && cachedData != "" {
		log.Println("CACHE HIT: Returning global trends from Redis")
		var trends []*pb.DailyEmotion
		parseErr := json.Unmarshal([]byte(cachedData), &trends)
		if parseErr == nil {
			return &pb.GetEmotionalTrendsResponse{Trends: trends}, nil
		}
		log.Printf("Failed to parse cached Redis data, falling back to Gemini: %v", parseErr)
	}

	log.Println("CACHE MISS: Generating new trends via Gemini API...")

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, status.Error(codes.Internal, "GEMINI_API_KEY is not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("Failed to create Gemini client: %v", err)
		return nil, status.Error(codes.Internal, "Failed to connect to AI service")
	}
	defer func(client *genai.Client) {
		err := client.Close()
		if err != nil {
			log.Printf("Failed to close Gemini client: %v", err)
			return
		}
	}(client)

	model := client.GenerativeModel("gemini-1.5-flash")
	model.ResponseMIMEType = "application/json" // Forces Gemini to output pure JSON

	// Calculate the date range to give Gemini accurate context
	today := time.Now()
	startDate := today.AddDate(0, 0, -6).Format("2006-01-02")
	endDate := today.Format("2006-01-02")

	prompt := fmt.Sprintf(`
		Generate a simulated 7-day global emotional trend dataset for humanity. 
		The date range is from %s to %s.
		You must respond with ONLY a valid JSON array containing exactly 7 objects (one for each day).
		Do not include any markdown tags or text outside the array.

		Each object MUST have exactly these keys:
		- "day": String (e.g., "Mon", "Tue")
		- "date": String (YYYY-MM-DD)
		- "joy": Integer
		- "anger": Integer
		- "sadness": Integer
		- "fear": Integer
		- "surprise": Integer
		- "disgust": Integer

		The six emotion values must be percentages (0-100) and MUST sum up to exactly 100 for each day.
	`, startDate, endDate)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		log.Printf("Failed to generate content from Gemini: %v", err)
		return nil, status.Error(codes.Internal, "AI Generation failed")
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, status.Error(codes.Internal, "Received empty response from AI")
	}

	// Extract text from Gemini Response
	var rawJSON string
	if txt, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		rawJSON = string(txt)
	} else {
		return nil, status.Error(codes.Internal, "Invalid response format from AI")
	}

	// Parse the JSON directly into our protobuf array
	var trends []*pb.DailyEmotion
	if err := json.Unmarshal([]byte(rawJSON), &trends); err != nil {
		log.Printf("Failed to parse Gemini JSON: %v. Raw String: %s", err, rawJSON)
		return nil, status.Error(codes.Internal, "Failed to parse AI data")
	}

	err = s.rdb.Set(ctx, globalTrendsCacheKey, rawJSON, 24*time.Hour).Err()
	if err != nil {
		// Log the error but do not fail the request; the user should still get their data
		log.Printf("WARNING: Failed to cache global trends to Redis: %v", err)
	} else {
		log.Println("Successfully cached new global trends to Redis for 24 hours")
	}

	return &pb.GetEmotionalTrendsResponse{
		Trends: trends,
	}, nil
}
