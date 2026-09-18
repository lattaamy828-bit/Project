import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

type Variant = 'up' | 'fade' | 'brush' | 'scale' | 'left' | 'right';

const START: Record<Variant, CSSProperties> = {
  up: { opacity: 0, transform: 'translate3d(0,42px,0)' },
  fade: { opacity: 0 },
  brush: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  scale: { opacity: 0, transform: 'scale(.93)' },
  left: { opacity: 0, transform: 'translate3d(-46px,0,0)' },
  right: { opacity: 0, transform: 'translate3d(46px,0,0)' },
};

const END: Record<Variant, CSSProperties> = {
  up: { opacity: 1, transform: 'translate3d(0,0,0)' },
  fade: { opacity: 1 },
  brush: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
  scale: { opacity: 1, transform: 'scale(1)' },
  left: { opacity: 1, transform: 'translate3d(0,0,0)' },
  right: { opacity: 1, transform: 'translate3d(0,0,0)' },
};

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  /** Re-run the animation each time the element re-enters the viewport. */
  repeat?: boolean;
  threshold?: number;
}

/**
 * Scroll-triggered reveal built on one IntersectionObserver per element.
 *
 * Deliberately CSS-transition based rather than JS-driven: the browser can run
 * these off the main thread, which matters on a page that may have forty of
 * them queued at once.
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 900,
  className,
  as: Tag = 'div',
  repeat = false,
  threshold = 0.16,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) io.disconnect();
        } else if (repeat) {
          setShown(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [repeat, threshold, reduced]);

  const style: CSSProperties = reduced
    ? {}
    : {
        ...(shown ? END[variant] : START[variant]),
        transition: `opacity ${duration}ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(.22,1,.36,1) ${delay}ms, clip-path ${duration}ms cubic-bezier(.65,0,.35,1) ${delay}ms`,
        willChange: shown ? 'auto' : 'transform, opacity',
      };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Word-by-word text reveal for display headlines. */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 70,
  as: Tag = 'span',
  id,
  gilt = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  id?: string;
  /** Paint each word with the house gold gradient. */
  gilt?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const words = text.split(' ');

  /*
   * A gradient must run across the whole line, not restart inside every word, so
   * gilt text reveals as one unit instead of being split into per-word spans.
   */
  if (gilt) {
    return (
      <Tag ref={ref as never} className={className} id={id}>
        <span className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block text-gilt"
            style={
              reduced
                ? undefined
                : {
                    transform: shown ? 'translateY(0)' : 'translateY(108%)',
                    opacity: shown ? 1 : 0,
                    transition: `transform 900ms cubic-bezier(.22,1,.36,1) ${delay}ms, opacity 700ms ease ${delay}ms`,
                  }
            }
          >
            {text}
          </span>
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref as never} className={className} id={id}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={
              reduced
                ? undefined
                : {
                    transform: shown ? 'translateY(0)' : 'translateY(108%)',
                    opacity: shown ? 1 : 0,
                    transition: `transform 900ms cubic-bezier(.22,1,.36,1) ${delay + i * stagger}ms, opacity 700ms ease ${
                      delay + i * stagger
                    }ms`,
                  }
            }
          >
            {w}
          </span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  );
}
