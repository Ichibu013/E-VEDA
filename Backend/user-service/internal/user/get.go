package user

import (
	"context"
	"database/sql" // ADDED: required for sql.NullString and sql.NullInt64
	pb "e_veda/proto/userpb"
	"errors"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.UserResponse, error) {
	log.Printf("Fetching user from database: %s", req.UserId)

	// 1. Use standard 'string' for Name since your schema says it is NOT NULL
	var name string

	// 2. Use sql.Null* types for fields that can be NULL in the database
	var nickname sql.NullString
	var profilePicture sql.NullString
	var age sql.NullInt64
	var height sql.NullInt64
	var weight sql.NullFloat64

	err := s.db.QueryRowContext(ctx, "SELECT name, nickname, age, profile_picture,height,weight FROM e_veda_users WHERE iam_id = $1", req.UserId).Scan(
		&name,
		&nickname,
		&age,
		&profilePicture,
		&height,
		&weight,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.NotFound, "User not found")
		}
		log.Printf("Error fetching user: %s", err.Error())
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	return &pb.UserResponse{
		Name:           name,
		Nickname:       nickname.String,
		Age:            age.Int64,
		ProfilePicture: profilePicture.String,
		Height:         height.Int64,
		Weight:         weight.Float64,
	}, nil
}
