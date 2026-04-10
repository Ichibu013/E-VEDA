package user

import (
	"database/sql"
	"log"
)

func InitUsersDB(connStr string) (*sql.DB, error) {
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
		nickname VARCHAR(255),
		age INT,
		profile_picture TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err = db.Exec(createTableQuery); err != nil {
		log.Fatalf("Failed to create users table: %v\n", err)
	}

	// Updated seed query utilizing the new schema fields
	insertSeedQuery := `
		INSERT INTO users (iam_id, name, nickname, age, profile_picture) 
		VALUES ('12345', 'Ansh R Sharma', 'Ansharma013', 22, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ansh') 
		ON CONFLICT (iam_id) DO NOTHING;
	`

	if _, err = db.Exec(insertSeedQuery); err != nil {
		log.Fatalf("WARNING: Failed to insert seed data: %v\n", err)
	}

	return db, nil
}

func InitReportsTable(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Successfully connected to User database")

	createReportsTableQuery := `CREATE TABLE IF NOT EXISTS reports_history (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		user_uuid VARCHAR(255) REFERENCES users(iam_id) ON DELETE CASCADE,
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

	log.Println("Successfully verified reports_history table schema")

	return db, nil
}
