package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"golang.org/x/sync/errgroup"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

// callGeminiJSON is a reusable helper that handles the API call, formatting, and unmarshaling
func callGeminiJSON(ctx context.Context, client *genai.Client, prompt string, target proto.Message) error {
	model := client.GenerativeModel("gemini-2.5-flash")
	model.ResponseMIMEType = "application/json"

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return fmt.Errorf("AI Generation failed: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return fmt.Errorf("received empty response from AI")
	}

	txt, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return fmt.Errorf("invalid response format from AI")
	}

	rawJSON := string(txt)

	// --- THE SILVER BULLET: UTF-8 WASHING MACHINE ---

	// 1. Decode the LLM's string into a generic map.
	// This forces Go to evaluate any hidden unicode escapes (like \uD800) into memory.
	var generic map[string]interface{}
	if err := json.Unmarshal([]byte(rawJSON), &generic); err != nil {
		return fmt.Errorf("failed to parse initial AI JSON: %w", err)
	}

	// 2. Re-encode the map back into JSON bytes.
	// MAGIC: Standard json.Marshal automatically scrubs invalid UTF-8 bytes
	// from all strings and nested arrays, replacing them with valid characters.
	cleanJSONBytes, err := json.Marshal(generic)
	if err != nil {
		return fmt.Errorf("failed to sanitize JSON: %w", err)
	}

	// 3. Unmarshal the perfectly clean JSON into your strict Protobuf struct
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err := unmarshaler.Unmarshal(cleanJSONBytes, target); err != nil {
		return fmt.Errorf("failed to map AI JSON to Protobuf: %w", err)
	}

	return nil
}

func (s *Server) CreateNewReport(ctx context.Context, request *pb.CreateNewReportRequest) (*pb.ReportGeneratedResponse, error) {
	log.Println("Starting optimized AI report generation...")

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, status.Error(codes.Internal, "GEMINI_API_KEY is not set")
	}

	// Initialize the client once per request
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Printf("Failed to create Gemini client: %v", err)
		return nil, status.Error(codes.Internal, "Failed to connect to AI service")
	}
	defer func(client *genai.Client) {
		err := client.Close()
		if err != nil {
			log.Printf("Failed to close client: %v", err)
			return
		}
	}(client)

	log.Println("Step 1: Generating Analysis...")
	analysis, err := s.generateAnalysis(ctx, client, request.GetVideoUrl(), request.GetAudioUrl())
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	log.Println("Step 2: Generating Recommendations and Summary concurrently...")
	var summary *pb.AiSummary
	var recommendations *pb.AiRecommendations

	g, gCtx := errgroup.WithContext(ctx)

	g.Go(func() error {
		var sumErr error
		summary, sumErr = s.generateAiSummary(gCtx, client, analysis)
		return sumErr
	})

	g.Go(func() error {
		var recommErr error
		recommendations, recommErr = s.generateRecommendations(gCtx, client, request.GetVideoUrl(), request.GetAudioUrl(), analysis)
		return recommErr
	})

	if err := g.Wait(); err != nil {
		log.Printf("Parallel AI generation failed: %v", err)
		return nil, status.Error(codes.Internal, "Parallel AI generation failed")
	}

	log.Println("Successfully generated all AI components concurrently!")
	log.Println("Saving generated Response to DataBase...")

	analysisBytes, marshalErr := protojson.Marshal(analysis)
	if marshalErr != nil {
		log.Printf("Failed to marshal analysis to JSON: %v", marshalErr)
		return nil, status.Error(codes.Internal, "Failed to serialize analysis data")
	}

	query := `
		INSERT INTO reports_history 
		(
			id, 
			user_uuid,
			report_creation_date,
			report_creation_time,
			minio_audio_file_url,
			minio_video_file_url,
			status,
			analysis_result
		) 
		VALUES (
			'#EV-' || TO_CHAR(nextval('report_id_seq'), 'FM00000'), 
			$1, 
			CURRENT_DATE, 
			CURRENT_TIME,
			$2, 
			$3, 
			$4,
			$5
		)
		RETURNING id;`

	var generatedID string
	err = s.db.QueryRowContext(ctx, query,
		request.GetUserId(),
		request.GetAudioUrl(),
		request.GetVideoUrl(),
		"PENDING",
		analysisBytes,
	).Scan(&generatedID)

	if err != nil {
		log.Printf("Database error saving report: %v", err)
		return nil, status.Error(codes.Internal, "Failed to save final report")
	}

	log.Printf("Successfully generated new report with ID: %s", generatedID)

	message := fmt.Sprintf("Report %s generated Successfully", generatedID)

	resp := &pb.ReportGeneratedResponse{
		ResultAnalysis:    analysis,
		AiSummary:         summary,
		AiRecommendations: recommendations,
		Message:           message,
	}

	tempJson, _ := protojson.Marshal(resp)

	var cleaner map[string]interface{}
	err = json.Unmarshal(tempJson, &cleaner)
	if err != nil {
		return nil, err
	} // Standard JSON unmarshal parses escapes

	cleanBytes, _ := json.Marshal(cleaner) // Standard JSON marshal replaces bad UTF-8

	finalResp := &pb.ReportGeneratedResponse{}
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}
	if err := unmarshaler.Unmarshal(cleanBytes, finalResp); err != nil {
		log.Printf("Final scrubbing failed: %v", err)
		return resp, nil // Fallback to original if this fails
	}

	log.Printf("Successfully scrubbed final report : %v\n", finalResp)

	return finalResp, nil
}

