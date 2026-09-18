import { useMemo } from 'react';
import { mulberry32 } from '../art/rng';
import { smoothPath, type Pt } from '../art/strokes';

/**
 * Torn-paint section transition.
 *
 * A single generated edge is used as both the fill boundary and a highlight
 * stroke, so sections meet along a ragged brushed line instead of a hard rule.
 */
export default function BrushDivider({
  flip = false,
  color = '#070a18',
  accent = '#e3b23c',
  seed = 5,
  className = '',
}: {
  flip?: boolean;
  color?: string;
  accent?: string;
  seed?: number;
  className?: string;
}) {
  const { edge, area } = useMemo(() => {
    const rand = mulberry32(seed * 977);
    const pts: Pt[] = [];
    for (let i = 0; i <= 14; i++) {
      pts.push([(i / 14) * 1200, 26 + (rand() - 0.5) * 30 + Math.sin(i * 0.9) * 8]);
    }
    const e = smoothPath(pts);
    return { edge: e, area: `${e} L1200,80 L0,80 Z` };
  }, [seed]);

  return (
    <div className={`pointer-events-none relative h-[60px] w-full ${className}`} aria-hidden="true" style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={area} fill={color} />
        <path d={edge} fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" />
        <path d={edge} fill="none" stroke="#6f9bef" strokeOpacity="0.18" strokeWidth="3.4" strokeLinecap="round" transform="translate(0 4)" />
      </svg>
    </div>
  );
}

/** A thin gilded rule with a diamond at its centre — used between blocks of text. */
export function GiltRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/45" />
      <svg viewBox="0 0 24 24" className="h-3 w-3">
        <path d="M12,2 L20,12 L12,22 L4,12Z" fill="none" stroke="#e3b23c" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="2" fill="#e3b23c" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/45" />
    </div>
  );
}
