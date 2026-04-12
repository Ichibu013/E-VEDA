package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	_ "log"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetUserInfo(ctx context.Context, req *pb.GetUserInfoRequest) (*pb.GetUserInfoResponse, error) {
	var email, lastLoginStr string
	var lastLogin time.Time

	err := s.db.QueryRowContext(ctx, "SELECT email, last_login FROM e_veda_iam_users WHERE user_uuid = $1", req.UserId).Scan(&email, &lastLogin)
	if err != nil {
		return nil, status.Error(codes.NotFound, "User not found")
	}

	if !lastLogin.IsZero() {
		lastLoginStr = lastLogin.Format(time.RFC3339)
	}

	return &pb.GetUserInfoResponse{
		Email:     email,
		Username:  email, // treated as username
		LastLogin: lastLoginStr,
	}, nil
}
