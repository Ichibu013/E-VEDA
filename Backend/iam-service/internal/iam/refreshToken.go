package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) RefreshToken(ctx context.Context, req *pb.RefreshTokenRequest) (*pb.RefreshTokenResponse, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(req.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})

	if err != nil || !token.Valid {
		return nil, status.Error(codes.Unauthenticated, "Invalid refresh token")
	}

	// Verify if the refresh token matches the one stored in Redis
	storedToken, err := s.rdb.Get(ctx, "refresh_token:"+claims.UserUUID).Result()
	if err != nil || storedToken != req.RefreshToken {
		return nil, status.Error(codes.Unauthenticated, "Refresh token expired or revoked")
	}

	// Issue new Access Token
	newAccessToken, err := s.generateToken(claims.UserUUID, 1*time.Hour)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to generate new access token")
	}

	// Optionally rotate Refresh Token
	newRefreshToken, err := s.generateToken(claims.UserUUID, 7*24*time.Hour)
	if err != nil {
		log.Printf("Error generating new refresh token, keeping old one: %v", err)
		newRefreshToken = req.RefreshToken
	} else {
		// Save new refresh token in Redis
		err = s.rdb.Set(ctx, "refresh_token:"+claims.UserUUID, newRefreshToken, 7*24*time.Hour).Err()
		if err != nil {
			log.Printf("Error saving new refresh token in Redis: %v", err)
		}
	}

	return &pb.RefreshTokenResponse{
		Token:        newAccessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    3600,
	}, nil
}
