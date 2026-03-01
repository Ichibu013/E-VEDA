package iam

import (
	"database/sql"
	"log"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func InitDB(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Connected to IAM database")

	createUserTableQuery := `CREATE TABLE IF NOT EXISTS iam_users (
    user_uuid UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
	);`

	if _, err = db.Exec(createUserTableQuery); err != nil {
		log.Println("Error creating IAM users table")
	}

	// Set a test user
	seedEmail := "ansharma013@gmail.com"
	seedUUID := uuid.New().String()
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("ansh2004"), bcrypt.DefaultCost)

	insertSeedQuery := `INSERT INTO iam_users (user_uuid, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING;`

	if _, err = db.Exec(insertSeedQuery, seedUUID, seedEmail, hashedPassword); err != nil {
		log.Println("WARNING: Error inserting seed record")
	}

	return db, nil
}
