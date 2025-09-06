// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.scss';
import App from '@/app/App.tsx'
import { BrowserRouter } from 'react-router';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { StoreProvider } from './app/providers/StoreProvider/ui/StoreProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер root не найден. НЕ удалось вмонтировать реакт приложение');
}
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <StoreProvider>
            <ErrorBoundary>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </ErrorBoundary>
        </StoreProvider>
    </BrowserRouter>,
);

