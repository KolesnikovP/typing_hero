// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.scss';
import App from '@/app/App'
import { BrowserRouter } from 'react-router';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { StoreProvider } from './app/providers/StoreProvider/ui/StoreProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localstorage';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Контейнер root не найден. НЕ удалось вмонтировать реакт приложение');
}
// Initialize theme early to avoid FOUC
(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    const theme = stored === 'dark' || stored === 'light'
        ? stored
        : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

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
