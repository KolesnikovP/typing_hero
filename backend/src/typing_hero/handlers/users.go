package handlers

import (
    "encoding/json"
    "log"
    "net/http"

    "github.com/KolesnikovP/typing_hero/store"
    "github.com/gorilla/mux"
)

// GetUserHandler fetches a user's data by ID.
func GetUserHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
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
        _ = json.NewEncoder(w).Encode(user)
    }
}

// UpdateUserHandler updates a user's profile fields.
func UpdateUserHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
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
        _ = json.NewEncoder(w).Encode(updated)
    }
}

