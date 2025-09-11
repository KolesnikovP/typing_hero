package models

// User represents a user in the system
type User struct {
    ID       string `json:"id"`
    Email    string `json:"email"`
    Name     string `json:"name"`
    Username string `json:"username"`
    Avatar   string `json:"avatar"`
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

// TextOptions capture generation parameters for a typing text
type TextOptions struct {
    Length      int  `json:"length"`      // number of words (approx)
    Punctuation bool `json:"punctuation"` // include punctuation
    Numbers     bool `json:"numbers"`     // include numbers
}

// TextResponse is the response payload for a generated text
type TextResponse struct {
    ID       string      `json:"id"`
    Content  string      `json:"content"`
    Options  TextOptions `json:"options"`
    Source   string      `json:"source"`   // e.g., "generated"
    Language string      `json:"language"` // reserved for future
}
