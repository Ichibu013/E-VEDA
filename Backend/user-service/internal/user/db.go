package user

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

	log.Println("Successfully connected to User database")

	// Updated schema based on requirements
	createTableQuery := `CREATE TABLE IF NOT EXISTS e_veda_users (
		iam_id VARCHAR(255) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		full_name VARCHAR(255),
		nickname VARCHAR(255),
		age INT,
		date_of_birth DATE,
		gender VARCHAR(50),
		phone_number VARCHAR(50),
		address TEXT,
		medical_history JSONB,
		emergency_contact JSONB,
		profile_picture TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err = db.Exec(createTableQuery); err != nil {
		log.Fatalf("Failed to create users table: %v\n", err)
	}

	// ALTER queries to ensure existing tables have the columns
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS date_of_birth DATE")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS gender VARCHAR(50)")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50)")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS address TEXT")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS medical_history JSONB")
	_, _ = db.Exec("ALTER TABLE e_veda_users ADD COLUMN IF NOT EXISTS emergency_contact JSONB")

	createReportsTableQuery := `CREATE TABLE IF NOT EXISTS reports_history (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		user_uuid VARCHAR(255) REFERENCES e_veda_users(iam_id) ON DELETE CASCADE,
		report_creation_date DATE NOT NULL,
		report_creation_time TIME NOT NULL,
		minio_audio_file_url TEXT,
		minio_video_file_url TEXT,
		analysis_result JSONB,
		confidence_rate DECIMAL(5,2),
		accuracy_rate DECIMAL(5,2),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := db.Exec(createReportsTableQuery); err != nil {
		log.Fatalf("Failed to create reports_history table: %v\n", err)
	}

	log.Println("Successfully verified users and reports_history table schemas")

	return db, nil
}
