package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"log"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) ChangePassword(ctx context.Context, req *pb.ChangePasswordRequest) (*pb.ApiResponse, error) {
	var currentHash string
	err := s.db.QueryRowContext(ctx, "SELECT password_hash FROM e_veda_iam_users WHERE user_uuid = $1", req.UserId).Scan(&currentHash)
	if err != nil {
		return nil, status.Error(codes.NotFound, "User not found")
	}

	// 1. Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(currentHash), []byte(req.CurrentPassword)); err != nil {
		return nil, status.Error(codes.InvalidArgument, "Current password is incorrect")
	}

	// 2. Hash new password
	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to hash new password")
	}

	// 3. Update database
	_, err = s.db.ExecContext(ctx, "UPDATE e_veda_iam_users SET password_hash = $1 WHERE user_uuid = $2", string(newHash), req.UserId)
	if err != nil {
		log.Printf("Error updating password: %v", err)
		return nil, status.Error(codes.Internal, "Failed to update password")
	}

	return &pb.ApiResponse{Message: "Password changed successfully"}, nil
}
