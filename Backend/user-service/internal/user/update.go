package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) UpdateUser(ctx context.Context, req *pb.ProfileUpdateRequest) (*pb.ApiResponse, error) {
	log.Printf("Updating user profile for id: %s", req.GetUserId())

	// Corrected the SQL syntax to map each column to its own placeholder
	query := `UPDATE e_veda_users SET name = $1, nickname = $2, age = $3, height = $4, weight = $5, gender = $6 WHERE iam_id = $7`

	// Passed the 4 variables to match $1, $2, $3, and $4 in exact order
	res, err := s.db.ExecContext(ctx, query,
		req.GetName(),
		req.GetNickname(),
		req.GetAge(),
		req.GetHeight(),
		req.GetWeight(),
		req.GetGender(),
		req.GetUserId(),
	)
	if err != nil {
		log.Printf("Database error during user update: %s", err)
		return nil, status.Error(codes.Internal, "Failed to update user profile")
	}

	// Optional: Check if the user actually existed to be updated
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return nil, status.Error(codes.NotFound, "User not found")
	}

	return &pb.ApiResponse{
		Message: "User Profile Updated Successfully",
	}, nil
}
