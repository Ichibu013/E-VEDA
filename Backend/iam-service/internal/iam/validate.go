package iam

import (
	"context"
	pb "e_veda/proto/iampb"

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
