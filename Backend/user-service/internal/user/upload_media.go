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
	// 1. CHECK IF BUCKET EXISTS
	exists, err := s.minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		log.Printf("Error checking if bucket %s exists: %v", bucketName, err)
		return "", err
	}

	// 2. CREATE BUCKET IF IT DOES NOT EXIST
	if !exists {
		log.Printf("Bucket '%s' does not exist. Creating it now...", bucketName)
		err = s.minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("Error creating bucket %s: %v", bucketName, err)
			return "", err
		}
		log.Printf("Successfully created bucket: %s", bucketName)

		policy := fmt.Sprintf(`{"Version": "2012-10-17", "Statement": [{"Action": ["s3:GetObject"], "Effect": "Allow", "Principal": {"AWS": ["*"]}, "Resource": ["arn:aws:s3:::%s/*"]}]}`, bucketName)
		err := s.minioClient.SetBucketPolicy(ctx, bucketName, policy)
		if err != nil {
			return "", err
		}
	}

	objectName := fmt.Sprintf("%s-%s%s", req.GetUserId(), uuid.New().String()[:8], req.GetFileExtension())
	reader := bytes.NewReader(req.GetFileData())

	_, err = s.minioClient.PutObject(ctx, bucketName, objectName, reader, reader.Size(), minio.PutObjectOptions{
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
