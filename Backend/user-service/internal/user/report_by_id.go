package user

import (
	"context"
	"database/sql"
	pb "e_veda/proto/userpb"
	"encoding/json"
	"errors"
	"log"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/structpb"
)

func (s *Server) GetReportByID(ctx context.Context, request *pb.GetReportByIdRequest) (*pb.GetReportDetailsResponse, error) {
	log.Printf("DEBUG: Looking for Report ID exactly like this: ->%s<-", request.ReportId)

	// 1. The SQL Query with a JOIN to get the patient's name
	query := `
		SELECT 
			r.id, 
			u.name, 
			r.analysis_result, 
			r.confidence_rate, 
			r.accuracy_rate, 
			r.report_creation_date, 
			r.report_creation_time
		FROM 
			reports_history r
		LEFT JOIN 
			e_veda_users u ON r.user_uuid = u.iam_id
		WHERE 
			r.id = $1;
	`

	// Variables to hold the scanned database row
	var (
		id                  string
		patientName         string
		analysisResultBytes []byte
		confidenceRate      float64
		accuracyRate        float64
		creationDate        time.Time
		creationTime        time.Time
	)

	// 2. Execute the query
	err := s.db.QueryRowContext(ctx, query, request.ReportId).Scan(
		&id,
		&patientName,
		&analysisResultBytes,
		&confidenceRate,
		&accuracyRate,
		&creationDate,
		&creationTime,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return a 404/Not Found equivalent error based on your framework (gRPC/HTTP)
			return nil, status.Error(codes.NotFound, "report not found")
		}
		log.Printf("Error fetching report %s: %v", request, err)
		return nil, status.Error(codes.Internal, "failed to fetch report details")
	}

	// 3. Unmarshal the JSONB bytes into a Go Map
	var analysisResultMap map[string]interface{}
	if len(analysisResultBytes) > 0 {
		if err := json.Unmarshal(analysisResultBytes, &analysisResultMap); err != nil {
			log.Printf("Failed to unmarshal analysis_result for report %s: %v", request, err)
			return nil, status.Error(codes.Internal, "failed to process report data")
		}
	}

	// 2. Convert the Go Map to a Protobuf Struct
	pbAnalysisStruct, err := structpb.NewStruct(analysisResultMap)
	if err != nil {
		log.Printf("Failed to convert map to structpb for report %s: %v", request, err)
		return nil, status.Error(codes.Internal, "failed to format analysis result")
	}

	loc, err := time.LoadLocation("Asia/Kolkata")
	if err == nil {
		// 2. Convert both Date and Time to IST
		creationDate = creationDate.In(loc)
		creationTime = creationTime.In(loc)
	} else {
		// Log a warning if the OS doesn't have timezone data available
		log.Printf("Warning: Could not load Asia/Kolkata timezone: %v", err)
	}

	// 3. Construct the final gRPC response
	response := &pb.GetReportDetailsResponse{
		ReportId:         id,
		PatientName:      patientName,
		AnalysisResult:   pbAnalysisStruct,
		ConfidenceResult: confidenceRate,
		AccuracyResult:   accuracyRate,
		Date:             creationDate.Format("2006-01-02"),
		Time:             creationTime.Format("15:04:05"),
	}

	return response, nil
}
