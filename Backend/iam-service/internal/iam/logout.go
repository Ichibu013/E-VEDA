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

func (s *Server) Logout(ctx context.Context, req *pb.LogoutRequest) (*pb.ApiResponse, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(req.Token, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})

	if err != nil || !token.Valid {
		return nil, status.Error(codes.Unauthenticated, "Invalid token")
	}

	// Blacklist the access token until its expiration
	expiration := time.Until(claims.ExpiresAt.Time)
	if expiration > 0 {
		err = s.rdb.Set(ctx, "blacklist:"+req.Token, "true", expiration).Err()
		if err != nil {
			log.Printf("Error blacklisting token: %v", err)
		}
	}

	// Also clear the refresh token from Redis
	err = s.rdb.Del(ctx, "refresh_token:"+claims.UserUUID).Err()
	if err != nil {
		log.Printf("Error clearing refresh token: %v", err)
	}

	return &pb.ApiResponse{
		Message: "Logout successful",
	}, nil
}
