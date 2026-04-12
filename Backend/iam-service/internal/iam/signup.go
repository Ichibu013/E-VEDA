package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) SignUp(ctx context.Context, req *pb.SignUpRequest) (*pb.SignUpResponse, error) {
	log.Printf("Processing signup request for email: %s", req.Email)

	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.GetPassword()), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to hash password: %v", err)
	}

	// Generate new UUID
	userUUID := uuid.New().String()

	// 1. Create User in IAM
	query := `INSERT INTO e_veda_iam_users (user_uuid, email, password_hash) VALUES ($1, $2, $3)`
	_, err = s.db.Exec(query, userUUID, req.GetEmail(), string(hashedPassword))
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				return nil, status.Errorf(codes.AlreadyExists, "Email %s already exists", req.GetEmail())
			}
		}
		return nil, status.Errorf(codes.Internal, "Failed to insert user: %v", err)
	}

	// Generate Access Token (1 hour)
	accessToken, err := s.generateToken(userUUID, 1*time.Hour)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to generate access token")
	}

	// Generate Refresh Token (7 days)
	refreshToken, err := s.generateToken(userUUID, 7*24*time.Hour)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to generate refresh token")
	}

	// Save Refresh Token in Redis
	err = s.rdb.Set(ctx, "refresh_token:"+userUUID, refreshToken, 7*24*time.Hour).Err()
	if err != nil {
		log.Printf("Error saving refresh token in Redis: %v", err)
	}

	return &pb.SignUpResponse{
		UserUuid:     userUUID,
		Token:        accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    3600,
	}, nil
}

func (s *Server) DeleteUser(ctx context.Context, req *pb.DeleteUserRequest) (*pb.ApiResponse, error) {
	log.Printf("Rolling back user creation for UUID: %s", req.GetUserUuid())

	query := `DELETE FROM e_veda_iam_users WHERE user_uuid = $1`
	_, err := s.db.ExecContext(ctx, query, req.GetUserUuid())
	if err != nil {
		log.Printf("CRITICAL: Failed to rollback user %s: %v", req.GetUserUuid(), err)
		return nil, status.Errorf(codes.Internal, "Failed to delete user: %v", err)
	}

	return &pb.ApiResponse{
		Message: "User successfully rolled back",
	}, nil
}
