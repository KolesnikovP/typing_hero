package textgen

import (
	"math/rand"
	"strings"
	"time"

	"github.com/KolesnikovP/typing_hero/models"
)

// Default word list; can be extended/replaced later (e.g., by language)
var baseWords = []string{
	"time", "word", "type", "line", "code", "quick", "brown", "fox", "jumps", "over",
	"lazy", "dog", "hello", "world", "text", "practice", "keyboard", "speed", "focus", "skill",
	"light", "dark", "mouse", "screen", "window", "frame", "click", "press", "shift", "enter",
}

var punctMarks = []string{",", ".", "!", "?", ":", ";"}

// GenerateText creates a text based on options
func GenerateText(opts models.TextOptions) models.TextResponse {
	// Defaults and guards
	if opts.Length <= 0 {
		opts.Length = 30
	}
	if opts.Length > 500 {
		opts.Length = 500
	}

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	words := make([]string, opts.Length)
	for i := 0; i < opts.Length; i++ {
		w := baseWords[r.Intn(len(baseWords))]
		// Occasionally inject a number token when enabled
		if opts.Numbers && r.Float64() < 0.15 { // ~15% chance
			w = randomNumberToken(r)
		}
		words[i] = w
	}

	content := strings.Join(words, " ")

	if opts.Punctuation {
		content = sprinklePunctuation(r, content)
	}

	id := generateID(r)
	return models.TextResponse{
		ID:       id,
		Content:  content,
		Options:  opts,
		Source:   "generated",
		Language: "en",
	}
}

func randomNumberToken(r *rand.Rand) string {
	// 1–4 digits
	nDigits := 1 + r.Intn(4)
	v := 0
	for range nDigits {
		v = v*10 + r.Intn(10)
	}
	// Avoid leading zeroes turning into 0; if value is 0, re-roll once
	if v == 0 {
		v = 1 + r.Intn(9999)
	}
	return itoa(v)
}

func sprinklePunctuation(r *rand.Rand, s string) string {
	// Insert punctuation after some words; keep it readable
	parts := strings.Split(s, " ")
	for i := 3; i < len(parts); i++ {
		if r.Float64() < 0.12 { // ~12% chance
			mark := punctMarks[r.Intn(len(punctMarks))]
			parts[i] = parts[i] + mark
		}
	}
	// Capitalize first character and characters after terminal punctuation.
	out := strings.Join(parts, " ")
	b := []rune(out)
	if len(b) > 0 {
		b[0] = upper(b[0])
	}
	for i := 1; i < len(b)-2; i++ {
		if b[i] == '.' || b[i] == '!' || b[i] == '?' {
			// capitalize next letter if it's a space then a letter
			if b[i+1] == ' ' {
				b[i+2] = upper(b[i+2])
			}
		}
	}
	return string(b)
}

func generateID(r *rand.Rand) string {
	// Simple time+rand based ID; can be replaced with ULID/UUID later
	return "txt-" + itoa(int(time.Now().Unix())) + "-" + itoa(r.Intn(1_000_000))
}

// Minimal helpers to avoid importing strconv and unicode for tiny needs
func itoa(x int) string {
	if x == 0 {
		return "0"
	}
	neg := false
	if x < 0 {
		neg = true
		x = -x
	}
	buf := make([]byte, 0, 12)
	for x > 0 {
		d := x % 10
		buf = append(buf, byte('0'+d))
		x /= 10
	}
	// reverse
	for i, j := 0, len(buf)-1; i < j; i, j = i+1, j-1 {
		buf[i], buf[j] = buf[j], buf[i]
	}
	if neg {
		return "-" + string(buf)
	}
	return string(buf)
}

func upper(r rune) rune {
	if r >= 'a' && r <= 'z' {
		return r - ('a' - 'A')
	}
	return r
}
