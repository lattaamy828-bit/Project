import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CornerDownLeft, Search, X } from 'lucide-react';
import { useShop } from '../store/shop';
import { CATEGORIES, PRODUCTS, type Product } from '../data/products';
import { Painting } from '../art/Painting';
import Vessel from './Vessel';

const SUGGESTIONS = ['Starry night blue', 'Gold eye foil', 'Fragrance-free', 'Under €60', 'Refillable', 'Coffret'];

/** Loose scoring over name, subtitle, collection, tags and ingredients. */
function score(p: Product, q: string): number {
  const t = q.toLowerCase().trim();
  if (!t) return 0;
  let s = 0;
  if (p.name.toLowerCase().includes(t)) s += 10;
  if (p.subtitle.toLowerCase().includes(t)) s += 6;
  if (p.collection.toLowerCase().includes(t)) s += 5;
  if (p.category.toLowerCase().includes(t)) s += 5;
  if (p.tags.some((x) => x.includes(t))) s += 4;
  if (p.description.toLowerCase().includes(t)) s += 2;
  if (p.ingredients.some((x) => x.toLowerCase().includes(t))) s += 3;
  if (p.variants.some((v) => v.name.toLowerCase().includes(t))) s += 3;
  if (t.startsWith('under €') || t.startsWith('under ')) {
    const n = Number(t.replace(/[^0-9]/g, ''));
    if (n && p.price <= n) s += 8;
  }
  return s;
}

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nav = useNavigate();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return PRODUCTS.map((p) => ({ p, s: score(p, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || b.p.rating - a.p.rating)
      .slice(0, 6)
      .map((r) => r.p);
  }, [q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 260);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [searchOpen]);

  const close = () => {
    setSearchOpen(false);
    window.setTimeout(() => setQ(''), 400);
  };

  const go = (p: Product) => {
    close();
    nav(`/product/${p.id}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return close();
    if (!results.length) {
      if (e.key === 'Enter' && q.trim()) {
        close();
        nav(`/shop?q=${encodeURIComponent(q.trim())}`);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80]"
      style={{
        pointerEvents: searchOpen ? 'auto' : 'none',
        opacity: searchOpen ? 1 : 0,
        visibility: searchOpen ? 'visible' : 'hidden',
        transition: searchOpen
          ? 'opacity .5s cubic-bezier(.22,1,.36,1)'
          : 'opacity .5s cubic-bezier(.22,1,.36,1), visibility 0s linear .5s',
      }}
      aria-hidden={!searchOpen}
    >
      {/* A painting surfacing faintly behind the darkness */}
      <div className="absolute inset-0 overflow-hidden bg-ink/94">
        <Painting
          id="irises"
          decorative
          className="absolute inset-0 h-full w-full opacity-[0.14]"
          style={{
            transform: searchOpen ? 'scale(1.06)' : 'scale(1.18)',
            transition: 'transform 1.6s cubic-bezier(.22,1,.36,1)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 50% 30%, transparent, rgba(5,6,13,.92))' }} />
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the catalogue"
        className="relative mx-auto flex h-full max-w-[860px] flex-col px-5 pt-[16vh] sm:px-8"
        style={{
          transform: searchOpen ? 'translateY(0)' : 'translateY(-26px)',
          transition: 'transform .6s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <button type="button" onClick={close} className="absolute right-5 top-8 grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold/60 hover:text-gold-200 sm:right-8" aria-label="Close search">
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="eyebrow mb-4">Catalogue · {PRODUCTS.length} pieces</p>

        <div className="relative">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 text-gold/70" strokeWidth={1.2} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search a shade, a formula, a painting…"
            aria-label="Search products"
            className="w-full border-b border-cream/20 bg-transparent pb-4 pl-10 font-display text-[clamp(1.6rem,4.6vw,2.6rem)] font-light text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-gold/60"
          />
          <span
            className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-gold via-gold-200 to-transparent transition-[width] duration-700 ease-silk"
            style={{ width: q ? '100%' : '0%' }}
          />
        </div>

        <div className="mt-6 flex-1 overflow-y-auto overscroll-contain pb-10">
          {!q.trim() ? (
            <div>
              <p className="eyebrow mb-3">Try</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="btn-quiet"
                    style={{
                      opacity: searchOpen ? 1 : 0,
                      transform: searchOpen ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity .5s ease ${180 + i * 55}ms, transform .5s cubic-bezier(.22,1,.36,1) ${180 + i * 55}ms`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="eyebrow mb-3 mt-8">Rooms</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      close();
                      nav(`/shop?category=${encodeURIComponent(c)}`);
                    }}
                    className="btn-quiet"
                    style={{
                      opacity: searchOpen ? 1 : 0,
                      transition: `opacity .5s ease ${480 + i * 40}ms`,
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="py-10 text-center font-display text-xl text-cream/50">
              Nothing in the archive matches “{q}”.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => go(p)}
                    onMouseEnter={() => setActive(i)}
                    className="group flex w-full items-center gap-4 rounded-xl border px-3 py-3 text-left transition-all duration-400"
                    style={{
                      borderColor: i === active ? 'rgba(227,178,60,.4)' : 'rgba(244,234,215,.08)',
                      background: i === active ? 'rgba(227,178,60,.07)' : 'transparent',
                      transform: `translateY(${searchOpen ? 0 : 12}px)`,
                      opacity: searchOpen ? 1 : 0,
                      transition: `opacity .4s ease ${i * 50}ms, transform .4s cubic-bezier(.22,1,.36,1) ${i * 50}ms, border-color .3s, background .3s`,
                    }}
                  >
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-midnight-800">
                      <Vessel kind={p.vessel} hue={p.hue} painting={p.painting} art={false} className="h-full w-full" shadow={false} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-xl text-cream">{p.name}</span>
                      <span className="block truncate font-sans text-[11px] text-cream/45">{p.subtitle} · {p.category}</span>
                    </span>
                    <span className="shrink-0 font-sans text-sm text-gold-200">€{p.price}</span>
                    <CornerDownLeft className="h-4 w-4 shrink-0 text-cream/25 transition group-hover:text-gold-200" strokeWidth={1.4} />
                  </button>
                </li>
              ))}
              <li className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
                  }}
                  className="font-sans text-[11px] uppercase tracking-widest2 text-cream/50 transition hover:text-gold-200"
                >
                  See all results in the boutique →
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
