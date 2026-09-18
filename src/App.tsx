import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import { CartDrawer, WishlistDrawer } from './components/Drawers';
import SearchOverlay from './components/SearchOverlay';
import CompareBar from './components/CompareBar';
import { Flights, Toasts } from './components/Feedback';
import { AmbientParticles, CursorHalo, GrainOverlay } from './components/Atmosphere';
import { ArtFilters } from './art/Painting';
import Home from './pages/Home';
import { useMotionPrefs } from './hooks/useMotionPrefs';

/* Route-level splitting: the entrance loads fast, the rest arrives as needed. */
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Collections = lazy(() => import('./pages/Collections'));
const About = lazy(() => import('./pages/About'));
const Checkout = lazy(() => import('./pages/Checkout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const JournalIndex = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalIndex })));
const JournalEntry = lazy(() => import('./pages/Journal').then((m) => ({ default: m.JournalEntry })));

function RouteFallback() {
  return (
    <div className="grid min-h-[70svh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <svg viewBox="0 0 60 60" className="h-12 w-12" aria-hidden="true">
          <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(244,234,215,.14)" strokeWidth="1.5" />
          <circle
            cx="30" cy="30" r="24" fill="none" stroke="#e3b23c" strokeWidth="1.5"
            strokeLinecap="round" strokeDasharray="38 114"
            style={{ transformOrigin: '30px 30px', animation: 'spin 1.1s linear infinite' }}
          />
        </svg>
        <p className="font-sans text-[10px] uppercase tracking-widest2 text-cream/35">Hanging the next room…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/**
 * Paint-wipe transition between routes.
 *
 * Runs as a short overlay on navigation rather than animating page content, so
 * a route's own entrance animations are never fighting an exit animation.
 */
function RouteTransition() {
  const { pathname } = useLocation();
  const [wiping, setWiping] = useState(false);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) return;
    setWiping(true);
    const t = window.setTimeout(() => setWiping(false), 620);
    return () => window.clearTimeout(t);
  }, [pathname, reduced]);

  if (reduced) return null;

  if (!wiping) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[65]" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x="0"
            y={i * 14.4 - 0.5}
            width="130"
            height="15.2"
            fill={i % 2 ? '#0b1026' : '#070a18'}
            style={{ animation: `sweep .62s cubic-bezier(.65,0,.35,1) ${i * 24}ms both` }}
          />
        ))}
      </svg>
      <style>{`@keyframes sweep{0%{transform:translateX(105px)}48%{transform:translateX(-14px)}100%{transform:translateX(-135px)}}`}</style>
    </div>
  );
}

/** Restores the top of the document on navigation, except within a page's own anchors. */
function ScrollToTop() {
  const { pathname } = useLocation();
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'auto' });
  }, [pathname, reduced]);
  return null;
}

export default function App() {
  const [intro, setIntro] = useState(() => {
    try {
      return sessionStorage.getItem('ae.seen') !== '1';
    } catch {
      return true;
    }
  });

  const endIntro = () => {
    setIntro(false);
    try {
      sessionStorage.setItem('ae.seen', '1');
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.body.style.overflow = intro ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [intro]);

  return (
    <>
      <ArtFilters />
      <GrainOverlay />
      <AmbientParticles />
      <CursorHalo />

      <ScrollToTop />
      <RouteTransition />
      <Nav />

      <main id="main" className="relative z-[3]">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/journal" element={<JournalIndex />} />
            <Route path="/journal/:slug" element={<JournalEntry />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer onReplayIntro={() => setIntro(true)} />

      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
      <CompareBar />
      <Toasts />
      <Flights />

      {intro && <Preloader onDone={endIntro} />}
    </>
  );
}
