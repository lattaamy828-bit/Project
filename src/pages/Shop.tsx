import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATALOGUE_SIZE, CATEGORIES, COLLECTIONS, PRICE_BOUNDS, PRODUCTS, discountOf, type Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import Reveal, { RevealText } from '../components/Reveal';
import { Painting } from '../art/Painting';

type Sort = 'featured' | 'new' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

const SORTS: Array<[Sort, string]> = [
  ['featured', 'Curator’s order'],
  ['new', 'Newest first'],
  ['price-asc', 'Price, low to high'],
  ['price-desc', 'Price, high to low'],
  ['rating', 'Best rated'],
  ['discount', 'Largest saving'],
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [quick, setQuick] = useState<Product | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const q = params.get('q') ?? '';
  const sort = (params.get('sort') as Sort) ?? 'featured';
  const cats = useMemo(() => new Set((params.get('category') ?? '').split(',').filter(Boolean)), [params]);
  const colls = useMemo(() => new Set((params.get('collection') ?? '').split(',').filter(Boolean)), [params]);
  const maxPrice = Number(params.get('max') ?? PRICE_BOUNDS[1]);
  const inStockOnly = params.get('stock') === '1';

  /** Every filter lives in the URL, so a filtered view is shareable. */
  const patch = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') p.delete(k);
      else p.set(k, v);
    }
    setParams(p, { replace: true });
  };

  const toggleIn = (key: 'category' | 'collection', value: string) => {
    const set = key === 'category' ? new Set(cats) : new Set(colls);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    patch({ [key]: Array.from(set).join(',') });
  };

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const activeCount = cats.size + colls.size + (inStockOnly ? 1 : 0) + (maxPrice < PRICE_BOUNDS[1] ? 1 : 0) + (q ? 1 : 0);

  const results = useMemo(() => {
    const needle = q.toLowerCase().trim();
    let out = PRODUCTS.filter((p) => {
      if (cats.size && !cats.has(p.category)) return false;
      if (colls.size && !colls.has(p.collection)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.stock === 0) return false;
      if (needle) {
        const hay = `${p.name} ${p.subtitle} ${p.category} ${p.collection} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'discount': return discountOf(b) - discountOf(a);
        case 'new': return Number(b.tags.includes('new')) - Number(a.tags.includes('new')) || b.rating - a.rating;
        default: return Number(!!b.featured) - Number(!!a.featured) || b.reviewCount - a.reviewCount;
      }
    });
    return out;
  }, [q, sort, cats, colls, maxPrice, inStockOnly]);

  useEffect(() => {
    if (panelOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [panelOpen]);

  const filters = (
    <div className="space-y-8">
      <div>
        <label htmlFor="shop-q" className="eyebrow mb-3 block">Search</label>
        <input
          id="shop-q"
          type="search"
          value={q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder="A shade, a formula, a painting…"
          className="field"
        />
      </div>

      <fieldset>
        <legend className="eyebrow mb-3">Rooms</legend>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = cats.has(c);
            const n = PRODUCTS.filter((p) => p.category === c).length;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => toggleIn('category', c)}
                  className="rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest2 transition-all duration-400"
                  style={{
                    borderColor: on ? 'rgba(227,178,60,.7)' : 'rgba(244,234,215,.16)',
                    color: on ? '#f7dd9b' : 'rgba(244,234,215,.6)',
                    background: on ? 'rgba(227,178,60,.09)' : 'transparent',
                  }}
                  aria-pressed={on}
                >
                  {c} <span className="opacity-40">{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">Collections</legend>
        <ul className="flex flex-wrap gap-2">
          {COLLECTIONS.map((c) => {
            const on = colls.has(c);
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => toggleIn('collection', c)}
                  className="rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest2 transition-all duration-400"
                  style={{
                    borderColor: on ? 'rgba(111,155,239,.7)' : 'rgba(244,234,215,.16)',
                    color: on ? '#a9c8fb' : 'rgba(244,234,215,.6)',
                    background: on ? 'rgba(42,95,215,.12)' : 'transparent',
                  }}
                  aria-pressed={on}
                >
                  {c}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div>
        <label htmlFor="shop-price" className="eyebrow mb-3 block">
          Up to <span className="text-gold-200">€{maxPrice}</span>
        </label>
        <input
          id="shop-price"
          type="range"
          min={PRICE_BOUNDS[0]}
          max={PRICE_BOUNDS[1]}
          step={10}
          value={maxPrice}
          onChange={(e) => patch({ max: e.target.value === String(PRICE_BOUNDS[1]) ? null : e.target.value })}
          className="w-full accent-[#e3b23c]"
        />
        <div className="mt-1 flex justify-between font-sans text-[10px] text-cream/30">
          <span>€{PRICE_BOUNDS[0]}</span>
          <span>€{PRICE_BOUNDS[1]}</span>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => patch({ stock: e.target.checked ? '1' : null })}
          className="h-4 w-4 accent-[#e3b23c]"
        />
        <span className="font-sans text-[12px] text-cream/65">In stock only</span>
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="btn-quiet w-full">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Page head */}
      <header className="relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Painting id="irises" decorative className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.8), #070a18 85%)' }} />
        <div className="shell">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-gold/60" />
            The Boutique
          </p>
          <RevealText as="h1" text={`${CATALOGUE_SIZE} Formulations`} className="block max-w-[14ch] font-display text-[clamp(2.4rem,7vw,5.2rem)] font-light leading-[0.92] text-cream" />
          <Reveal variant="up" delay={220}>
            <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-cream/55">
              Each piece is hung beside the canvas it was drawn from. Filter by room, by collection,
              or simply by what you can see from here.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell grid gap-10 pb-24 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Desktop filter rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)]">{filters}</div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-sans text-[11px] uppercase tracking-widest2 text-cream/45" aria-live="polite">
              {results.length} {results.length === 1 ? 'piece' : 'pieces'} on view
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPanelOpen(true)} className="btn-quiet lg:hidden">
                <SlidersHorizontal className="mr-1.5 h-3 w-3" strokeWidth={1.6} />
                Filters{activeCount ? ` (${activeCount})` : ''}
              </button>
              <label htmlFor="shop-sort" className="sr-only-focusable">Sort by</label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(e) => patch({ sort: e.target.value === 'featured' ? null : e.target.value })}
                className="rounded-full border border-cream/15 bg-midnight-800/70 px-4 py-2 font-sans text-[11px] text-cream/75 outline-none transition focus:border-gold/60"
              >
                {SORTS.map(([v, label]) => (
                  <option key={v} value={v} className="bg-midnight-800">{label}</option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="card-oil rounded-2xl px-6 py-20 text-center">
              <p className="font-display text-3xl text-cream/85">This wall is empty</p>
              <p className="mx-auto mt-3 max-w-[38ch] font-sans text-sm text-cream/45">
                Nothing in the archive matches those filters. Try widening the price, or clear them and start again.
              </p>
              <button type="button" onClick={clearAll} className="btn-ghost mt-7">Clear all filters</button>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <li key={p.id}>
                  <Reveal variant="up" delay={Math.min(i, 8) * 70}>
                    <ProductCard product={p} onQuickView={setQuick} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <div
        className="fixed inset-0 z-[78] lg:hidden"
        aria-hidden={!panelOpen}
        style={{
          pointerEvents: panelOpen ? 'auto' : 'none',
          visibility: panelOpen ? 'visible' : 'hidden',
          transition: panelOpen ? 'visibility 0s' : 'visibility 0s linear .55s',
        }}
      >
        <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" style={{ opacity: panelOpen ? 1 : 0, transition: 'opacity .45s ease' }} onClick={() => setPanelOpen(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl border-t border-cream/15 bg-midnight-900/98 px-6 pb-10 pt-6"
          style={{ transform: panelOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .55s cubic-bezier(.22,1,.36,1)' }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl text-cream">Filters</h2>
            <button type="button" onClick={() => setPanelOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70" aria-label="Close filters">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          {filters}
          <button type="button" onClick={() => setPanelOpen(false)} className="btn-gold mt-8 w-full">
            Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </button>
        </div>
      </div>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
