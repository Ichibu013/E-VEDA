package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"errors"
	"log"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) VerifyOTP(ctx context.Context, req *pb.VerifyOtpRequest) (*pb.VerifyOtpResponse, error) {
	isValid, err := VerifyOTP(s.rdb, req.GetEmail(), req.GetOtp())
	if err != nil {
		// If Redis returns an error (like redis.Nil), the OTP expired or doesn't exist
		if errors.Is(err, redis.Nil) {
			return nil, status.Error(codes.NotFound, "OTP has expired or does not exist")
		}
		log.Printf("Redis error during OTP verification: %v", err)
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	if !isValid {
		return nil, status.Error(codes.FailedPrecondition, "OTP verification failed")
	}

	resetToken := uuid.New().String()

	if err := SaveResetToken(s.rdb, resetToken, req.GetEmail()); err != nil {
		log.Println("Error saving reset token")
	}

	_ = s.rdb.Del(ctx, "otp:"+req.GetEmail()).Err()

	return &pb.VerifyOtpResponse{
		ResetToken: resetToken,
	}, nil

}
