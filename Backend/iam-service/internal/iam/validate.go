package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func (s *Server) ValidateToken(_ context.Context, req *pb.TokenRequest) (*pb.ValidationResponse, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(req.GetToken(), claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil
	})

	if err != nil || !token.Valid {
		return &pb.ValidationResponse{IsValid: false, UserId: ""}, nil
	}

	return &pb.ValidationResponse{IsValid: true, UserId: claims.UserUUID}, nil
}

func (s *Server) generateToken(userUUID string, duration time.Duration) (string, error) {
	expirationTime := time.Now().Add(duration)
	claims := &Claims{
		UserUUID: userUUID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "E-VEDA-iam-service",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecretKey)
}
