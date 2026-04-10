package user

import (
	"context"
	"database/sql"
	pb "e_veda/proto/userpb"
	"errors" // Added for modern error checking
	"log"
	"math"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetProfileCompleteness(ctx context.Context, request *pb.GetUserRequest) (*pb.ProfileCompletenessResponse, error) {

	log.Printf("Fetching user profile completeness from database: %s", request.UserId)

	// Updated Query: Now checks for both NULL and empty strings (e.g., just spaces)
	query := `
       SELECT 
          (
             (CASE WHEN name IS NULL OR TRIM(name) = '' THEN 1.0 ELSE 0.0 END) +
             (CASE WHEN nickname IS NULL OR TRIM(nickname) = '' THEN 1.0 ELSE 0.0 END) +
             (CASE WHEN age IS NULL THEN 1.0 ELSE 0.0 END) +
             (CASE WHEN profile_picture IS NULL OR TRIM(profile_picture) = '' THEN 1.0 ELSE 0.0 END) +
             (CASE WHEN height IS NULL THEN 1.0 ELSE 0.0 END) + 
             (CASE WHEN weight IS NULL THEN 1.0 ELSE 0.0 END)
          ) * 100.0 / 6.0 AS null_percentage,
           name
       FROM e_veda_users
       WHERE iam_id = $1;
    `

	var nullPercentage float64
	var name string

	err := s.db.QueryRowContext(ctx, query, request.UserId).Scan(&nullPercentage, &name)
	if err != nil {
		// Best Practice: Use errors.Is() in modern Go (1.13+)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.NotFound, "User not found")
		}
		log.Printf("Database error calculating completion: %v", err)
		return nil, status.Error(codes.Internal, "Database error")
	}

	completedPercentage := 100.0 - nullPercentage

	return &pb.ProfileCompletenessResponse{
		IsCompleted:         completedPercentage == 100.0,
		PercentageCompleted: math.Round(completedPercentage),
		Name:                name,
	}, nil
}
