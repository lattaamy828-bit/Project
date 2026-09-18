import { memo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Plus, Scale, Star } from 'lucide-react';
import { Painting } from '../art/Painting';
import Vessel from './Vessel';
import TiltCard from './TiltCard';
import { useShop } from '../store/shop';
import { discountOf, stockLabel, type Product } from '../data/products';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

interface Props {
  product: Product;
  onQuickView?(p: Product): void;
  /** Index within its grid, used to stagger entrance. */
  index?: number;
  compact?: boolean;
}

export const ProductCard = memo(function ProductCard({ product: p, onQuickView, compact = false }: Props) {
  const { add, toggleWish, inWish, toggleCompare, inCompare } = useShop();
  const { reduced } = useMotionPrefs();
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const discount = discountOf(p);
  const wished = inWish(p.id);
  const compared = inCompare(p.id);
  const soldOut = p.stock === 0;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(p, undefined, 1, cardRef.current?.getBoundingClientRect() ?? null);
  };

  return (
    <TiltCard max={reduced ? 0 : 7} lift={reduced ? 0 : 16} className="h-full">
      <article
        ref={cardRef}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="group relative flex h-full flex-col overflow-hidden rounded-[14px] card-oil"
        style={{
          boxShadow: hover
            ? '0 44px 80px -40px rgba(0,0,0,.95), 0 0 0 1px rgba(227,178,60,.28)'
            : '0 24px 50px -34px rgba(0,0,0,.9)',
          transition: 'box-shadow .6s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* --- The painting behind the vessel, as if the product hangs in front of it --- */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Painting
            id={p.painting}
            decorative
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: hover ? 0.62 : 0.34,
              transform: hover && !reduced ? 'scale(1.08) translateY(-1.5%)' : 'scale(1)',
              filter: hover ? 'saturate(1.12)' : 'saturate(.85)',
              transition: 'opacity .8s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1), filter .8s ease',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(175deg, rgba(7,10,24,.28), rgba(7,10,24,.86) 78%)' }}
          />

          {/* Cursor-tracked lighting */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              background: 'radial-gradient(240px circle at var(--mx) var(--my), rgba(227,178,60,.2), transparent 62%)',
              opacity: hover ? 1 : 0,
              transition: 'opacity .55s ease',
            }}
          />

          {/* Brush strokes drawn in on hover */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true">
            {[
              'M-6,104 C22,92 54,100 106,86',
              'M-6,112 C26,102 62,110 106,96',
              'M-6,22 C24,12 58,20 106,8',
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i === 2 ? '#6f9bef' : '#e3b23c'}
                strokeWidth={i === 2 ? 1.1 : 1.6}
                strokeLinecap="round"
                opacity={0.72}
                pathLength={1}
                strokeDasharray="1"
                style={{
                  strokeDashoffset: hover ? 0 : 1,
                  transition: `stroke-dashoffset .8s cubic-bezier(.22,1,.36,1) ${i * 90}ms`,
                }}
              />
            ))}
          </svg>

          {/* The product itself, lifting toward the viewer */}
          <div
            className="absolute inset-0 grid place-items-center p-6"
            style={{ transform: 'translateZ(48px)', transformStyle: 'preserve-3d' }}
          >
            <Vessel
              kind={p.vessel}
              hue={p.hue}
              painting={p.painting}
              art={false}
              label={`${p.name} — ${p.subtitle}`}
              className="h-full w-auto impasto"
            />
          </div>

          {/* Specks that stir when the card is hovered */}
          {!reduced &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="pointer-events-none absolute block rounded-full bg-gold-200"
                style={{
                  left: `${12 + i * 14}%`,
                  bottom: '8%',
                  width: 3 - (i % 3) * 0.6,
                  height: 3 - (i % 3) * 0.6,
                  opacity: hover ? 0.75 : 0,
                  transform: hover ? `translateY(-${60 + i * 22}px)` : 'translateY(0)',
                  transition: `opacity .5s ease ${i * 70}ms, transform 1.6s cubic-bezier(.22,1,.36,1) ${i * 70}ms`,
                }}
              />
            ))}

          {/* Corner badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="rounded-full bg-gold px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-widest2 text-midnight">
                −{discount}%
              </span>
            )}
            {p.tags.includes('new') && (
              <span className="rounded-full border border-cobalt-300/50 bg-midnight-800/80 px-2.5 py-1 font-sans text-[9px] uppercase tracking-widest2 text-cobalt-300">
                New
              </span>
            )}
            {p.tags.includes('limited') && (
              <span className="rounded-full border border-cream/25 bg-midnight-800/80 px-2.5 py-1 font-sans text-[9px] uppercase tracking-widest2 text-cream/80">
                Limited
              </span>
            )}
          </div>

          {/* Hover actions */}
          <div
            className="absolute right-3 top-3 flex flex-col gap-1.5"
            style={{
              opacity: hover ? 1 : 0,
              transform: hover ? 'translateX(0)' : 'translateX(10px)',
              transition: 'opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1)',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleWish(p.id);
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 bg-midnight-900/75 backdrop-blur transition hover:border-gold/60"
              aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
              aria-pressed={wished}
            >
              <Heart className={`h-3.5 w-3.5 transition ${wished ? 'fill-gold text-gold' : 'text-cream/75'}`} strokeWidth={1.5} />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(p);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 bg-midnight-900/75 backdrop-blur transition hover:border-gold/60"
                aria-label={`Quick view of ${p.name}`}
              >
                <Eye className="h-3.5 w-3.5 text-cream/75" strokeWidth={1.5} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(p.id);
              }}
              className="grid h-9 w-9 place-items-center rounded-full border bg-midnight-900/75 backdrop-blur transition"
              style={{ borderColor: compared ? 'rgba(227,178,60,.7)' : 'rgba(244,234,215,.2)' }}
              aria-label={compared ? `Remove ${p.name} from comparison` : `Add ${p.name} to comparison`}
              aria-pressed={compared}
            >
              <Scale className={`h-3.5 w-3.5 transition ${compared ? 'text-gold' : 'text-cream/75'}`} strokeWidth={1.5} />
            </button>
          </div>

          {soldOut && (
            <div className="absolute inset-0 grid place-items-center bg-ink/62">
              <span className="rounded-full border border-cream/30 px-4 py-2 font-sans text-[10px] uppercase tracking-widest2 text-cream">
                Sold out
              </span>
            </div>
          )}
        </div>

        {/* --- Museum placard --- */}
        <div className="relative flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-sans text-[9px] uppercase tracking-widest2 text-gold-200/65">
                {p.collection} · {p.category}
              </p>
              <h3 className="mt-1 truncate font-display text-[22px] leading-tight text-cream">
                <Link to={`/product/${p.id}`} className="outline-none transition-colors hover:text-gold-200 focus-visible:text-gold-200">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {p.name}
                </Link>
              </h3>
              {!compact && <p className="mt-0.5 truncate font-sans text-[11px] text-cream/45">{p.subtitle}</p>}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-sans text-[15px] tabular-nums text-gold-200">€{p.price}</p>
              {discount > 0 && <p className="font-sans text-[11px] tabular-nums text-cream/30 line-through">€{p.originalPrice}</p>}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="h-3 w-3"
                  strokeWidth={1.2}
                  style={{
                    fill: i < Math.round(p.rating) ? '#e3b23c' : 'transparent',
                    color: i < Math.round(p.rating) ? '#e3b23c' : 'rgba(244,234,215,.28)',
                  }}
                />
              ))}
            </span>
            <span className="font-sans text-[11px] tabular-nums text-cream/50">
              {p.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span> · {p.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          {/* Description slides open on hover */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight: hover && !compact ? 68 : 0,
              opacity: hover && !compact ? 1 : 0,
              transition: 'max-height .6s cubic-bezier(.22,1,.36,1), opacity .5s ease',
            }}
          >
            <p className="pt-3 font-sans text-[12px] leading-relaxed text-cream/55 line-clamp-2">{p.description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="font-sans text-[10px] uppercase tracking-widest2" style={{ color: soldOut ? '#c9523f' : p.stock < 20 ? '#e3b23c' : 'rgba(244,234,215,.4)' }}>
              {stockLabel(p)}
            </span>
            <button
              type="button"
              onClick={onAdd}
              disabled={soldOut}
              className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-gold/45 px-4 py-2 font-sans text-[10px] uppercase tracking-widest2 text-gold-200 transition-all duration-500 ease-silk hover:bg-gold hover:text-midnight disabled:cursor-not-allowed disabled:border-cream/15 disabled:text-cream/25 disabled:hover:bg-transparent"
              aria-label={`Add ${p.name} to cart`}
            >
              <Plus className="h-3 w-3" strokeWidth={2} />
              Add
            </button>
          </div>

          {/* Animated bottom border */}
          <span
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold via-cobalt-300 to-transparent"
            style={{ transform: hover ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .7s cubic-bezier(.22,1,.36,1)' }}
          />
        </div>
      </article>
    </TiltCard>
  );
});

export default ProductCard;
