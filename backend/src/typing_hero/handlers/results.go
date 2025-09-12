package handlers

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/KolesnikovP/typing_hero/models"
    "github.com/KolesnikovP/typing_hero/store"
)

// SubmitResultHandler handles submission of typing session results.
func SubmitResultHandler(userStore *store.UserStore) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
            http.Error(w, "Only POST requests are allowed", http.StatusMethodNotAllowed)
            return
        }
        var result models.TypingResult
        if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }
        result.ID = fmt.Sprintf("result-%d", time.Now().UnixNano())
        if err := userStore.SaveTypingResult(&result); err != nil {
            log.Printf("Error inserting typing result: %v", err)
            http.Error(w, "Failed to store result", http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusCreated)
        _ = json.NewEncoder(w).Encode(result)
    }
}

