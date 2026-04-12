package user

import (
	"context"
	"database/sql"
	pb "e_veda/proto/userpb"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Define a struct to parse the JSON from Gemini and Redis
type InsightData struct {
	Insight string `json:"insight"`
	Details string `json:"details"`
}

func (s *Server) GetDailyInsight(ctx context.Context, req *pb.GetUserRequest) (*pb.GetDailyInsightResponse, error) {
	userID := req.GetUserId()

	today := time.Now().Format("2006-01-02")
	cacheKey := fmt.Sprintf("insight:%s:%s", userID, today)

	// 1. Check Redis Cache
	cachedInsight, err := s.rdb.Get(ctx, cacheKey).Result()
	if err == nil && cachedInsight != "" {
		var data InsightData
		if err := json.Unmarshal([]byte(cachedInsight), &data); err == nil {
			return &pb.GetDailyInsightResponse{
				Insight: data.Insight,
				Details: data.Details,
			}, nil
		}
	}

	// 2. Fetch User's Recent Data
	query := `
		SELECT analysis_result 
		FROM reports_history 
		WHERE user_uuid = $1 
		  AND report_creation_date >= CURRENT_DATE - INTERVAL '7 days'
		  AND analysis_result IS NOT NULL
	`
	rows, err := s.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, status.Error(codes.Internal, "Database error")
	}
	defer rows.Close()

	var recentData string
	for rows.Next() {
		var jsonStr sql.NullString
		if err := rows.Scan(&jsonStr); err == nil && jsonStr.Valid {
			recentData += jsonStr.String + "\n"
		}
	}

	// Provide a default if no data exists
	if recentData == "" {
		defaultData := InsightData{
			Insight: "Welcome to your emotional journey. Start recording your daily updates to receive personalized AI insights.",
			Details: "By logging your daily emotional state, the AI can detect patterns and correlations, offering you customized advice to help stabilize and improve your overall wellbeing.",
		}
		defaultJSON, _ := json.Marshal(defaultData)
		s.rdb.Set(ctx, cacheKey, string(defaultJSON), 24*time.Hour)

		return &pb.GetDailyInsightResponse{
			Insight: defaultData.Insight,
			Details: defaultData.Details,
		}, nil
	}

	// 3. Ask Gemini for structured JSON
	apiKey := os.Getenv("GEMINI_API_KEY")
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to connect to AI")
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")

	// PRO FEATURE: Force JSON Output
	model.ResponseMIMEType = "application/json"

	prompt := fmt.Sprintf(`
		You are a compassionate AI wellness coach. 
		Here is the user's emotional data (Joy, Anger, Sadness, Fear, Surprise, Disgust) from the last few days:
		%s

		You must respond with ONLY a valid JSON object containing exactly these two keys:
		- "insight": A short, two-sentence observation about their trends and a gentle, actionable suggestion.
		- "details": A slightly longer (3-4 sentences) explanation of why this suggestion helps, based specifically on the emotional markers provided.
	`, recentData)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil || len(resp.Candidates) == 0 {
		return nil, status.Error(codes.Internal, "Failed to generate AI insight")
	}

	// Extract the JSON string from Gemini
	var rawJSON string
	if txt, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		rawJSON = string(txt)
	}

	// Parse it to ensure it's valid before saving
	var parsedData InsightData
	if err := json.Unmarshal([]byte(rawJSON), &parsedData); err != nil {
		return nil, status.Error(codes.Internal, "Failed to parse AI data")
	}

	// 4. Save the raw JSON string to Redis
	s.rdb.Set(ctx, cacheKey, rawJSON, 24*time.Hour)

	return &pb.GetDailyInsightResponse{
		Insight: parsedData.Insight,
		Details: parsedData.Details,
	}, nil
}
