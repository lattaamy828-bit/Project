import { useEffect, useRef } from 'react';
import { Check, Heart, Info } from 'lucide-react';
import { useShop, type Flight } from '../store/shop';
import { Painting } from '../art/Painting';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

/** Museum wall-label notifications, stacked at the foot of the screen. */
export function Toasts() {
  const { toasts, dismissToast } = useShop();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="placard pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-[3px] px-4 py-3"
          style={{ animation: 'toastIn .5s cubic-bezier(.22,1,.36,1) both' }}
          role="status"
        >
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-midnight">
            {t.tone === 'cart' ? (
              <Check className="h-3 w-3 text-gold-200" strokeWidth={2.4} />
            ) : t.tone === 'wish' ? (
              <Heart className="h-3 w-3 text-gold-200" strokeWidth={2.4} />
            ) : (
              <Info className="h-3 w-3 text-gold-200" strokeWidth={2.4} />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-[9px] uppercase tracking-widest2 text-[#8a6f45]">{t.title}</span>
            <span className="mt-0.5 block truncate font-display text-[17px] leading-tight text-[#2a2013]">{t.body}</span>
          </span>
          <button type="button" onClick={() => dismissToast(t.key)} className="shrink-0 font-sans text-[10px] uppercase tracking-widest2 text-[#8a6f45] transition hover:text-[#2a2013]" aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/** One product's flight from its card to the cart, trailing pigment. */
function FlightItem({ flight }: { flight: Flight }) {
  const { endFlight, cartTarget } = useShop();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const target = cartTarget.current;
    if (!el) return;

    const r = target?.getBoundingClientRect();
    const tx = r ? r.left + r.width / 2 : window.innerWidth - 60;
    const ty = r ? r.top + r.height / 2 : 40;

    // A shallow arc reads far better than a straight line: rise, then fall in.
    const anim = el.animate(
      [
        { transform: `translate(${flight.from.x}px, ${flight.from.y}px) translate(-50%,-50%) scale(1)`, opacity: 1 },
        {
          transform: `translate(${(flight.from.x + tx) / 2}px, ${Math.min(flight.from.y, ty) - 110}px) translate(-50%,-50%) scale(.72) rotate(-14deg)`,
          opacity: 0.95,
          offset: 0.55,
        },
        { transform: `translate(${tx}px, ${ty}px) translate(-50%,-50%) scale(.12) rotate(8deg)`, opacity: 0 },
      ],
      { duration: 900, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' },
    );
    const done = () => endFlight(flight.key);
    anim.addEventListener('finish', done);
    const fallback = window.setTimeout(done, 1100);
    return () => {
      anim.removeEventListener('finish', done);
      window.clearTimeout(fallback);
      anim.cancel();
    };
  }, [flight, endFlight, cartTarget]);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[95]" style={{ willChange: 'transform, opacity' }}>
      <div
        className="relative h-16 w-16 overflow-hidden rounded-full"
        style={{ boxShadow: `0 0 34px ${flight.color}` }}
      >
        <Painting id={flight.painting} decorative className="h-full w-full" />
      </div>
      {/* Pigment trail */}
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 block rounded-full"
          style={{
            width: 7 - i,
            height: 7 - i,
            background: i % 2 ? flight.color : '#e3b23c',
            animation: `trail${i} .9s ease-out both`,
          }}
        />
      ))}
      <style>{[0, 1, 2, 3, 4]
        .map(
          (i) =>
            `@keyframes trail${i}{0%{opacity:.9;transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(${
              -50 + (i - 2) * 26
            }%, ${-50 + 60 + i * 22}%)}}`,
        )
        .join('')}</style>
    </div>
  );
}

export function Flights() {
  const { flights } = useShop();
  const { reduced } = useMotionPrefs();
  if (reduced) return null;
  return (
    <>
      {flights.map((f) => (
        <FlightItem key={f.key} flight={f} />
      ))}
    </>
  );
}
