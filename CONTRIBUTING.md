# Contributing to Typing Hero

Thanks for contributing! This guide summarizes local setup and commit rules.

## Local Setup
- Frontend
  - Copy `client/.env.example` → `client/.env` and set `VITE_GOOGLE_CLIENT_ID`.
  - Run: `cd client && npm install && npm run dev`.
- Backend
  - Copy `backend/src/typing_hero/.env.example` → `backend/src/typing_hero/.env` and set `GOOGLE_CLIENT_ID`.
  - Run: `cd backend/src/typing_hero && go run main.go`.

## Environment & Secrets
- Do not commit real secrets. `.env` files are gitignored.
- Templates (`.env.example`) are tracked and should contain only placeholders.

## Code Conventions
- Frontend config via `import.meta.env.VITE_*` (use `VITE_API_URL`, default `'/api'`).
- Backend config via env vars (`GOOGLE_CLIENT_ID`, `FRONTEND_ORIGINS`, `PORT`, `DB_PATH`).
- Avoid adding new global defines; use `import.meta.env.DEV` for dev checks.

## Docker
- Local: `docker compose up --build` (requires root `.env` with `GOOGLE_CLIENT_ID`).
- Frontend served by nginx, proxying `/api` → backend.

## PR Guidelines
- Keep diffs small and focused.
- Update README when deployment or env changes.
- Don’t commit db files (`*.db`) or backend binaries.

