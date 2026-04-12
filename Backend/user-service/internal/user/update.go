package user

import (
	"context"
	pb "e_veda/proto/userpb"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) UpdateUser(ctx context.Context, req *pb.ProfileUpdateRequest) (*pb.ApiResponse, error) {
	log.Printf("Updating user profile for id: %s", req.GetUserId())

	query := `UPDATE e_veda_users SET name = $1, full_name = $2, nickname = $3, age = $4, date_of_birth = $5, gender = $6, phone_number = $7, address = $8, medical_history = $9, emergency_contact = $10, updated_at = CURRENT_TIMESTAMP WHERE iam_id = $11`

	var dob interface{} = nil
	if req.GetDateOfBirth() != "" {
		dob = req.GetDateOfBirth()
	}

	res, err := s.db.ExecContext(ctx, query,
		req.GetFullName(),
		req.GetFullName(),
		req.GetNickname(),
		req.GetAge(),
		dob,
		req.GetGender(),
		req.GetPhoneNumber(),
		req.GetAddress(),
		req.GetMedicalHistory(),
		req.GetEmergencyContact(),
		req.GetUserId(),
	)
	if err != nil {
		log.Printf("Database error during user update: %s", err)
		return nil, status.Error(codes.Internal, "Failed to update user profile")
	}

	// Optional: Check if the user actually existed to be updated
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return nil, status.Error(codes.NotFound, "User not found")
	}

	return &pb.ApiResponse{
		Message: "User Profile Updated Successfully",
	}, nil
}
