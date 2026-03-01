package iam

import (
	"database/sql"
	pb "e_veda/proto/iampb"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecretKey = []byte("your-e_veda-jwt-secret-key")

type Claims struct {
	UserUUID string `json:"user_uuid"`
	jwt.RegisteredClaims
}

type Server struct {
	pb.UnimplementedIAMServiceServer
	db *sql.DB
}

func NewIAMServer(db *sql.DB) *Server {
	return &Server{db: db}
}
