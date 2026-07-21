import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';
import { AppProviders } from './app/providers';
import { applyTheme } from './theme/theme';

applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
