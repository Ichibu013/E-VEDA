package user

import (
	"database/sql"
	"log"
	"os"

	pb "e_veda/proto/userpb"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	db          *sql.DB
	minioClient *minio.Client
}

func NewUserServer(db *sql.DB) *Server {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	if endpoint == "" {
		endpoint = "localhost:9000"
	}

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4("minioadmin", "minioadmin", ""),
		Secure: false,
	})
	if err != nil {
		log.Fatalf("Failed to initialize MinIO client: %v", err)
	}

	return &Server{db: db, minioClient: minioClient}
}
