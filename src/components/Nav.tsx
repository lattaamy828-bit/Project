import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../store/shop';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/gallery', label: 'Art Gallery' },
  { to: '/about', label: 'About' },
  { to: '/journal', label: 'Journal' },
];

export default function Nav() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen, setWishOpen, cartTarget, lastAdded } = useShop();
  const { reduced } = useMotionPrefs();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bagRef = useRef<HTMLButtonElement | null>(null);
  const lastY = useRef(0);
  const { pathname } = useLocation();

  useEffect(() => {
    cartTarget.current = bagRef.current;
  }, [cartTarget]);

  useEffect(() => setMenuOpen(false), [pathname]);

  /** The bar condenses past the fold and retreats when scrolling down quickly. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 320 && y > lastY.current + 4);
        lastY.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /** Cmd/Ctrl-K opens search, the way a gallery catalogue terminal would. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  return (
    <>
      <a href="#main" className="sr-only-focusable btn-gold fixed left-4 top-4 z-[100]">
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          transform: hidden && !menuOpen ? 'translateY(-104%)' : 'translateY(0)',
          transition: reduced ? 'none' : 'transform .5s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div
          className="border-b transition-all duration-700 ease-silk"
          style={{
            borderColor: scrolled ? 'rgba(244,234,215,.12)' : 'transparent',
            background: scrolled ? 'rgba(7,10,24,.82)' : 'linear-gradient(180deg, rgba(5,6,13,.62), transparent)',
            backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
          }}
        >
          <nav className="shell flex items-center justify-between gap-4" style={{ height: scrolled ? 62 : 76, transition: 'height .6s cubic-bezier(.22,1,.36,1)' }} aria-label="Primary">
            <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="Atelier Étoile — home">
              <span className="relative grid h-9 w-9 place-items-center">
                <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#e3b23c" strokeOpacity="0.4" strokeWidth="1" />
                  <path d="M9,26 C15,14 26,12 32,19" fill="none" stroke="#e3b23c" strokeWidth="1.8" strokeLinecap="round" className="transition-all duration-700 group-hover:stroke-[#f7dd9b]" />
                  <path d="M11,30 C18,22 26,21 32,25" fill="none" stroke="#2a5fd7" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="27" cy="13" r="4" fill="none" stroke="#f2c14e" strokeWidth="1.4" />
                  <circle cx="27" cy="13" r="1.4" fill="#f2c14e" />
                </svg>
              </span>
              <span className="leading-none">
                <span className="block font-display text-[19px] tracking-[0.2em] text-cream">ATELIER</span>
                <span className="block font-script text-[13px] leading-3 text-gold-200">Étoile</span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `group relative block px-3.5 py-2 font-sans text-[11px] uppercase tracking-widest2 transition-colors duration-500 ${
                        isActive ? 'text-gold-200' : 'text-cream/70 hover:text-cream'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        <span
                          className="absolute inset-x-3 bottom-1 h-px origin-left bg-gradient-to-r from-gold via-gold-200 to-transparent transition-transform duration-500 ease-silk"
                          style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                        />
                        <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-cobalt-300 to-transparent transition-transform duration-500 ease-silk group-hover:scale-x-100" />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSearchOpen(true)} className="group grid h-10 w-10 place-items-center rounded-full text-cream/75 transition-colors hover:text-gold-200" aria-label="Search the catalogue">
                <Search className="h-[18px] w-[18px] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
              </button>

              <button type="button" onClick={() => setWishOpen(true)} className="group relative grid h-10 w-10 place-items-center rounded-full text-cream/75 transition-colors hover:text-gold-200" aria-label={`Wishlist, ${wishlist.length} saved`}>
                <Heart className="h-[18px] w-[18px] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
                {wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cobalt px-1 text-[9px] font-medium text-cream">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                ref={bagRef}
                type="button"
                onClick={() => setCartOpen(true)}
                className="group relative grid h-10 w-10 place-items-center rounded-full text-cream/85 transition-colors hover:text-gold-200"
                aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
                style={{ transform: lastAdded ? 'scale(1.18)' : 'scale(1)', transition: 'transform .45s cubic-bezier(.22,1,.36,1)' }}
              >
                <ShoppingBag className="h-[18px] w-[18px] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-semibold text-midnight">
                    {cartCount}
                  </span>
                )}
              </button>

              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full text-cream/80 lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
                {menuOpen ? <X className="h-5 w-5" strokeWidth={1.4} /> : <Menu className="h-5 w-5" strokeWidth={1.4} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile drawer */}
        <div
          className="overflow-hidden border-b border-cream/10 bg-midnight-900/96 backdrop-blur-xl lg:hidden"
          style={{
            maxHeight: menuOpen ? 420 : 0,
            transition: reduced ? 'none' : 'max-height .6s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <ul className="shell flex flex-col py-3">
            {LINKS.map((l, i) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `block border-b border-cream/5 py-3.5 font-display text-2xl transition-colors ${isActive ? 'text-gold-200' : 'text-cream/85'}`
                  }
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-14px)',
                    transition: `opacity .5s ease ${i * 55}ms, transform .5s cubic-bezier(.22,1,.36,1) ${i * 55}ms`,
                  }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
