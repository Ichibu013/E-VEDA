package user

import (
	"context"
	"database/sql" // ADDED: required for sql.NullString and sql.NullInt64
	pb "e_veda/proto/userpb"
	"errors"
	"log"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.UserResponse, error) {
	log.Printf("Fetching user from database: %s", req.UserId)

	var name string
	var fullName, nickname, profilePicture, gender, phoneNumber, address, medicalHistory, emergencyContact sql.NullString
	var dateOfBirth sql.NullTime
	var createdAt time.Time
	var age sql.NullInt64

	query := `SELECT name, full_name, nickname, age, profile_picture, date_of_birth, gender, phone_number, address, medical_history, emergency_contact, created_at 
	          FROM e_veda_users WHERE iam_id = $1`
	err := s.db.QueryRowContext(ctx, query, req.UserId).Scan(
		&name, &fullName, &nickname, &age, &profilePicture, &dateOfBirth, &gender, &phoneNumber, &address, &medicalHistory, &emergencyContact, &createdAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.NotFound, "User not found")
		}
		log.Printf("Error fetching user: %s", err.Error())
		return nil, status.Error(codes.Internal, "Internal server error")
	}

	dobStr := ""
	if dateOfBirth.Valid {
		dobStr = dateOfBirth.Time.Format("2006-01-02")
	}

	return &pb.UserResponse{
		FullName:         fullName.String,
		Nickname:         nickname.String,
		Age:              age.Int64,
		ProfilePicture:   profilePicture.String,
		DateOfBirth:      dobStr,
		Gender:           gender.String,
		PhoneNumber:      phoneNumber.String,
		Address:          address.String,
		MedicalHistory:   medicalHistory.String,
		EmergencyContact: emergencyContact.String,
		CreatedAt:        createdAt.Format(time.RFC3339),
	}, nil
}
