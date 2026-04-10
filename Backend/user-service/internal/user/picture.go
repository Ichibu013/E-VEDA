package user

import (
	"context"
	"database/sql"
	pb "e_veda/proto/userpb"
	"errors"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetPictureAndName(ctx context.Context, request *pb.GetUserRequest) (*pb.NameAndPictureResponse, error) {

	var name string
	var profilePictureUrl sql.NullString

	query := `SELECT name, profile_picture FROM e_veda_users WHERE iam_id = $1`

	err := s.db.QueryRowContext(ctx, query, request.UserId).Scan(&name, &profilePictureUrl)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, status.Error(codes.NotFound, "User not found")
		}
		return nil, status.Error(codes.Internal, "Error while fetching user")
	}

	return &pb.NameAndPictureResponse{
		Name:           name,
		ProfilePicture: profilePictureUrl.String,
	}, nil
}
