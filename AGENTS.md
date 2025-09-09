# Agent Guidelines for typing_hero

Scope: entire repository.

- Environment files
  - Do NOT commit secrets. Keep local files untracked: `client/.env`, `backend/src/typing_hero/.env`.
  - Templates to commit: `client/.env.example`, `backend/src/typing_hero/.env.example`.
  - Frontend uses `VITE_*` vars (e.g., `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`).
  - Backend uses `GOOGLE_CLIENT_ID`, `FRONTEND_ORIGINS`, `PORT`, `DB_PATH`.

- Frontend conventions
  - Use `import.meta.env` for config; prefer `VITE_API_URL` and default to `'/api'`.
  - Vite dev server proxies `/api` to backend on `http://localhost:8080`.
  - Don’t introduce global define flags (`__API__`, `__IS_DEV__`), use `import.meta.env.DEV`.

- Backend conventions
  - SQLite file controlled by `DB_PATH`; do not commit `.db` files or built binaries.
  - Expose health endpoints: `/healthz`, `/readyz`.
  - CORS origins controlled by `FRONTEND_ORIGINS` (comma-separated).

- Docker & Compose
  - Frontend image: build-time `VITE_*` args; nginx serves static and proxies `/api` to `backend`.
  - Backend image: CGO-enabled for SQLite; volume at `/data` for `DB_PATH`.

- PRs & style
  - Keep changes minimal and focused; avoid unrelated refactors.
  - Prefer configuration via env over hard-coded values.
  - Update README if deployment or env behavior changes.
  - When changing UI styles, strive to follow GitHub website style (spacing, colors, typography) using our existing theme variables.
