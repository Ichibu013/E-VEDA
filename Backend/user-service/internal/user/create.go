package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.ApiResponse, error) {
	log.Printf("Creating user profile for email: %s", req.GetEmail())

	query := `INSERT INTO users (id,name,email) VALUES ($1, $2, $3)`
	_, err := s.db.ExecContext(ctx, query, req.GetUserId(), req.GetName(), req.GetEmail())
	if err != nil {
		log.Printf("Database error during user creation: %s", err)
		return nil, status.Error(codes.Internal, "Failed to Create user profile")
	}

	return &pb.ApiResponse{
		Message: "User Profile Created Successfully",
	}, nil
}
