import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Heart, Minus, Plus, Scale, Star } from 'lucide-react';
import { Painting, getPainting } from '../art/Painting';
import Vessel from '../components/Vessel';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import Reveal, { RevealText } from '../components/Reveal';
import { GiltRule } from '../components/Divider';
import TiltCard from '../components/TiltCard';
import { useShop } from '../store/shop';
import { discountOf, getProduct, relatedTo, stockLabel, type Product } from '../data/products';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

type Tab = 'description' | 'ingredients' | 'benefits' | 'usage';

const TABS: Array<[Tab, string]> = [
  ['description', 'The formula'],
  ['benefits', 'What it does'],
  ['ingredients', 'Ingredients'],
  ['usage', 'How to use'],
];

/** Five views of one product: the vessel, then details of the canvas behind it. */
const VIEWS = ['vessel', 'canvas', 'detail', 'swatch', 'frame'] as const;
type View = (typeof VIEWS)[number];

const VIEW_LABEL: Record<View, string> = {
  vessel: 'The object',
  canvas: 'Its canvas',
  detail: 'Canvas detail',
  swatch: 'The shade',
  frame: 'On the wall',
};

export default function ProductDetail() {
  const { id = '' } = useParams();
  const product = getProduct(id);
  const { add, toggleWish, inWish, toggleCompare, inCompare } = useShop();
  const { reduced } = useMotionPrefs();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [tab, setTab] = useState<Tab>('description');
  const [view, setView] = useState<View>('vessel');
  const [quick, setQuick] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setQty(1);
    setVariant(0);
    setTab('description');
    setView('vessel');
  }, [id]);

  const related = useMemo(() => (product ? relatedTo(product, 4) : []), [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const p = product;
  const spec = getPainting(p.painting);
  const d = discountOf(p);
  const chosen = p.variants[variant] ?? p.variants[0];
  const soldOut = p.stock === 0;

  const onAdd = () => {
    add(p, chosen?.name, qty, stageRef.current?.getBoundingClientRect() ?? null);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    // Derived deterministically from the product's own numbers — demo data.
    const weight = stars === 5 ? 0.68 : stars === 4 ? 0.21 : stars === 3 ? 0.07 : stars === 2 ? 0.03 : 0.01;
    return { stars, count: Math.round(p.reviewCount * weight) };
  });

  return (
    <>
      {/* ------------------------- Principal view ------------------------- */}
      <section
        className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+2rem)]"
        style={{
          background: `radial-gradient(110% 80% at 50% 0%, ${spec.palette.bg}, ${spec.palette.deep} 52%, #070a18 100%)`,
          transition: reduced ? 'none' : 'background 1s ease',
        }}
        aria-labelledby="product-title"
      >
        <div className="absolute inset-0 -z-10 opacity-[0.22]">
          <Painting key={p.painting} id={p.painting} decorative className="h-full w-full" />
        </div>

        <div className="shell">
          <Link to="/shop" className="mb-8 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest2 text-cream/45 transition hover:text-gold-200">
            <ArrowLeft className="h-3 w-3" strokeWidth={1.8} />
            Back to the boutique
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
            {/* Stage */}
            <div>
              <TiltCard max={reduced ? 0 : 6} lift={reduced ? 0 : 12}>
                <div
                  ref={stageRef}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-cream/12 sm:aspect-[5/4] lg:aspect-[4/5]"
                  style={{ background: `linear-gradient(165deg, ${spec.palette.bg}, ${spec.palette.deep})` }}
                >
                  <Painting
                    key={`${p.painting}-${view}`}
                    id={p.painting}
                    decorative
                    className="absolute inset-0 h-full w-full"
                    style={{
                      opacity: view === 'canvas' ? 1 : view === 'detail' ? 1 : view === 'frame' ? 0.4 : 0.42,
                      transform: view === 'detail' ? 'scale(2.4)' : view === 'canvas' ? 'scale(1.02)' : 'scale(1.06)',
                      transformOrigin: '38% 42%',
                      transition: 'transform 1.2s cubic-bezier(.22,1,.36,1), opacity .8s ease',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, rgba(7,10,24,.2), rgba(7,10,24,.78))',
                      opacity: view === 'canvas' || view === 'detail' ? 0.25 : 1,
                      transition: 'opacity .8s ease',
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-screen"
                    style={{ background: 'radial-gradient(360px circle at var(--mx) var(--my), rgba(227,178,60,.16), transparent 62%)' }}
                  />

                  {/* The object */}
                  <div
                    className="absolute inset-0 grid place-items-center p-10"
                    style={{
                      opacity: view === 'vessel' ? 1 : view === 'frame' ? 0.9 : 0,
                      transform: view === 'vessel' ? 'translateZ(60px) scale(1)' : 'translateZ(0) scale(.86)',
                      transformStyle: 'preserve-3d',
                      transition: 'opacity .7s ease, transform 1s cubic-bezier(.22,1,.36,1)',
                    }}
                  >
                    <Vessel
                      kind={p.vessel}
                      hue={[chosen?.hex ?? p.hue[0], p.hue[1]]}
                      painting={p.painting}
                      label={`${p.name} — ${p.subtitle}`}
                      className="h-full w-auto"
                      float={reduced ? undefined : 2}
                    />
                  </div>

                  {/* The shade, swatched */}
                  <div
                    className="absolute inset-0 grid place-items-center p-12"
                    style={{ opacity: view === 'swatch' ? 1 : 0, transition: 'opacity .7s ease', pointerEvents: 'none' }}
                  >
                    <svg viewBox="0 0 200 200" className="h-full max-h-[300px] w-auto" aria-hidden="true">
                      <path
                        d="M18,124 C40,78 78,58 120,66 C158,74 184,96 188,120 C192,148 160,170 118,168 C72,166 30,158 18,124Z"
                        fill={chosen?.hex ?? p.hue[0]}
                        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.6))' }}
                      />
                      <path d="M28,138 C60,116 104,110 148,122" fill="none" stroke="#ffffff" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
                      <path d="M40,152 C74,138 112,136 156,146" fill="none" stroke="#000000" strokeOpacity=".22" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Hanging on the wall */}
                  <div
                    className="absolute inset-0 grid place-items-center p-14"
                    style={{ opacity: view === 'frame' ? 1 : 0, transition: 'opacity .7s ease', pointerEvents: 'none' }}
                  >
                    <div className="w-[62%] overflow-hidden rounded-sm gilt-lux" style={{ aspectRatio: `${spec.w} / ${spec.h}` }}>
                      <Painting id={p.painting} decorative className="h-full w-full" />
                    </div>
                  </div>

                  {d > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest2 text-midnight">
                      −{d}% this season
                    </span>
                  )}
                </div>
              </TiltCard>

              {/* View selector */}
              <ul className="mt-4 grid grid-cols-5 gap-2" role="tablist" aria-label="Product views">
                {VIEWS.map((v) => (
                  <li key={v}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={view === v}
                      onClick={() => setView(v)}
                      className="group relative block w-full overflow-hidden rounded-lg border transition-all duration-500"
                      style={{
                        aspectRatio: '1 / 1',
                        borderColor: view === v ? 'rgba(227,178,60,.75)' : 'rgba(244,234,215,.12)',
                        background: `linear-gradient(160deg, ${spec.palette.bg}, ${spec.palette.deep})`,
                      }}
                    >
                      {v === 'swatch' ? (
                        <span className="absolute inset-2 rounded-md" style={{ background: chosen?.hex ?? p.hue[0] }} />
                      ) : v === 'vessel' ? (
                        <Vessel kind={p.vessel} hue={[chosen?.hex ?? p.hue[0], p.hue[1]]} className="h-full w-full" shadow={false} />
                      ) : (
                        <Painting
                          id={p.painting}
                          decorative
                          className="h-full w-full"
                          style={{ transform: v === 'detail' ? 'scale(2.2)' : 'scale(1)', transformOrigin: '38% 42%' }}
                        />
                      )}
                      <span className="sr-only">{VIEW_LABEL[v]}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-center font-sans text-[10px] uppercase tracking-widest2 text-cream/35">{VIEW_LABEL[view]}</p>
            </div>

            {/* ---------------------- Details column ---------------------- */}
            <div className="lg:pt-4">
              <p className="eyebrow">{p.collection} · {p.category}</p>
              <RevealText as="h1" id="product-title" text={p.name} className="mt-3 block font-display text-[clamp(2.4rem,6.6vw,4.2rem)] font-light leading-[0.95] text-cream" />
              <p className="mt-2 font-sans text-[15px] text-cream/50">{p.subtitle}</p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a href="#reviews" className="flex items-center gap-2 transition hover:opacity-80">
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5" strokeWidth={1.2} style={{ fill: i < Math.round(p.rating) ? '#e3b23c' : 'transparent', color: i < Math.round(p.rating) ? '#e3b23c' : 'rgba(244,234,215,.28)' }} />
                    ))}
                  </span>
                  <span className="font-sans text-[12px] text-cream/55">
                    {p.rating.toFixed(1)} · {p.reviewCount.toLocaleString()} reviews
                  </span>
                </a>
                <span className="font-sans text-[10px] uppercase tracking-widest2" style={{ color: soldOut ? '#c9523f' : p.stock < 20 ? '#e3b23c' : 'rgba(244,234,215,.4)' }}>
                  {stockLabel(p)}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-display text-[clamp(2rem,5vw,3rem)] leading-none text-gold-200">€{p.price}</span>
                {d > 0 && <span className="font-sans text-base text-cream/30 line-through">€{p.originalPrice}</span>}
                <span className="font-sans text-[11px] text-cream/40">{p.size}</span>
              </div>

              <p className="mt-6 max-w-[52ch] font-sans text-[15px] leading-relaxed text-cream/60">{p.description}</p>

              <fieldset className="mt-8">
                <legend className="eyebrow mb-3">
                  Shade / Size — <span className="text-cream/70">{chosen?.name}</span>
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {p.variants.map((v, i) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setVariant(i)}
                      className="group flex items-center gap-2.5 rounded-full border py-2 pl-2 pr-4 font-sans text-[11px] transition-all duration-400"
                      style={{
                        borderColor: i === variant ? 'rgba(227,178,60,.8)' : 'rgba(244,234,215,.16)',
                        color: i === variant ? '#f7dd9b' : 'rgba(244,234,215,.65)',
                        background: i === variant ? 'rgba(227,178,60,.09)' : 'transparent',
                      }}
                      aria-pressed={i === variant}
                    >
                      <span
                        className="block h-6 w-6 rounded-full ring-1 ring-cream/25 transition-transform duration-400 group-hover:scale-110"
                        style={{ background: v.hex, boxShadow: `0 4px 14px -4px ${v.hex}` }}
                      />
                      {v.name}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-cream/18">
                  <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} className="grid h-12 w-12 place-items-center text-cream/70 transition hover:text-gold-200" aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                  <span className="min-w-10 text-center font-sans text-base tabular-nums text-cream" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((v) => Math.min(99, v + 1))} className="grid h-12 w-12 place-items-center text-cream/70 transition hover:text-gold-200" aria-label="Increase quantity">
                    <Plus className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </div>
                <button type="button" onClick={onAdd} disabled={soldOut} className="btn-gold min-w-[190px] flex-1 disabled:cursor-not-allowed disabled:opacity-40">
                  {added ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} /> Added
                    </>
                  ) : soldOut ? (
                    'Sold out'
                  ) : (
                    `Add to cart — €${(p.price * qty).toFixed(2)}`
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link to="/checkout" onClick={() => !soldOut && add(p, chosen?.name, qty)} className="btn-ghost flex-1 justify-center" aria-disabled={soldOut}>
                  Buy it now
                </Link>
                <button type="button" onClick={() => toggleWish(p.id)} className="grid h-12 w-12 place-items-center rounded-full border border-cream/18 transition hover:border-gold/60" aria-label={inWish(p.id) ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={inWish(p.id)}>
                  <Heart className={`h-4 w-4 ${inWish(p.id) ? 'fill-gold text-gold' : 'text-cream/70'}`} strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => toggleCompare(p.id)} className="grid h-12 w-12 place-items-center rounded-full border transition hover:border-gold/60" style={{ borderColor: inCompare(p.id) ? 'rgba(227,178,60,.7)' : 'rgba(244,234,215,.18)' }} aria-label={inCompare(p.id) ? 'Remove from comparison' : 'Add to comparison'} aria-pressed={inCompare(p.id)}>
                  <Scale className={`h-4 w-4 ${inCompare(p.id) ? 'text-gold' : 'text-cream/70'}`} strokeWidth={1.5} />
                </button>
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-cream/10 pt-5 font-sans text-[11px] text-cream/45 sm:grid-cols-3">
                <li>Complimentary shipping over €150</li>
                <li>Refills available in-atelier</li>
                <li>Returns within 30 days</li>
              </ul>

              {/* The canvas behind it */}
              <Link to="/gallery" className="group mt-8 flex items-center gap-4 rounded-xl border border-cream/12 bg-midnight-900/40 p-3 transition-all duration-500 hover:border-gold/45">
                <span className="h-16 w-20 shrink-0 overflow-hidden rounded-sm gilt">
                  <Painting id={p.painting} decorative className="h-full w-full" />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[9px] uppercase tracking-widest2 text-gold-200/70">Formulated from</span>
                  <span className="block truncate font-display text-xl text-cream transition-colors group-hover:text-gold-200">{spec.title}</span>
                  <span className="block truncate font-sans text-[10px] text-cream/40">{spec.artist}</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------- Tabbed record ------------------------- */}
      <section className="shell py-16" aria-label="Product details">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <p className="eyebrow mb-4">The story</p>
            <p className="font-display text-[clamp(1.4rem,3vw,2rem)] font-light leading-snug text-cream/85">{p.story}</p>
            <GiltRule className="mt-8 max-w-[260px]" />
          </div>

          <div>
            <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-2 border-b border-cream/10 pb-3">
              {TABS.map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className="relative rounded-full px-4 py-2 font-sans text-[10px] uppercase tracking-widest2 transition-colors duration-400"
                  style={{ color: tab === k ? '#f7dd9b' : 'rgba(244,234,215,.5)' }}
                >
                  {label}
                  {tab === k && <span className="absolute inset-x-3 -bottom-3 h-px bg-gradient-to-r from-gold to-transparent" />}
                </button>
              ))}
            </div>

            <div className="pt-6" role="tabpanel">
              {tab === 'description' && (
                <p className="max-w-[62ch] font-sans text-[15px] leading-relaxed text-cream/60">{p.description} {p.story}</p>
              )}
              {tab === 'benefits' && (
                <ul className="space-y-3">
                  {p.benefits.map((b, i) => (
                    <li key={b} className="flex gap-3" style={{ animation: `fadeUp .5s ease ${i * 70}ms both` }}>
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                      <span className="font-sans text-[14px] leading-relaxed text-cream/65">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'ingredients' && (
                <>
                  <ul className="flex flex-wrap gap-2">
                    {p.ingredients.map((ing, i) => (
                      <li key={ing} className="rounded-full border border-cream/12 px-3 py-1.5 font-sans text-[11px] text-cream/60" style={{ animation: `fadeUp .45s ease ${i * 45}ms both` }}>
                        {ing}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 font-sans text-[11px] leading-relaxed text-cream/30">
                    Invented for this demo. Not a real ingredient list, and not suitable for any real formulation decision.
                  </p>
                </>
              )}
              {tab === 'usage' && (
                <p className="max-w-[58ch] font-sans text-[15px] leading-relaxed text-cream/65">{p.usage}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Reviews ---------------------------- */}
      <section id="reviews" className="shell py-16" aria-labelledby="reviews-title">
        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div>
            <p className="eyebrow mb-4">Visitors’ book</p>
            <h2 id="reviews-title" className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-light leading-tight text-cream">
              What people wrote
            </h2>
            <p className="mt-6 font-display text-6xl leading-none text-gold-200">{p.rating.toFixed(1)}</p>
            <p className="mt-2 font-sans text-[11px] uppercase tracking-widest2 text-cream/40">
              From {p.reviewCount.toLocaleString()} reviews
            </p>
            <ul className="mt-6 space-y-2">
              {ratingBreakdown.map((r) => (
                <li key={r.stars} className="flex items-center gap-3">
                  <span className="w-8 shrink-0 font-sans text-[11px] text-cream/45">{r.stars}★</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10">
                    <span className="block h-full rounded-full bg-gradient-to-r from-cobalt to-gold" style={{ width: `${(r.count / p.reviewCount) * 100}%` }} />
                  </span>
                  <span className="w-12 shrink-0 text-right font-sans text-[11px] tabular-nums text-cream/35">{r.count.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-sans text-[10px] leading-relaxed text-cream/25">
              All reviews on this site are fictional, written for the demo.
            </p>
          </div>

          <ul className="space-y-4">
            {p.reviews.map((r, i) => (
              <li key={`${r.author}-${i}`}>
                <Reveal variant="up" delay={i * 90}>
                  <article className="card-oil rounded-xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 font-display text-base text-gold-200">
                          {r.author.charAt(0)}
                        </span>
                        <span>
                          <span className="block font-display text-lg text-cream">{r.author}</span>
                          <span className="block font-sans text-[10px] uppercase tracking-widest2 text-cream/35">{r.city}</span>
                        </span>
                      </div>
                      <span className="flex items-center gap-0.5" aria-label={`${r.rating} out of 5`}>
                        {[0, 1, 2, 3, 4].map((k) => (
                          <Star key={k} className="h-3 w-3" strokeWidth={1.2} style={{ fill: k < r.rating ? '#e3b23c' : 'transparent', color: k < r.rating ? '#e3b23c' : 'rgba(244,234,215,.25)' }} />
                        ))}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl text-cream/90">{r.title}</h3>
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-cream/55">{r.body}</p>
                    <p className="mt-3 font-sans text-[10px] uppercase tracking-widest2 text-cream/25">
                      {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------- Related ---------------------------- */}
      {related.length > 0 && (
        <section className="shell py-16 pb-28" aria-labelledby="related-title">
          <p className="eyebrow mb-4">Hung nearby</p>
          <h2 id="related-title" className="mb-10 font-display text-[clamp(1.8rem,4.6vw,3rem)] font-light text-cream">
            You may also care for
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((r, i) => (
              <li key={r.id}>
                <Reveal variant="up" delay={i * 90}>
                  <ProductCard product={r} onQuickView={setQuick} compact />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <QuickView product={quick} onClose={() => setQuick(null)} />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
