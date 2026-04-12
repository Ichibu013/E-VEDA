package iam

import (
	"context"
	"database/sql"
	pb "e_veda/proto/iampb"
	"errors"
	"log"
	"time"

	_ "github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) Login(ctx context.Context, in *pb.LoginRequest) (*pb.LoginResponse, error) {
	var userUUID, passwordHash, email string

	err := s.db.QueryRowContext(ctx, "SELECT user_uuid, email, password_hash FROM e_veda_iam_users WHERE email =$1", in.Email).Scan(&userUUID, &email, &passwordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.Unauthenticated, "Invalid credentials")
		}
		log.Printf("CRITICAL: Database error during login: %v", err)
		return nil, status.Error(codes.Internal, "Database error")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(in.Password)); err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid credentials")
	}

	// Update last_login timestamp
	_, _ = s.db.ExecContext(ctx, "UPDATE e_veda_iam_users SET last_login = CURRENT_TIMESTAMP WHERE user_uuid = $1", userUUID)

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

	// Save Refresh Token in Redis for validation/invalidation
	err = s.rdb.Set(ctx, "refresh_token:"+userUUID, refreshToken, 7*24*time.Hour).Err()
	if err != nil {
		log.Printf("Error saving refresh token in Redis: %v", err)
	}

	return &pb.LoginResponse{
		Token:        accessToken,
		RefreshToken: refreshToken,
		UserId:       userUUID,
		Email:        email,
		Username:     email, // For now, using email as username
		FullName:     "",    // Could be fetched from user service if needed, but for now empty
		ExpiresIn:    3600,
	}, nil
}
