
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
- **In-memory user store** - User management

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
   go run main.go
   ```
   The backend will run on `http://localhost:8080`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Optional: Start JSON server for development**
   ```bash
   cd client
   npm run start:dev:server
   ```

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
The application uses build-time constants defined in `vite.config.ts`:
- `__API__`: Backend API URL (default: `http://localhost:8080`)
- `__IS_DEV__`: Development mode flag
- `__PROJECT__`: Project identifier

### Google OAuth Setup
To enable Google authentication:
1. Create a Google Cloud project
2. Enable the Google Identity API
3. Update the client ID in `backend/src/typing_hero/main.go`

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
