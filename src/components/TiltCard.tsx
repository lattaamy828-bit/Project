import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum rotation in degrees. */
  max?: number;
  /** How far the card lifts toward the viewer, in px. */
  lift?: number;
  /** Adds a cursor-tracked specular sheen. */
  glare?: boolean;
}

/**
 * Pointer-tracked 3D tilt with a cursor-following highlight.
 *
 * Writes transforms straight to the node instead of through React state — a
 * grid of these would otherwise re-render on every pointermove. Also publishes
 * `--mx`/`--my` so children can position their own lighting.
 */
export default function TiltCard({ children, className, style, max = 9, lift = 14, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);
  const { reduced, lite } = useMotionPrefs();
  const active = !reduced && !lite;

  const apply = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
      el.style.setProperty('--glare', glare ? '1' : '0');
      el.style.transform = `perspective(1100px) rotateY(${((px - 0.5) * max * 2).toFixed(2)}deg) rotateX(${(
        (0.5 - py) *
        max *
        2
      ).toFixed(2)}deg) translate3d(0,0,${lift}px)`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg) translate3d(0,0,0)';
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };

  return (
    <div
      ref={ref}
      onPointerMove={apply}
      onPointerLeave={reset}
      className={`preserve-3d will-transform ${className ?? ''}`}
      style={{
        transition: 'transform 620ms cubic-bezier(.22,1,.36,1)',
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
