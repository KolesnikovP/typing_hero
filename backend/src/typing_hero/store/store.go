package store

import (
    "database/sql"
    "fmt"
    "strings"

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

    // Best-effort data backfill for existing rows
    if err = backfillMissingUserFields(db); err != nil {
        return nil, fmt.Errorf("failed to backfill users: %w", err)
    }

    return &UserStore{Db: db}, nil
}

// createTables creates necessary database tables if they don't exist
func createTables(db *sql.DB) error {
    usersTableSQL := `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        username TEXT,
        avatar TEXT
    );`

    _, err := db.Exec(usersTableSQL)
    if err != nil {
        return fmt.Errorf("failed to create users table: %w", err)
    }

    // Best-effort schema migration for older databases
    // Add missing columns if they don't exist. Ignore errors if they already exist.
    _, _ = db.Exec("ALTER TABLE users ADD COLUMN username TEXT")
    _, _ = db.Exec("ALTER TABLE users ADD COLUMN avatar TEXT")

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
    row := s.Db.QueryRow("SELECT id, email, name, COALESCE(username, ''), COALESCE(avatar, '') FROM users WHERE email = ?", email)
    user := &models.User{}
    err := row.Scan(&user.ID, &user.Email, &user.Name, &user.Username, &user.Avatar)

	if err == nil {
		return user, nil // User found
	}

	if err != sql.ErrNoRows {
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

    user.ID = fmt.Sprintf("user-%s", email)
    user.Email = email
    user.Name = name
    // Prefer provided name as username; fallback to email local-part
    if strings.TrimSpace(name) != "" {
        user.Username = name
    } else {
        user.Username = extractUsernameFromEmail(email)
    }
    user.Avatar = ""

    _, err = s.Db.Exec("INSERT INTO users (id, email, name, username, avatar) VALUES (?, ?, ?, ?, ?)", user.ID, user.Email, user.Name, user.Username, user.Avatar)
    if err != nil {
        return nil, fmt.Errorf("failed to insert user: %w", err)
    }

    return user, nil
}

// GetUserByID retrieves a user by their ID
func (s *UserStore) GetUserByID(id string) (*models.User, error) {
    row := s.Db.QueryRow("SELECT id, email, name, COALESCE(username, ''), COALESCE(avatar, '') FROM users WHERE id = ?", id)
    user := &models.User{}
    err := row.Scan(&user.ID, &user.Email, &user.Name, &user.Username, &user.Avatar)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, fmt.Errorf("user not found")
        }
        return nil, fmt.Errorf("failed to query user by ID: %w", err)
    }
    return user, nil
}

// UpdateUser updates allowed user fields and returns the updated record
func (s *UserStore) UpdateUser(userID string, updates map[string]interface{}) (*models.User, error) {
    // Whitelist of updatable fields
    allowed := map[string]bool{
        "email": true,
        "name": true,
        "username": true,
        "avatar": true,
    }

    setParts := []string{}
    args := []interface{}{}
    for k, v := range updates {
        if allowed[k] {
            setParts = append(setParts, fmt.Sprintf("%s = ?", k))
            args = append(args, v)
        }
    }
    if len(setParts) == 0 {
        // Nothing to update; return current user
        return s.GetUserByID(userID)
    }

    args = append(args, userID)
    query := fmt.Sprintf("UPDATE users SET %s WHERE id = ?", joinWithComma(setParts))
    if _, err := s.Db.Exec(query, args...); err != nil {
        return nil, fmt.Errorf("failed to update user: %w", err)
    }
    return s.GetUserByID(userID)
}

func joinWithComma(parts []string) string {
    if len(parts) == 0 {
        return ""
    }
    out := parts[0]
    for i := 1; i < len(parts); i++ {
        out += ", " + parts[i]
    }
    return out
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

// backfillMissingUserFields ensures username and avatar are populated for existing users
func backfillMissingUserFields(db *sql.DB) error {
    rows, err := db.Query("SELECT id, email, name, username, avatar FROM users")
    if err != nil {
        return err
    }
    defer rows.Close()

    type rec struct {
        id       string
        email    string
        name     sql.NullString
        username sql.NullString
        avatar   sql.NullString
    }

    updates := []rec{}
    for rows.Next() {
        var r rec
        if err := rows.Scan(&r.id, &r.email, &r.name, &r.username, &r.avatar); err != nil {
            return err
        }
        needsUpdate := false
        if !r.username.Valid || strings.TrimSpace(r.username.String) == "" {
            // Prefer name for username if present; else fallback to email local-part
            var uname string
            if r.name.Valid && strings.TrimSpace(r.name.String) != "" {
                uname = r.name.String
            } else {
                uname = extractUsernameFromEmail(r.email)
            }
            r.username = sql.NullString{String: uname, Valid: true}
            needsUpdate = true
        }
        if !r.avatar.Valid {
            r.avatar = sql.NullString{String: "", Valid: true}
            needsUpdate = true
        }
        if needsUpdate {
            updates = append(updates, r)
        }
    }
    if err := rows.Err(); err != nil {
        return err
    }
    for _, u := range updates {
        if _, err := db.Exec("UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar) WHERE id = ?", u.username.String, u.avatar.String, u.id); err != nil {
            return err
        }
    }
    return nil
}

func extractUsernameFromEmail(email string) string {
    if i := strings.IndexByte(email, '@'); i > 0 {
        return email[:i]
    }
    return email
}
