package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    "strings"

    "github.com/KolesnikovP/typing_hero/models"
    "github.com/KolesnikovP/typing_hero/textgen"
)

// GenerateTextHandler returns a generated text for typing sessions.
// GET /texts?length=30&punctuation=true&numbers=false
func GenerateTextHandler() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        q := r.URL.Query()

        // Parse length
        length := 30
        if v := q.Get("length"); v != "" {
            if n, err := strconv.Atoi(v); err == nil {
                length = n
            }
        }

        // Parse booleans with flexible values
        punct := parseBool(q.Get("punctuation"), false)
        nums := parseBool(q.Get("numbers"), false)

        opts := models.TextOptions{
            Length:      length,
            Punctuation: punct,
            Numbers:     nums,
        }

        resp := textgen.GenerateText(opts)
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(resp)
    }
}

func parseBool(s string, def bool) bool {
    if s == "" {
        return def
    }
    switch strings.ToLower(strings.TrimSpace(s)) {
    case "1", "true", "yes", "on":
        return true
    case "0", "false", "no", "off":
        return false
    default:
        return def
    }
}

