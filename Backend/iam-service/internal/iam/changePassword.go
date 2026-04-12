package iam

import (
	"context"
	"database/sql"
	pb "e_veda/proto/iampb"
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) UpdatePassword(ctx context.Context, request *pb.ChangePasswordRequest) (*pb.ApiResponse, error) {
	log.Printf("Received Change Password Request for user with id : %s", request.UserUuid)

	var oldPasswordHash string

	query := `SELECT password_hash FROM e_veda_iam_users WHERE user_uuid = $1`

	err := s.db.QueryRowContext(ctx, query, request.UserUuid).Scan(&oldPasswordHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.NotFound, "User not found")
		}
		log.Printf("Database error fetching password: %v", err)
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	err = bcrypt.CompareHashAndPassword([]byte(oldPasswordHash), []byte(request.OldPassword))
	if err != nil {
		log.Printf("Old password does not match for user: %s", request.UserUuid)
		return nil, status.Error(codes.Unauthenticated, "Incorrect old password")
	}

	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing new password: %v", err)
		return nil, status.Error(codes.Internal, "Failed to secure new password")
	}

	updateQuery := `UPDATE e_veda_iam_users SET password_hash = $1 WHERE user_uuid = $2`
	_, err = s.db.ExecContext(ctx, updateQuery, string(newHashedPassword), request.UserUuid)
	if err != nil {
		log.Printf("Database error updating password: %v", err)
		return nil, status.Error(codes.Internal, "Failed to update password")
	}

	return &pb.ApiResponse{
		Message: "Password updated successfully",
	}, nil

}
