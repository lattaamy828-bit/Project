import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { ShopProvider } from './store/shop';
import { MotionProvider } from './hooks/useMotionPrefs';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root is missing from the document.');

/**
 * Path routing needs a server that rewrites unknown paths to index.html. When
 * the build is published as a single static page there is no such server, so
 * that build switches to hash routing and every route stays reachable.
 */
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter;

createRoot(root).render(
  <StrictMode>
    <Router>
      <MotionProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </MotionProvider>
    </Router>
  </StrictMode>,
);
