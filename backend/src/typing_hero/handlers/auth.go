package handlers

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"

    "google.golang.org/api/idtoken"

    "github.com/KolesnikovP/typing_hero/store"
)

// GoogleAuthHandler handles Google authentication requests.
func GoogleAuthHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
            http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
            return
        }

        var requestBody struct {
            Token string `json:"token"`
        }
        if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }
        if requestBody.Token == "" {
            http.Error(w, "ID token is missing", http.StatusBadRequest)
            return
        }

        clientID := os.Getenv("GOOGLE_CLIENT_ID")
        if clientID == "" {
            log.Printf("GOOGLE_CLIENT_ID is not set")
            http.Error(w, "Server misconfiguration", http.StatusInternalServerError)
            return
        }

        payload, err := idtoken.Validate(context.Background(), requestBody.Token, clientID)
        if err != nil {
            log.Printf("Error validating ID token: %v", err)
            http.Error(w, "Internal server error", http.StatusInternalServerError)
            return
        }

        email, _ := payload.Claims["email"].(string)
        name, _ := payload.Claims["name"].(string)
        user, err := userStore.GetOrCreateUser(email, name)
        if err != nil {
            log.Printf("Error getting or creating user: %v", err)
            http.Error(w, "Internal server error", http.StatusInternalServerError)
            return
        }

        log.Printf("User signed in via Google: id=%s, email=%s", user.ID, user.Email)
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(user)
    }
}

// LoginHandler handles local email/username + password login.
func LoginHandler(userStore *store.UserStore) http.HandlerFunc {
    type req struct {
        Identifier string `json:"identifier"`
        // Backward compatibility with older clients
        Username   string `json:"username"`
        Email      string `json:"email"`
        Password   string `json:"password"`
    }
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
            http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
            return
        }
        var body req
        if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }
        id := body.Identifier
        if id == "" {
            if body.Username != "" {
                id = body.Username
            } else {
                id = body.Email
            }
        }
        if id == "" || body.Password == "" {
            http.Error(w, "identifier and password are required", http.StatusBadRequest)
            return
        }
        user, err := userStore.AuthenticateLocalUser(id, body.Password)
        if err != nil {
            log.Printf("local login failed for %s: %v", id, err)
            http.Error(w, "invalid credentials", http.StatusUnauthorized)
            return
        }
        log.Printf("User signed in: id=%s, identifier=%s", user.ID, id)
        w.Header().Set("Content-Type", "application/json")
        _ = json.NewEncoder(w).Encode(user)
    }
}

// RegisterHandler handles local registration.
// Requires: email, password. Optional: username, name.
func RegisterHandler(userStore *store.UserStore) http.HandlerFunc {
    type req struct {
        Email    string `json:"email"`
        Username string `json:"username"`
        Password string `json:"password"`
        Name     string `json:"name"`
    }
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
            http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
            return
        }
        var body req
        if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }
        if body.Email == "" || body.Password == "" {
            http.Error(w, "email and password are required", http.StatusBadRequest)
            return
        }
        user, err := userStore.CreateLocalUser(body.Username, body.Password, body.Name, body.Email)
        if err != nil {
            if store.IsConflict(err) {
                http.Error(w, err.Error(), http.StatusConflict)
                return
            }
            log.Printf("local registration failed for %s: %v", body.Username, err)
            http.Error(w, "failed to register user", http.StatusInternalServerError)
            return
        }
        log.Printf("User registered: id=%s, email=%s, username=%s", user.ID, user.Email, user.Username)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusCreated)
        _ = json.NewEncoder(w).Encode(user)
    }
}
