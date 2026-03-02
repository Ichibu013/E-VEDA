package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"errors"
	"log"

	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) ResetPassword(ctx context.Context, req *pb.ResetPasswordRequest) (*pb.ApiResponse, error) {
	// 1. Fetch the email attached to this reset token from Redis
	email, err := s.rdb.Get(ctx, "reset:"+req.GetResetToken()).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return nil, status.Error(codes.NotFound, "Token has expired or does not exist")
		}
		log.Printf("Redis error during token verification: %v", err)
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	// 2. Hash the brand new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.GetNewPassword()), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing new password: %v", err)
		return nil, status.Error(codes.Internal, "Failed to secure new password")
	}

	// 3. Update the password in PostgreSQL
	query := `UPDATE iam_users SET password_hash = $1 WHERE email = $2`
	result, err := s.db.ExecContext(ctx, query, string(hashedPassword), email)
	if err != nil {
		log.Printf("CRITICAL: Database error updating password: %v", err)
		return nil, status.Error(codes.Internal, "Failed to update password")
	}

	// Optional check to ensure a row was actually updated
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return nil, status.Error(codes.NotFound, "User not found in database")
	}

	// 4. SECURITY BEST PRACTICE: Delete the token immediately
	// This prevents the token from being reused before its 10-minute TTL expires
	_ = s.rdb.Del(ctx, "reset:"+req.GetResetToken())

	return &pb.ApiResponse{
		Message: "Password updated successfully",
	}, nil
}
