import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AssetsProvider } from './contexts/AssetsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AssetsProvider>
          <App />
        </AssetsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
