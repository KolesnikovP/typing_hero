# syntax=docker/dockerfile:1

# --- Build stage ---
FROM golang:1.23 AS builder
WORKDIR /src

# Only copy module to leverage Docker layer caching
COPY backend/src/typing_hero/go.mod backend/src/typing_hero/go.sum ./
RUN go mod download

# Now copy the rest of the backend module
COPY backend/src/typing_hero/ ./

# Build with CGO enabled (required for go-sqlite3)
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o /out/typing-hero .

# --- Runtime stage ---
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates tzdata curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV PORT=8080 \
    DB_PATH=/data/typinghero.db \
    FRONTEND_ORIGINS=http://localhost:5173

COPY --from=builder /out/typing-hero /app/typing-hero
RUN mkdir -p /data && useradd -u 10001 -m appuser && chown -R appuser:appuser /data /app
USER appuser

EXPOSE 8080
ENTRYPOINT ["/app/typing-hero"]
