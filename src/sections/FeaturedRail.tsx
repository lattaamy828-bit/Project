import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS, type Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import Reveal, { RevealText } from '../components/Reveal';
import { useScrollSkew } from '../hooks/usePointer';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

const FEATURED = PRODUCTS.filter((p) => p.featured);

/**
 * Horizontal rail of featured pieces.
 *
 * The cards skew fractionally with scroll velocity — enough to feel like weight,
 * not enough to notice as an effect.
 */
export default function FeaturedRail({ onQuickView }: { onQuickView(p: Product): void }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const { reduced } = useMotionPrefs();

  useScrollSkew(sectionRef);

  const sync = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 12);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 12);
  };

  useEffect(() => {
    sync();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section ref={sectionRef} id="collection" className="defer-paint relative py-24 sm:py-32" aria-labelledby="featured-title">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-gold/60" />
                Salle I · The Principal Works
              </p>
            </Reveal>
            <RevealText
              as="h2"
              text="The Permanent Collection"
              className="block max-w-[15ch] font-display text-[clamp(2.2rem,6vw,4.4rem)] font-light leading-[0.95] text-cream"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => nudge(-1)} disabled={atStart} className="grid h-11 w-11 place-items-center rounded-full border border-cream/18 text-cream/70 transition-all duration-500 hover:border-gold/60 hover:text-gold-200 disabled:opacity-25" aria-label="Previous pieces">
              <ChevronLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <button type="button" onClick={() => nudge(1)} disabled={atEnd} className="grid h-11 w-11 place-items-center rounded-full border border-cream/18 text-cream/70 transition-all duration-500 hover:border-gold/60 hover:text-gold-200 disabled:opacity-25" aria-label="Next pieces">
              <ChevronRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar mask-fade-x mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-12"
        style={{ scrollPaddingLeft: '1.25rem' }}
      >
        {FEATURED.map((p, i) => (
          <div
            key={p.id}
            className="w-[280px] shrink-0 snap-start sm:w-[320px]"
            data-skew=""
          >
            <Reveal variant="up" delay={i * 90}>
              <ProductCard product={p} onQuickView={onQuickView} />
            </Reveal>
          </div>
        ))}
        <div className="w-1 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
