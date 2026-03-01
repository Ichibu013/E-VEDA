package iam

import (
	"context"
	"database/sql"
	pb "e_veda/proto/iampb"
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) Login(ctx context.Context, in *pb.LoginRequest) (*pb.LoginResponse, error) {
	var userUUID, passwordHash string

	err := s.db.QueryRowContext(ctx, "SELECT user_uuid, password_hash FROM iam_users WHERE email =$1", in.Email).Scan(&userUUID, &passwordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.Unauthenticated, "Invalid credentials")
		}
		log.Printf("CRITICAL: Database error during login: %v", err)
		return nil, status.Error(codes.Internal, "User not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(in.Password)); err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid credentials")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserUUID: userUUID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "E-VEDA-iam-service",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to generate signed token")
	}

	return &pb.LoginResponse{Token: tokenString}, nil
}
