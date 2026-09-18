import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ShopProvider } from './store/shop';
import { MotionProvider } from './hooks/useMotionPrefs';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root is missing from the document.');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <MotionProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </MotionProvider>
    </BrowserRouter>
  </StrictMode>,
);
