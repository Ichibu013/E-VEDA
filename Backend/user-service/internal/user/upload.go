package user

import (
	"bytes"
	"context"
	pb "e_veda/proto/userpb"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) UploadProfilePicture(ctx context.Context, req *pb.UploadProfilePictureRequest) (*pb.ApiResponse, error) {
	log.Printf("Uploading profile picture for user: %s", req.GetUserId())

	bucketName := "e-veda-profiles"
	objectName := fmt.Sprintf("%s-%s%s", req.GetUserId(), uuid.New().String()[:8], req.GetFileExtension())

	reader := bytes.NewReader(req.GetFileData())

	// 1. Upload to MinIO
	_, err := s.minioClient.PutObject(ctx, bucketName, objectName, reader, reader.Size(), minio.PutObjectOptions{
		ContentType: req.GetContentType(),
	})
	if err != nil {
		log.Printf("MinIO upload error: %v", err)
		return nil, status.Error(codes.Internal, "Failed to upload image to storage")
	}

	// 2. Construct the public URL (Assuming MinIO is accessible via localhost:9000 externally)
	fileURL := fmt.Sprintf("https://eveda.in/minio-storage/%s/%s", bucketName, objectName)

	// 3. Save URL to Database
	query := `UPDATE e_veda_users SET profile_picture = $1 WHERE iam_id = $2`
	_, err = s.db.ExecContext(ctx, query, fileURL, req.GetUserId())
	if err != nil {
		log.Printf("Database error updating profile picture: %v", err)
		return nil, status.Error(codes.Internal, "Failed to save profile picture URL")
	}

	return &pb.ApiResponse{
		Message: fileURL, // Returning the URL in the message for convenience
	}, nil
}