func (s *Server) generateAnalysis(ctx context.Context, client *genai.Client, videoUrl string, audioUrl string) (*pb.ResultAnalysis, error) {
	log.Println("Generating Emotional response from Gemini API...")

	prompt := fmt.Sprintf(`
       Analyze the behavioral and emotional metrics based on the provided media sources:
       Video URL: %s
       Audio URL: %s

       You must respond with ONLY a valid JSON object.
       The JSON object MUST have exactly these keys and data types:
       - "emotion_1_name": String (e.g., Anger)
       - "emotion_1_rating": Number (e.g., 0.85)
       - "emotion_2_name": String (e.g., Joy)
       - "emotion_2_rating": Number (e.g., 0.12)
       - "eye_movement": String (e.g., "Rapid", "Steady")
       - "voice_tension": String (e.g., "High", "Relaxed")
       - "blink_frequency": String (e.g., "Normal", "Elevated")
       - "accuracy_rate": Number (e.g., 0.90)
       - "confidence_rate": Number (e.g., 0.90)
    `, videoUrl, audioUrl)

	analysis := &pb.ResultAnalysis{}
	if err := callGeminiJSON(ctx, client, prompt, analysis); err != nil {
		return nil, err
	}

	analysis.Emotion_1Name = strings.ToValidUTF8(analysis.Emotion_1Name, "")
	analysis.Emotion_2Name = strings.ToValidUTF8(analysis.Emotion_2Name, "")
	analysis.EyeMovement = strings.ToValidUTF8(analysis.EyeMovement, "")
	analysis.VoiceTension = strings.ToValidUTF8(analysis.VoiceTension, "")
	analysis.BlinkFrequency = strings.ToValidUTF8(analysis.BlinkFrequency, "")

	return analysis, nil
}

func (s *Server) generateRecommendations(ctx context.Context, client *genai.Client, videoUrl string, audioUrl string, analysis *pb.ResultAnalysis) (*pb.AiRecommendations, error) {
	log.Println("Generating Recommendations from Gemini API...")

	prompt := fmt.Sprintf(`
       Based on the following media and behavioral analysis, provide actionable recommendations.
       Video URL: %s
       Audio URL: %s
       Analysis Data: %+v

       You must respond with ONLY a valid JSON object.
       The JSON object MUST have keys that match the AiRecommendations schema. For example:
       - "recommendations": Array of Strings
       - "overall_advice": String
    `, videoUrl, audioUrl, analysis)

	recommendations := &pb.AiRecommendations{}
	if err := callGeminiJSON(ctx, client, prompt, recommendations); err != nil {
		return nil, err
	}

	recommendations.Point_1Title = strings.ToValidUTF8(recommendations.Point_1Title, "")
	recommendations.Point_1Description = strings.ToValidUTF8(recommendations.Point_1Description, "")
	recommendations.Point_2Title = strings.ToValidUTF8(recommendations.Point_2Title, "")
	recommendations.Point_2Description = strings.ToLower(recommendations.Point_2Description)

	log.Println("Successfully generated new recommendations!")
	return recommendations, nil
}

func (s *Server) generateAiSummary(ctx context.Context, client *genai.Client, summary *pb.ResultAnalysis) (*pb.AiSummary, error) {
	log.Println("Generating AI Summary from Gemini API...")

	prompt := fmt.Sprintf(`
       Provide a concise, high-level AI summary based on the following report data:
       Report Data: %+v

       You must respond with ONLY a valid JSON object.
       The JSON object MUST have keys that match the AiSummary schema. For example:
       - "summary_text": String
       - "key_findings": Array of Strings
    `, summary)

	aiSummary := &pb.AiSummary{}
	if err := callGeminiJSON(ctx, client, prompt, aiSummary); err != nil {
		return nil, err
	}

	aiSummary.Summary = strings.ToValidUTF8(aiSummary.Summary, "")

	log.Println("Successfully generated new summary!")
	return aiSummary, nil
}
