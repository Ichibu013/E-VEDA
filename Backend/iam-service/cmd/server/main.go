package main

import (
	"database/sql"
	"e_veda/iam/internal/iam"
	pb "e_veda/proto/iampb"
	"log"
	"net"
	"os"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:root@postgres-db:5432/e_veda?sslmode=disable"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "172.18.0.1:6379"
	}
	log.Println("Initializing IAM database...")
	db, err := iam.InitDB(dbURL)
	if err != nil {
		// If the DB is down or tables fail to create, the app stops here
		log.Fatalf("Database initialization failed for IAM: %v", err)
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Fatalf("ERROR CLOSE DATABASE : %v", err)
		}
	}(db)
	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterIAMServiceServer(grpcServer, iam.NewIAMServer(db, rdb))

	log.Printf("IAM server listening at %v", lis.Addr())
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("[gRPC] Failed to serve: %v", err)
	}
}
