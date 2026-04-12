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

// ==========================================
// Reusable Helper Function
// ==========================================

// uploadMediaToMinio handles the repetitive MinIO upload logic and returns the public URL
func (s *Server) uploadMediaToMinio(ctx context.Context, bucketName string, req *pb.UploadProfilePictureRequest) (string, error) {
	objectName := fmt.Sprintf("%s-%s%s", req.GetUserId(), uuid.New().String()[:8], req.GetFileExtension())
	reader := bytes.NewReader(req.GetFileData())

	_, err := s.minioClient.PutObject(ctx, bucketName, objectName, reader, reader.Size(), minio.PutObjectOptions{
		ContentType: req.GetContentType(),
	})
	if err != nil {
		log.Printf("MinIO upload Error for bucket %s: %v", bucketName, err)
		return "", err
	}

	// Note: In production, change localhost to your actual domain name
	return fmt.Sprintf("http://localhost:9000/%s/%s", bucketName, objectName), nil
}

// ==========================================
// RPC Handlers
// ==========================================

func (s *Server) UploadAudio(ctx context.Context, req *pb.UploadProfilePictureRequest) (*pb.ApiResponse, error) {
	log.Printf("Uploading audio for user: %s", req.GetUserId())

	// 1. Upload using the helper function
	fileURL, err := s.uploadMediaToMinio(ctx, "e-veda-audios", req)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to upload audio to storage")
	}

	return &pb.ApiResponse{
		Message: fileURL,
	}, nil
}

func (s *Server) UploadVideo(ctx context.Context, req *pb.UploadProfilePictureRequest) (*pb.ApiResponse, error) {
	log.Printf("Uploading video for user: %s", req.GetUserId())

	// 1. Upload using the helper function
	fileURL, err := s.uploadMediaToMinio(ctx, "e-veda-videos", req)
	if err != nil {
		return nil, status.Error(codes.Internal, "Failed to upload video to storage")
	}

	return &pb.ApiResponse{
		Message: fileURL,
	}, nil
}
