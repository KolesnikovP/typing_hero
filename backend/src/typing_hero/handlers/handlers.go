package handlers

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"

    "google.golang.org/api/idtoken"

    "github.com/KolesnikovP/typing_hero/models"
    "github.com/KolesnikovP/typing_hero/store"
    "github.com/gorilla/mux"
)

// GoogleAuthHandler handles Google authentication requests.
func GoogleAuthHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
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

        if requestBody.Token == "" {
            http.Error(w, "ID token is missing", http.StatusBadRequest)
            return
        }

        // Read Google Client ID from environment
        clientID := os.Getenv("GOOGLE_CLIENT_ID")
        if clientID == "" {
            log.Printf("GOOGLE_CLIENT_ID is not set")
            http.Error(w, "Server misconfiguration", http.StatusInternalServerError)
            return
        }

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
}

// SubmitResultHandler handles submission of typing session results.
func SubmitResultHandler(userStore *store.UserStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received /results request. Method: %s", r.Method)
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
			return
		}

		var result models.TypingResult
		err := json.NewDecoder(r.Body).Decode(&result)
		if err != nil {
			log.Printf("Invalid request body for /results: %v", err)
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Generate a unique ID for the result (consider UUID in production)
		result.ID = fmt.Sprintf("result-%d", time.Now().UnixNano())

		// Store the result in the database
		err = userStore.SaveTypingResult(&result)
		if err != nil {
			log.Printf("Error inserting typing result: %v", err)
			http.Error(w, "Failed to store result", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(result)
		log.Printf("Successfully stored typing result for user %s: WPM=%d, Accuracy=%.2f%%", result.UserID, result.WPM, result.Accuracy)
	}
}

// GetUserHandler fetches a user's data by ID.
func GetUserHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Printf("Received /user/{id} request. Method: %s", r.Method)
        if r.Method != http.MethodGet {
            http.Error(w, "Only GET requests are allowed", http.StatusMethodNotAllowed)
            return
        }

		vars := mux.Vars(r)
		userID := vars["id"]
		if userID == "" {
			http.Error(w, "User ID is missing", http.StatusBadRequest)
			return
		}

		user, err := userStore.GetUserByID(userID)
		if err != nil {
			log.Printf("Error fetching user by ID %s: %v", userID, err)
			http.Error(w, "User not found or internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(user)
        log.Printf("Successfully fetched user data for ID: %s", userID)
    }
}

// UpdateUserHandler updates a user's profile fields.
func UpdateUserHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Printf("Received /users/{id} request. Method: %s", r.Method)
        if r.Method != http.MethodPut {
            http.Error(w, "Only PUT requests are allowed", http.StatusMethodNotAllowed)
            return
        }

        vars := mux.Vars(r)
        userID := vars["id"]
        if userID == "" {
            http.Error(w, "User ID is missing", http.StatusBadRequest)
            return
        }

        var updates map[string]interface{}
        if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
            log.Printf("Invalid request body for /users/{id}: %v", err)
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }

        updated, err := userStore.UpdateUser(userID, updates)
        if err != nil {
            log.Printf("Error updating user: %v", err)
            http.Error(w, "Failed to update user", http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(updated)
        log.Printf("Updated user %s successfully", userID)
    }
}
