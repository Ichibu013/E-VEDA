package user

import (
	"database/sql"
	"log"
)

func InitDB(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Successfully connected to User database")

	createTableQuery := `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL
	);`

	if _, err = db.Exec(createTableQuery); err != nil {
		log.Fatalf("Failed to create users table:%v\n", err)
	}

	insertSeedQuery := `INSERT INTO users(id, email, name) VALUES ('12345', 'Ansh Sharma', 'ansharma013@gmail.com') ON CONFLICT (id) DO NOTHING;`

	if _, err = db.Exec(insertSeedQuery); err != nil {
		log.Fatalf("WARNING: Failed to create users table:%v\n", err)
	}

	return db, nil
}
