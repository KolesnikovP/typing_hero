
# Typing Hero 🚀


## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router 7** - Navigation and routing
- **SCSS/Sass** - Advanced styling
- **D3.js & Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **@react-oauth/google** - Google authentication

### Backend
- **Go (Golang)** - High-performance backend
- **Gorilla Mux** - HTTP router and middleware
- **Google ID Token Validation** - Secure authentication
- **CORS middleware** - Cross-origin resource sharing
- **SQLite persistence** - User and results storage

### Development Tools
- **ESLint** - Code linting
- **JSON Server** - Mock API for development
- **Vite SVG Plugin** - SVG component generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Go (v1.23.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KolesnikovP/typing_hero.git
   cd typing_hero
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd ../backend/src/typing_hero
   go mod download
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend/src/typing_hero
   # Required for Google OAuth
   export GOOGLE_CLIENT_ID="<your-google-oauth-client-id>"
   # Optional overrides
   export FRONTEND_ORIGINS="http://localhost:5173"   # CORS allowlist (comma-separated)
   export DB_PATH="typinghero.db"                    # SQLite file path
   export PORT=8080                                   # Server port

   go run main.go
   ```
   The backend will run on `http://localhost:8080`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`
   - Login page: `http://localhost:5173/login`
   - Signup page: `http://localhost:5173/signup`
   - The header user icon routes to `/login`.

3. **Optional: Start JSON server for development**
   ```bash
   cd client
   npm run start:dev:server
   ```

## 🐳 Docker

Build and run locally with Docker Compose:

1. Create a `.env` in repo root with your Google client ID:
   ```bash
   echo "GOOGLE_CLIENT_ID=your-google-oauth-client-id" > .env
   ```

2. Build and start:
   ```bash
   docker compose up --build
   ```

   - Frontend: http://localhost:5173
   - Backend health: http://localhost:8080/healthz

## 📁 Project Structure

```
typing_hero/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── app/           # Application configuration
│   │   ├── pages/         # Page components
│   │   ├── widgets/       # Complex UI components
│   │   ├── features/      # Business logic features
│   │   ├── entities/      # Business entities
│   │   └── shared/        # Shared utilities and components
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Backend Go application
│   └── src/typing_hero/
│       ├── main.go        # Main server file
│       ├── go.mod         # Go dependencies
│       └── go.sum         # Go dependency checksums
└── README.md             # Project documentation
```

## 🔧 Configuration

### Environment Variables
Backend (`backend/src/typing_hero/.env`):
- `GOOGLE_CLIENT_ID` (required): Google OAuth client ID
- `FRONTEND_ORIGINS` (optional): Comma-separated list of allowed origins (default: `http://localhost:5173`)
- `PORT` (optional): HTTP port (default: `8080`)
- `DB_PATH` (optional): SQLite DB path (default: `typinghero.db`)

Frontend (`client/.env`):
- `VITE_GOOGLE_CLIENT_ID` (required): Google OAuth client ID for the web SDK
- `VITE_API_URL` (optional): API base URL. Use `/api` when served behind the same domain via reverse proxy (default: `/api`).

Vite dev server proxies `/api` → `http://localhost:8080` to avoid CORS during development.

## Text Generation API

- `GET /api/texts`
  - Query params:
    - `length` (int, optional, default `30`): approximate number of words.
    - `punctuation` (bool, optional, default `false`): include punctuation.
    - `numbers` (bool, optional, default `false`): include numeric tokens.
  - Response:
    - `{ id: string, content: string, options: { length, punctuation, numbers }, source: "generated", language: "en" }`
  - Notes:
    - Designed for extension (e.g., difficulty, language, quote sources).
    - In dev, call via the frontend dev server at `/api/texts`.

### Google OAuth Setup
To enable Google authentication:
1. Create a Google Cloud project
2. Enable the Google Identity API
3. Set `VITE_GOOGLE_CLIENT_ID` in the frontend env (e.g., `client/.env`) and set `GOOGLE_CLIENT_ID` in the backend environment. The backend will look for `.env` in:
   - `backend/src/typing_hero/.env` (recommended)
   - Or parent dirs if you run from another working dir (it tries `../.env`, `../../.env`, `../../../.env`).

### Local Auth (optional)
In addition to Google, the backend supports simple local registration and login. The UI exposes this via `/login` and `/signup` pages.
- `POST /api/register` with `{ email, password, username?, name? }` → creates a user (password stored as bcrypt hash). If `username` is omitted, the local-part of email is used by default.
- `POST /api/login` with `{ identifier, password }` where `identifier` is either email or username

Note: Other endpoints do not enforce auth yet; this is intended for basic flows and local testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by popular typing test websites like Monkeytype and 10FastFingers
