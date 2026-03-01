package user

import (
	"database/sql"
	pb "e_veda/proto/userpb"

	_ "github.com/lib/pq"
)

type Server struct {
	pb.UnimplementedUserServiceServer
	db *sql.DB
}

func NewUserServer(db *sql.DB) *Server {
	return &Server{db: db}
}
