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

	var name, nickname, profilePicture string
	var age int64

	err := s.db.QueryRowContext(ctx, "SELECT name, nickname, age, profile_picture FROM users WHERE iam_id= $1", req.UserId).Scan(&name, &nickname, &age, &profilePicture)
	if err != nil {
		log.Printf("Error fetching user: %s", err.Error())
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	return &pb.UserResponse{
		Name:           name,
		Nickname:       nickname,
		Age:            age,
		ProfilePicture: profilePicture,
	}, nil
}
