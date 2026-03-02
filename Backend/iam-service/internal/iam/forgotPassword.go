package iam

import (
	"context"
	pb "e_veda/proto/iampb"
	"fmt"
	"log"
	"math/rand"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) ForgotPassword(ctx context.Context, req *pb.ForgotPasswordRequest) (*pb.ApiResponse, error) {
	var exists bool
	s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM iam_users WHERE email = $1)", req.Email).Scan(&exists)
	if !exists {
		return nil, status.Error(codes.NotFound, "Email not found")
	}

	otp := fmt.Sprintf("%06d", rand.Intn(1000000))

	if err := SaveOTP(s.rdb, req.Email, otp); err != nil {
		return nil, status.Error(codes.Internal, "Failed to save OTP")
	}

	// Run in go routine to not block API
	go func() {
		if err := SendOTPEmail(req.Email, otp); err != nil {
			log.Printf("Failed to send OTP email: %v", err)
		}
	}()

	return &pb.ApiResponse{
		Message: "OTP send to given email",
	}, nil
}
