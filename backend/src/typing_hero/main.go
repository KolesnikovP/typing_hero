package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"
    "time"

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
    // Support multiple CORS origins via comma-separated FRONTEND_ORIGINS,
    // fallback to single FRONTEND_ORIGIN for backward compatibility.
    frontendOrigin := getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    allowedOrigins := parseOrigins(getenv("FRONTEND_ORIGINS", frontendOrigin))
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

    // Liveness probe
    router.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "text/plain; charset=utf-8")
        w.WriteHeader(http.StatusOK)
        _, _ = w.Write([]byte("ok"))
    }).Methods(http.MethodGet)

    // Readiness probe: verifies DB connectivity
    router.HandleFunc("/readyz", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "text/plain; charset=utf-8")
        // Try a short DB ping
        if userStore != nil && userStore.Db != nil {
            if err := userStore.Db.Ping(); err == nil {
                w.WriteHeader(http.StatusOK)
                _, _ = w.Write([]byte("ready"))
                return
            }
        }
        w.WriteHeader(http.StatusServiceUnavailable)
        _, _ = w.Write([]byte("not ready"))
    }).Methods(http.MethodGet)

    // Auth and API routes
    router.HandleFunc("/auth/google", handlers.GoogleAuthHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/login", handlers.LoginHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/register", handlers.RegisterHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/results", handlers.SubmitResultHandler(userStore)).Methods(http.MethodPost)
    router.HandleFunc("/user/{id}", handlers.GetUserHandler(userStore)).Methods(http.MethodGet)
    router.HandleFunc("/users/{id}", handlers.UpdateUserHandler(userStore)).Methods(http.MethodPut)
    router.HandleFunc("/users/{id}", handlers.GetUserHandler(userStore)).Methods(http.MethodGet)
    router.HandleFunc("/texts", handlers.GenerateTextHandler()).Methods(http.MethodGet)

    // CORS middleware
    c := cors.New(cors.Options{
        AllowedOrigins:   allowedOrigins,
        AllowCredentials: true,
        AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
        AllowedHeaders:   []string{"Authorization", "Content-Type"},
        // Cache preflight responses
        MaxAge:           int((12 * time.Hour) / time.Second),
    })

    handler := c.Handler(router)
    log.Printf("Server listening on :%s (DB: %s, CORS: %v)", port, dbPath, allowedOrigins)
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

// parseOrigins splits a comma-separated list of origins and trims spaces.
func parseOrigins(s string) []string {
    parts := strings.Split(s, ",")
    out := make([]string, 0, len(parts))
    for _, p := range parts {
        p = strings.TrimSpace(p)
        if p != "" {
            out = append(out, p)
        }
    }
    if len(out) == 0 {
        return []string{"http://localhost:5173"}
    }
    return out
}
