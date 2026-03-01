package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.UserResponse, error) {
	log.Printf("Fetching user form database: %s", req.UserId)

	var id, name, email string

	err := s.db.QueryRowContext(ctx, "SELECT id, name, email FROM users WHERE id= $1", req.UserId).Scan(&id, &name, &email)
	if err != nil {
		log.Printf("Error fetching user: %s", err.Error())
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	return &pb.UserResponse{
		Id:    id,
		Name:  name,
		Email: email,
	}, nil
}
