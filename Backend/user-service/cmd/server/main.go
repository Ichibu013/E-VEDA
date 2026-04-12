package main

import (
	"database/sql"
	pb "e_veda/proto/userpb"
	"e_veda/user/internal/user"
	"log"
	"net"
	"os"

	"github.com/redis/go-redis/v9"
	"google.golang.org/grpc"
)

func main() {
	// Start DB
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:root@postgres-db:5432/e_veda?sslmode=disable"
	}
	// Connect Redis
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379" // Fallback for local testing
	}
	rdb := redis.NewClient(&redis.Options{
		Addr: redisURL,
	})

	log.Println("Initializing User database...")
	usersDB, err := user.InitDB(dbURL)
	if err != nil {
		// If the DB is down or tables fail to create, the app stops here
		log.Fatalf("Database initialization failed for user: %v", err)
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			panic(err)
		}
	}(usersDB)

	// Start Server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// Register gRPC Server
	maxMsgSize := 1024 * 1024 * 250
	grpcServer := grpc.NewServer(
		grpc.MaxRecvMsgSize(maxMsgSize),
		grpc.MaxSendMsgSize(maxMsgSize),
	)

	// Instantiate server
	pb.RegisterUserServiceServer(grpcServer, user.NewUserServer(usersDB, rdb))

	log.Printf("User Service listening at %v", lis.Addr())
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
