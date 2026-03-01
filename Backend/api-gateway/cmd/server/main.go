package main

import (
	"api-gateway/internal/gateway"
	"e_veda/proto/iampb"
	"e_veda/proto/userpb"
	"log"
	"net/http"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	iamTarget := os.Getenv("IAM_SERVICE_URL")
	if iamTarget == "" {
		iamTarget = "localhost:50052"
	}

	userTarget := os.Getenv("USER_SERVICE_URL")
	if userTarget == "" {
		userTarget = "localhost:50051"
	}

	// Connect to IAM service
	iamConn, err := grpc.Dial(iamTarget, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Did not connect to IAM: %v", err)
	}
	defer func(iamConn *grpc.ClientConn) {
		err := iamConn.Close()
		if err != nil {
			log.Fatalf("Failed to close IAM connection: %v", err)
		}
	}(iamConn)
	iamClient := iampb.NewIAMServiceClient(iamConn)

	// Connect to User Service
	userConn, err := grpc.Dial(userTarget, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Did not connect to User: %v", err)
	}
	defer func(userConn *grpc.ClientConn) {
		err := userConn.Close()
		if err != nil {
			log.Fatalf("Failed to close User connection: %v", err)
		}
	}(userConn)
	userClient := userpb.NewUserServiceClient(userConn)

	// Initialize router
	router := gateway.NewRouter(iamClient, userClient)

	// Start HTTP Server
	log.Println("API Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatalf("Failed to Sever: %v", err)
	}

}
