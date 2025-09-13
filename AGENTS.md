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
  - UI copy: use English only; do not mix languages in strings.
  - Handlers: avoid complex inline callbacks. If an inline handler exceeds ~100 chars (e.g., `onClick`), extract it into a named function (preferably wrapped with `useCallback`) and call that instead.

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
  - Avoid inline styles; prefer SCSS modules or existing component styles.
  - Variable naming: use clear, descriptive names; avoid single-letter or opaque identifiers (e.g., use `prev` for state updaters, `err` for caught errors, `normalizedMessage` instead of `s`). Reserve one-letter names only for conventional loop indices.

- Architecture (FSD)
  - Organize code by business slice first (features/entities), then by layer.
  - Layers and responsibilities:
    - app: application init, router, providers, global styles
    - processes: cross-page flows (optional)
    - pages: route shells that compose widgets/features/entities (no business logic)
    - widgets: reusable page sections (no business logic)
    - features: user-valuable actions (encapsulate UI + state + logic)
    - entities: domain models, state, queries, and simple UI (e.g., User)
    - shared: design system, libs, API clients, helpers
  - Dependency rule: imports flow top → down only; no upward or lateral imports across layers.
  - Public API rule: import from a slice’s `index.ts` only (no deep imports).
