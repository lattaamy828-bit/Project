import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, X } from 'lucide-react';
import { Painting } from '../art/Painting';
import Vessel from './Vessel';
import { useShop } from '../store/shop';
import { discountOf, stockLabel, type Product } from '../data/products';

export default function QuickView({ product, onClose }: { product: Product | null; onClose(): void }) {
  const { add, toggleWish, inWish } = useShop();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const open = !!product;

  useEffect(() => {
    if (product) {
      setQty(1);
      setVariant(0);
    }
  }, [product]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('button')?.focus(), 200);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!product) return null;
  const p = product;
  const d = discountOf(p);

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-ink/86 backdrop-blur-md" onClick={onClose} style={{ animation: 'qvFade .4s ease both' }} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${p.name}`}
        className="relative grid w-full max-w-[940px] overflow-hidden rounded-2xl border border-cream/12 bg-midnight-900/97 shadow-[0_60px_140px_-50px_rgba(0,0,0,1)] md:grid-cols-2"
        style={{ animation: 'qvIn .6s cubic-bezier(.22,1,.36,1) both', maxHeight: 'calc(100vh - 4rem)' }}
      >
        <button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-cream/15 bg-midnight-900/70 text-cream/70 backdrop-blur transition hover:border-gold/60 hover:text-gold-200" aria-label="Close quick view">
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[440px]">
          <Painting id={p.painting} decorative className="absolute inset-0 h-full w-full opacity-55" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(7,10,24,.2), rgba(7,10,24,.86))' }} />
          <div className="absolute inset-0 grid place-items-center p-8">
            <Vessel kind={p.vessel} hue={p.hue} painting={p.painting} label={p.name} className="h-full max-h-[340px] w-auto animate-drift" />
          </div>
          {d > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-widest2 text-midnight">−{d}%</span>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <p className="eyebrow">{p.collection} · {p.category}</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-none text-cream">{p.name}</h2>
          <p className="mt-1 font-sans text-sm text-cream/50">{p.subtitle}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-gold-200">€{p.price}</span>
            {d > 0 && <span className="font-sans text-sm text-cream/30 line-through">€{p.originalPrice}</span>}
            <span className="ml-auto font-sans text-[10px] uppercase tracking-widest2" style={{ color: p.stock < 20 ? '#e3b23c' : 'rgba(244,234,215,.4)' }}>
              {stockLabel(p)}
            </span>
          </div>

          <p className="mt-4 font-sans text-sm leading-relaxed text-cream/60">{p.description}</p>

          <fieldset className="mt-5">
            <legend className="eyebrow mb-2">Shade / Size</legend>
            <div className="flex flex-wrap gap-2">
              {p.variants.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setVariant(i)}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[11px] transition-all duration-400"
                  style={{
                    borderColor: i === variant ? 'rgba(227,178,60,.75)' : 'rgba(244,234,215,.16)',
                    color: i === variant ? '#f7dd9b' : 'rgba(244,234,215,.65)',
                    background: i === variant ? 'rgba(227,178,60,.08)' : 'transparent',
                  }}
                  aria-pressed={i === variant}
                >
                  <span className="h-3 w-3 rounded-full ring-1 ring-cream/25" style={{ background: v.hex }} />
                  {v.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-cream/18">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center text-cream/70 transition hover:text-gold-200" aria-label="Decrease quantity">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-8 text-center font-sans text-sm tabular-nums text-cream" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-10 w-10 place-items-center text-cream/70 transition hover:text-gold-200" aria-label="Increase quantity">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={(e) => {
                add(p, p.variants[variant]?.name, qty, (e.currentTarget as HTMLElement).getBoundingClientRect());
                onClose();
              }}
              disabled={p.stock === 0}
              className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggleWish(p.id)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/18 transition hover:border-gold/60"
              aria-label={inWish(p.id) ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={inWish(p.id)}
            >
              <Heart className={`h-4 w-4 ${inWish(p.id) ? 'fill-gold text-gold' : 'text-cream/70'}`} strokeWidth={1.5} />
            </button>
          </div>

          <Link to={`/product/${p.id}`} onClick={onClose} className="mt-5 self-start font-sans text-[11px] uppercase tracking-widest2 text-cream/50 transition hover:text-gold-200">
            View the full record →
          </Link>
        </div>
      </div>
      <style>{`@keyframes qvIn{from{opacity:0;transform:translateY(26px) scale(.975)}to{opacity:1;transform:none}}@keyframes qvFade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
