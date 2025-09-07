package store

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3" // SQLite driver

	"github.com/KolesnikovP/typing_hero/models"
)

// UserStore now interacts with the SQLite database
type UserStore struct {
	Db *sql.DB
}

// NewUserStore initializes a new UserStore with a SQLite database connection
func NewUserStore(dataSourceName string) (*UserStore, error) {
	db, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Create tables if they don't exist
	if err = createTables(db); err != nil {
		return nil, fmt.Errorf("failed to create tables: %w", err)
	}

	return &UserStore{Db: db}, nil
}

// createTables creates necessary database tables if they don't exist
func createTables(db *sql.DB) error {
	usersTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		email TEXT UNIQUE,
		name TEXT
	);`

	_, err := db.Exec(usersTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create users table: %w", err)
	}

	resultsTableSQL := `
	CREATE TABLE IF NOT EXISTS results (
		id TEXT PRIMARY KEY,
		userId TEXT,
		wpm INTEGER,
		accuracy REAL,
		duration INTEGER,
		timestamp TEXT,
		FOREIGN KEY (userId) REFERENCES users(id)
	);`

	_, err = db.Exec(resultsTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create results table: %w", err)
	}

	return nil
}

// GetOrCreateUser retrieves a user by email or creates a new one if not found
func (s *UserStore) GetOrCreateUser(email, name string) (*models.User, error) {
	row := s.Db.QueryRow("SELECT id, email, name FROM users WHERE email = ?", email)
	user := &models.User{}
	err := row.Scan(&user.ID, &user.Email, &user.Name)

	if err == nil {
		return user, nil // User found
	}

	if err != sql.ErrNoRows {
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

	user.ID = fmt.Sprintf("user-%s", email)
	user.Email = email
	user.Name = name

	_, err = s.Db.Exec("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", user.ID, user.Email, user.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to insert user: %w", err)
	}

	return user, nil
}

// GetUserByID retrieves a user by their ID
func (s *UserStore) GetUserByID(id string) (*models.User, error) {
	row := s.Db.QueryRow("SELECT id, email, name FROM users WHERE id = ?", id)
	user := &models.User{}
	err := row.Scan(&user.ID, &user.Email, &user.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to query user by ID: %w", err)
	}
	return user, nil
}

// SaveTypingResult saves a typing result to the database
func (s *UserStore) SaveTypingResult(result *models.TypingResult) error {
	_, err := s.Db.Exec(
		"INSERT INTO results (id, userId, wpm, accuracy, duration, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
		result.ID, result.UserID, result.WPM, result.Accuracy, result.Duration, result.Timestamp,
	)
	if err != nil {
		return fmt.Errorf("failed to insert typing result: %w", err)
	}
	return nil
}
