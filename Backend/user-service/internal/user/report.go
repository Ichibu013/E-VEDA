package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"fmt"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) CreateNewReport(ctx context.Context, request *pb.CreateNewReportRequest) (*pb.ApiResponse, error) {

	query := `
		INSERT INTO reports_history 
		(id, user_uuid, report_creation_date, report_creation_time, minio_audio_file_url, minio_video_file_url, status) 
		VALUES (
			'#EV-' || TO_CHAR(nextval('report_id_seq'), 'FM00000'), 
			$1, CURRENT_DATE, CURRENT_TIME, $2, $3, $4
		)
		RETURNING id;`

	var generatedID string
	statusStr := "PENDING"

	err := s.db.QueryRowContext(ctx, query,
		request.GetUserId(),
		request.GetAudioUrl(),
		request.GetVideoUrl(),
		statusStr,
	).Scan(&generatedID)

	if err != nil {
		log.Printf("Database error saving report: %v", err)
		return nil, status.Error(codes.Internal, "Failed to save final report")
	}

	log.Printf("Successfully generated new report with ID: %s", generatedID)

	message := fmt.Sprintf("Report %s generated Successfully", generatedID)

	return &pb.ApiResponse{Message: message}, nil
}
