package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) CreateNewReport(ctx context.Context, request *pb.CreateNewReportRequest) (*pb.ApiResponse, error) {

	query := `INSERT INTO e_veda_reports_history (
                                   id,
                                   user_uuid,
                                   report_creation_date, 
                                   report_creation_time,
                                   minio_audio_file_url,
                                   minio_video_file_url,
                                   status 
                                   )    
             VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3, $4, $5)`
	_, err := s.db.ExecContext(ctx, query,
		request.GetReportId(),
		request.GetUserId(),
		request.GetAudioUrl(),
		request.GetVideoUrl(),
		"PENDING",
	)
	if err != nil {
		log.Printf("Error creating report history: %v", err)
		return nil, status.Error(codes.Internal, "Failed to initialize new report")
	}

	return &pb.ApiResponse{Message: "New Report Created Successfully"}, nil
}
