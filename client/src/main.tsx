import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/index.scss';
import App from '@/app/App.tsx'
import { BrowserRouter } from 'react-router';
import { ErrorBoundary } from './app/providers/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>    
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
