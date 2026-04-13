package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"fmt"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetReportDraftInfo(ctx context.Context, req *pb.GetUserRequest) (*pb.GetReportDraftInfoResponse, error) {
	var patientName string
	var nextSequenceValue int

	// 1. Fetch the Patient Name
	err := s.db.QueryRowContext(ctx, "SELECT name FROM e_veda_users WHERE iam_id = $1", req.GetUserId()).Scan(&patientName)
	if err != nil {
		log.Printf("Error fetching user name for draft: %v", err)
		return nil, status.Error(codes.NotFound, "User not found")
	}

	// 2. Peek at the next sequence value safely (without incrementing it)
	// Note: 'last_value' gets the current sequence. We add 1 to project the next one.
	seqQuery := `SELECT last_value + 1 FROM report_id_seq`
	err = s.db.QueryRowContext(ctx, seqQuery).Scan(&nextSequenceValue)

	var projectedID string
	if err != nil {
		// If the sequence has never been used yet, it might throw an error.
		// We default to predicting the first ID.
		projectedID = "#EV-00001"
	} else {
		// Format it to match your #EV-XXXXX style using Go's formatting
		// %05d means "pad with zeros up to 5 digits"
		projectedID = "#EV-" + formatWithZeros(nextSequenceValue, 5)
	}

	return &pb.GetReportDraftInfoResponse{
		PatientName:     patientName,
		ProjectedNextId: projectedID,
	}, nil
}

// Small helper to pad numbers in Go
func formatWithZeros(num int, width int) string {
	return fmt.Sprintf("%0*d", width, num)
}
