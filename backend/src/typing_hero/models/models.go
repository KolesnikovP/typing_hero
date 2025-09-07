package models

// User represents a user in the system
type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// TypingResult represents a user's typing session performance
type TypingResult struct {
	ID        string  `json:"id"`
	UserID    string  `json:"userId"`
	WPM       int     `json:"wpm"`
	Accuracy  float64 `json:"accuracy"`
	Duration  int     `json:"duration"` // Duration in seconds
	Timestamp string  `json:"timestamp"`
}
