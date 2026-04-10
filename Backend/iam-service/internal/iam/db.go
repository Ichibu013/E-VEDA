package iam

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
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

	createUserTableQuery := `CREATE TABLE IF NOT EXISTS e_veda_iam_users (
    user_uuid UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
	);`

	if _, err = db.Exec(createUserTableQuery); err != nil {
		log.Println("Error creating IAM users table")
	}

	return db, nil
}
