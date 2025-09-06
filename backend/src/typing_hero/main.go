package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"google.golang.org/api/idtoken"
)

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type UserStore struct {
	mu    sync.Mutex
	users map[string]*User
}

func NewUserStore() *UserStore {
	return &UserStore{
		users: make(map[string]*User),
	}
}

func (s *UserStore) GetOrCreateUser(email, name string) (*User, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if user, ok := s.users[email]; ok {
		return user,
			nil
	}

	user := &User{
		ID:    fmt.Sprintf("user-%d", len(s.users)+1),
		Email: email,
		Name:  name,
	}
	s.users[email] = user
	return user, nil
}

var userStore = NewUserStore()

func googleAuthHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received /auth/google request. Method: %s", r.Method)
	if r.Method != http.MethodPost {
		log.Printf("Invalid method for /auth/google. Expected POST, got %s", r.Method)
		http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
		return
	}

	var requestBody struct {
		Token string `json:"token"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		log.Printf("Invalid request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Request body token (first 10 chars): %s...", requestBody.Token[:min(len(requestBody.Token), 10)])
	if requestBody.Token == "" {
		http.Error(w, "ID token is missing", http.StatusBadRequest)
		return
	}

	// TODO: Replace with your actual Google Client ID
	clientID := "438368812544-uc3sdm9o25musceebgoras294j9vh5ki.apps.googleusercontent.com"

	payload, err := idtoken.Validate(context.Background(), requestBody.Token, clientID)
	// If you have a list of audience values, you can pass them as extra arguments.
	// E.g. "foo.example.com", "bar.example.com"
	if err != nil {
		log.Printf("Error validating ID token: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)
	log.Printf("Successfully validated token for user: %s (%s)", name, email)

	user, err := userStore.GetOrCreateUser(email, name)
	if err != nil {
		log.Printf("Error getting or creating user: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	log.Printf("Responded to /auth/google with user data for %s", email)
}

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
		fmt.Fprintln(w, "Welcome to the Typing Hero Backend!")
	}).Methods("GET")

	router.HandleFunc("/auth/google", googleAuthHandler).Methods("POST")

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
	})

	handler := c.Handler(router)
	log.Println("Server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
