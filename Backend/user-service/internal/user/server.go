package user

import (
	"database/sql"
	"log"
	"os"

	pb "e_veda/proto/userpb"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	db          *sql.DB
	minioClient *minio.Client
	rdb         *redis.Client
}

func NewUserServer(db *sql.DB, rdb *redis.Client) *Server {
        endpoint := os.Getenv("MINIO_ENDPOINT")
        if endpoint == "" {
                endpoint = "minio:9000" // Fallback to internal network name
        }

        // Dynamically fetch YOUR custom credentials from the environment variables
        accessKey := os.Getenv("MINIO_ACCESS_KEY")
        secretKey := os.Getenv("MINIO_SECRET_KEY")

        log.Printf("Connecting to MinIO at endpoint: %s", endpoint)

        // Initialize minio client using your actual variables
        minioClient, err := minio.New(endpoint, &minio.Options{
                Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
                Secure: false,
        })
        if err != nil {
                log.Fatalf("Failed to initialize MinIO client: %v", err)
        }

        return &Server{db: db, minioClient: minioClient, rdb: rdb}
}
