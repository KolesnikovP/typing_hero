package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"

    "github.com/gorilla/mux"
    "github.com/rs/cors"

    "github.com/KolesnikovP/typing_hero/handlers"
    "github.com/KolesnikovP/typing_hero/store"
)

func main() {
    // Load env vars from .env if present (local dev convenience)
    // Try common locations depending on where the app is run from
    envCandidates := []string{
        ".env",           // when running from backend/src/typing_hero
        "../.env",        // when running from backend/src
        "../../.env",     // when running from backend
        "../../../.env",  // when running from repo root
    }
    for _, p := range envCandidates {
        if err := loadEnvFile(p); err == nil {
            log.Printf("Loaded env from %s", p)
            break
        }
    }

    // Config with sensible defaults
    dbPath := getenv("DB_PATH", "typinghero.db")
    frontendOrigin := getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    port := getenv("PORT", "8080")
    if os.Getenv("GOOGLE_CLIENT_ID") == "" {
        log.Printf("Warning: GOOGLE_CLIENT_ID is not set. Google login will fail until it's provided.")
    }

    // Initialize persistent store (SQLite)
    userStore, err := store.NewUserStore(dbPath)
    if err != nil {
        log.Fatalf("failed to init store: %v", err)
    }

    router := mux.NewRouter()

    // Health/root
    router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
        fmt.Fprintln(w, "Welcome to the Typing Hero Backend!")
    }).Methods(http.MethodGet)

    // Auth and API routes
    router.HandleFunc("/auth/google", handlers.GoogleAuthHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/results", handlers.SubmitResultHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/user/{id}", handlers.GetUserHandler(userStore)).Methods(http.MethodGet)
    router.HandleFunc("/users/{id}", handlers.UpdateUserHandler(userStore)).Methods(http.MethodPut)
    router.HandleFunc("/users/{id}", handlers.GetUserHandler(userStore)).Methods(http.MethodGet)

    // CORS middleware
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{frontendOrigin},
        AllowCredentials: true,
        AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
        AllowedHeaders:   []string{"Authorization", "Content-Type"},
    })

    handler := c.Handler(router)
    log.Printf("Server listening on :%s (DB: %s, CORS: %s)", port, dbPath, frontendOrigin)
    log.Fatal(http.ListenAndServe(":"+port, handler))
}

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

// loadEnvFile loads simple KEY=VALUE pairs from a file into the process env.
// - Ignores blank lines and lines starting with '#'
// - Trims surrounding quotes for values
func loadEnvFile(path string) error {
    b, err := os.ReadFile(path)
    if err != nil {
        return err
    }
    lines := strings.Split(string(b), "\n")
    for _, line := range lines {
        line = strings.TrimSpace(line)
        if line == "" || strings.HasPrefix(line, "#") {
            continue
        }
        // Split at first '='
        idx := strings.IndexRune(line, '=')
        if idx <= 0 {
            continue
        }
        key := strings.TrimSpace(line[:idx])
        val := strings.TrimSpace(line[idx+1:])
        // Trim surrounding quotes if present
        if len(val) >= 2 {
            if (strings.HasPrefix(val, "\"") && strings.HasSuffix(val, "\"")) ||
                (strings.HasPrefix(val, "'") && strings.HasSuffix(val, "'")) {
                val = val[1 : len(val)-1]
            }
        }
        _ = os.Setenv(key, val)
    }
    return nil
}
