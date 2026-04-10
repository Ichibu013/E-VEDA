package main

import (
	"database/sql"
	pb "e_veda/proto/userpb"
	"e_veda/user/internal/user"
	"log"
	"net"
	"os"

	"google.golang.org/grpc"
)

func main() {
	// Start DB
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:root@localhost:5432/e_veda?sslmode=disable"
	}
	log.Println("Initializing User database...")
	usersDB, err := user.InitUsersDB(dbURL)
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
	historyDB, err := user.InitReportsTable(dbURL)
	if err != nil {
		log.Fatalf("Database initialization failed for reports_history: %v", err)
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			panic(err)
		}
	}(historyDB)

	// Start Server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// Register gRPC Server
	grpcServer := grpc.NewServer()

	// Instantiate server
	pb.RegisterUserServiceServer(grpcServer, user.NewUserServer(usersDB))

	log.Printf("User Service listening at %v", lis.Addr())
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
