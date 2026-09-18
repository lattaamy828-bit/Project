import { memo, useId, type CSSProperties } from 'react';
import { PaintingBody, getPainting } from '../art/Painting';
import type { Vessel as VesselKind } from '../data/products';

interface VesselProps {
  kind: VesselKind;
  hue: [string, string];
  /** Painting projected onto the vessel's glass or lid. */
  painting?: string;
  /**
   * Whether to actually render that projection. Each one embeds a full canvas
   * (dozens of paths), which is worth it on a hero or detail view and pure cost
   * on a 60px thumbnail — or on a card that already shows the painting behind it.
   */
  art?: boolean;
  className?: string;
  style?: CSSProperties;
  /**
   * Index of a gentle idle float. A number rather than a style object on
   * purpose: an inline object would be a new reference on every parent render
   * and would defeat this component's memoisation.
   */
  float?: number;
  /** Hide the cast shadow when the vessel floats over a busy background. */
  shadow?: boolean;
  label?: string;
}

/**
 * Generated cosmetic vessels.
 *
 * Each is a small study in fake light: a vertical specular strip, a cool rim on
 * the far edge, a warm bounce at the base, and — where the object is glass — the
 * product's painting projected through it. All vector, all themeable from the
 * product's two-colour hue.
 */
export const Vessel = memo(function Vessel({
  kind,
  hue,
  painting,
  art = true,
  className,
  style,
  float,
  shadow = true,
  label,
}: VesselProps) {
  const uid = useId().replace(/:/g, '');
  const [c1, c2] = hue;
  const spec = painting && art ? getPainting(painting) : null;

  const id = (n: string) => `${n}-${uid}`;

  const defs = (
    <defs>
      <linearGradient id={id('body')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={c2} />
        <stop offset="16%" stopColor={c1} />
        <stop offset="42%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="58%" stopColor={c1} />
        <stop offset="86%" stopColor={c2} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28" />
      </linearGradient>
      <linearGradient id={id('metal')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7d6524" />
        <stop offset="18%" stopColor="#f7dd9b" />
        <stop offset="34%" stopColor="#c0902a" />
        <stop offset="52%" stopColor="#fbf6ec" />
        <stop offset="70%" stopColor="#c0902a" />
        <stop offset="88%" stopColor="#8a6520" />
        <stop offset="100%" stopColor="#e3b23c" />
      </linearGradient>
      <linearGradient id={id('glass')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
        <stop offset="38%" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id={id('sheen')} cx="32%" cy="18%" r="62%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={id('shadow')}>
        <stop offset="0%" stopColor="#000000" stopOpacity="0.62" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
      {spec && (
        <pattern id={id('art')} patternUnits="userSpaceOnUse" x="20" y="30" width="160" height="200" viewBox={`0 0 ${spec.w} ${spec.h}`} preserveAspectRatio="xMidYMid slice">
          <PaintingBody id={spec.id} />
        </pattern>
      )}
    </defs>
  );

  /* Two stacked ellipses read as contact shadow plus ambient occlusion, and
     cost nothing extra to raster since they are part of the same artwork. */
  const Shadow = shadow ? (
    <>
      <ellipse cx="100" cy="246" rx="74" ry="16" fill={`url(#${id('shadow')})`} opacity="0.75" />
      <ellipse cx="100" cy="243" rx="44" ry="8" fill={`url(#${id('shadow')})`} />
    </>
  ) : null;

  /** Specular strip + rim light shared by the glass-bodied vessels. */
  const gloss = (d: string) => (
    <>
      <path d={d} fill={`url(#${id('glass')})`} />
      <path d={d} fill={`url(#${id('sheen')})`} />
    </>
  );

  let body: JSX.Element;

  switch (kind) {
    /* --------------------------- Perfume flacon -------------------------- */
    case 'flacon':
      body = (
        <>
          {Shadow}
          <path d="M62,236 L62,112 Q62,92 78,84 L78,62 L122,62 L122,84 Q138,92 138,112 L138,236 Q138,244 128,244 L72,244 Q62,244 62,236Z" fill={`url(#${id('body')})`} />
          {spec && <path d="M66,232 L66,114 Q66,96 80,88 L120,88 Q134,96 134,114 L134,232 Q134,240 126,240 L74,240 Q66,240 66,232Z" fill={`url(#${id('art')})`} opacity="0.5" />}
          {gloss('M62,236 L62,112 Q62,92 78,84 L78,62 L122,62 L122,84 Q138,92 138,112 L138,236 Q138,244 128,244 L72,244 Q62,244 62,236Z')}
          <path d="M74,110 L74,232" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
          <path d="M128,118 L128,228" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" />
          <rect x="76" y="44" width="48" height="22" rx="4" fill={`url(#${id('metal')})`} />
          <rect x="82" y="16" width="36" height="32" rx="7" fill={`url(#${id('metal')})`} />
          <rect x="86" y="20" width="9" height="24" rx="4" fill="#fbf6ec" opacity="0.55" />
          <rect x="84" y="150" width="32" height="24" rx="2" fill="#fbf6ec" opacity="0.9" />
          <text x="100" y="160" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#3a2415">ÉTOILE</text>
          <text x="100" y="169" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#6b4423">PARIS</text>
        </>
      );
      break;

    /* ------------------------------ Lipstick ----------------------------- */
    case 'lipstick':
      body = (
        <>
          {Shadow}
          <path d="M78,240 L78,140 L122,140 L122,240 Q122,246 116,246 L84,246 Q78,246 78,240Z" fill={`url(#${id('metal')})`} />
          <rect x="76" y="126" width="48" height="18" rx="3" fill="#3a2415" />
          <rect x="80" y="62" width="40" height="66" rx="4" fill={`url(#${id('metal')})`} />
          <path d="M86,62 L114,62 L112,30 Q100,14 88,34Z" fill={c1} />
          <path d="M86,62 L98,62 L97,32 Q92,22 88,34Z" fill="#ffffff" opacity="0.3" />
          <path d="M100,26 Q110,16 113,32 L108,44Z" fill={c2} opacity="0.75" />
          <rect x="84" y="150" width="10" height="82" rx="5" fill="#fbf6ec" opacity="0.4" />
          <rect x="112" y="160" width="4" height="66" rx="2" fill="#fbf6ec" opacity="0.2" />
          <rect x="86" y="180" width="28" height="18" rx="2" fill="#0b1026" opacity="0.5" />
          <text x="100" y="192" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#f2c14e">É</text>
        </>
      );
      break;

    /* ------------------------------- Dropper ----------------------------- */
    case 'dropper':
      body = (
        <>
          {Shadow}
          <path d="M66,238 L66,116 Q66,104 74,100 L126,100 Q134,104 134,116 L134,238 Q134,246 126,246 L74,246 Q66,246 66,238Z" fill={`url(#${id('body')})`} />
          {spec && <path d="M70,234 L70,118 Q70,108 78,104 L122,104 Q130,108 130,118 L130,234 Q130,242 124,242 L76,242 Q70,242 70,234Z" fill={`url(#${id('art')})`} opacity="0.46" />}
          {gloss('M66,238 L66,116 Q66,104 74,100 L126,100 Q134,104 134,116 L134,238 Q134,246 126,246 L74,246 Q66,246 66,238Z')}
          <path d="M78,124 L78,232" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="7" strokeLinecap="round" />
          <rect x="82" y="80" width="36" height="24" rx="3" fill={`url(#${id('metal')})`} />
          <rect x="86" y="30" width="28" height="52" rx="12" fill="#1b2136" />
          <rect x="90" y="36" width="7" height="34" rx="3.5" fill="#f4ead7" opacity="0.35" />
          <path d="M96,104 L96,196 Q100,206 104,196 L104,104Z" fill="#ffffff" opacity="0.28" />
          <circle cx="100" cy="200" r="5" fill={c1} opacity="0.85" />
          <rect x="84" y="150" width="32" height="22" rx="2" fill="#fbf6ec" opacity="0.88" />
          <text x="100" y="162" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6.4" fill="#3a2415">SÉRUM</text>
          <text x="100" y="169" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.6" fill="#6b4423">ATELIER</text>
        </>
      );
      break;

    /* --------------------------------- Jar ------------------------------- */
    case 'jar':
      body = (
        <>
          {Shadow}
          <path d="M52,166 Q52,150 66,146 L134,146 Q148,150 148,166 L148,222 Q148,240 130,240 L70,240 Q52,240 52,222Z" fill={`url(#${id('body')})`} />
          {spec && <ellipse cx="100" cy="196" rx="44" ry="40" fill={`url(#${id('art')})`} opacity="0.4" />}
          {gloss('M52,166 Q52,150 66,146 L134,146 Q148,150 148,166 L148,222 Q148,240 130,240 L70,240 Q52,240 52,222Z')}
          <ellipse cx="100" cy="146" rx="48" ry="12" fill={`url(#${id('metal')})`} />
          <path d="M50,120 Q50,104 68,102 L132,102 Q150,104 150,120 L150,142 Q150,152 132,154 L68,154 Q50,152 50,142Z" fill={`url(#${id('metal')})`} />
          <ellipse cx="100" cy="104" rx="50" ry="13" fill="#f7dd9b" opacity="0.85" />
          <ellipse cx="100" cy="104" rx="34" ry="8" fill={c2} opacity="0.4" />
          <text x="100" y="107" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#3a2415">ÉTOILE</text>
          <path d="M64,168 L64,224" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="7" strokeLinecap="round" />
        </>
      );
      break;

    /* ------------------------------- Palette ----------------------------- */
    case 'palette': {
      const pans = ['#f7dd9b', '#e3b23c', '#c0902a', '#8c6b31', '#d9c07a', '#b98c2c', '#6b4423', '#f2c14e', '#e8dcae', '#a9772099', '#5e3a18', '#fbf6ec'];
      body = (
        <>
          {Shadow}
          <path d="M28,236 Q28,244 38,244 L162,244 Q172,244 172,236 L172,120 L28,120Z" fill="#171c2e" />
          <rect x="28" y="112" width="144" height="12" rx="3" fill={`url(#${id('metal')})`} />
          <rect x="34" y="126" width="132" height="110" rx="4" fill="#0b0f1c" />
          {pans.map((p, i) => (
            <rect key={i} x={40 + (i % 4) * 32} y={132 + Math.floor(i / 4) * 34} width="26" height="28" rx="2" fill={p}>
              <title>{`Pan ${i + 1}`}</title>
            </rect>
          ))}
          {pans.map((_, i) => (
            <rect key={`g${i}`} x={40 + (i % 4) * 32} y={132 + Math.floor(i / 4) * 34} width="26" height="10" rx="2" fill="#ffffff" opacity="0.14" />
          ))}
          {/* Open lid, mirrored with the painting */}
          <g transform="translate(0 0)">
            <path d="M28,112 L28,30 Q28,22 38,22 L162,22 Q172,22 172,30 L172,112Z" fill="#111827" />
            <rect x="36" y="30" width="128" height="76" rx="3" fill={c2} />
            {spec && <rect x="36" y="30" width="128" height="76" rx="3" fill={`url(#${id('art')})`} opacity="0.85" />}
            <rect x="36" y="30" width="128" height="76" rx="3" fill={`url(#${id('glass')})`} opacity="0.5" />
            <rect x="36" y="30" width="128" height="76" rx="3" fill="none" stroke={`url(#${id('metal')})`} strokeWidth="2.5" />
          </g>
        </>
      );
      break;
    }

    /* -------------------------------- Brush ------------------------------ */
    case 'brush':
      body = (
        <>
          {Shadow}
          {[-34, 0, 34].map((dx, i) => (
            <g key={i} transform={`translate(${dx} ${i === 1 ? -10 : 6}) rotate(${(i - 1) * 7} 100 160)`}>
              <path d="M94,240 L94,120 L106,120 L106,240 Q106,246 100,246 Q94,246 94,240Z" fill={i === 1 ? '#2c2118' : c2} />
              <path d="M96,238 L96,124 L100,124 L100,238Z" fill="#ffffff" opacity="0.22" />
              <rect x="92" y="98" width="16" height="26" rx="2" fill={`url(#${id('metal')})`} />
              <path d="M92,98 Q92,62 100,44 Q108,62 108,98Z" fill={i === 1 ? c1 : '#3a2c1c'} />
              <path d="M96,96 Q96,66 100,50 Q102,66 102,96Z" fill="#ffffff" opacity="0.25" />
            </g>
          ))}
        </>
      );
      break;

    /* -------------------------------- Tube ------------------------------- */
    case 'tube':
      body = (
        <>
          {Shadow}
          <path d="M74,242 L74,96 Q74,88 84,88 L116,88 Q126,88 126,96 L126,242 Q126,248 118,248 L82,248 Q74,248 74,242Z" fill={`url(#${id('body')})`} />
          {spec && <path d="M78,238 L78,98 Q78,92 86,92 L114,92 Q122,92 122,98 L122,238 Q122,244 116,244 L84,244 Q78,244 78,238Z" fill={`url(#${id('art')})`} opacity="0.42" />}
          {gloss('M74,242 L74,96 Q74,88 84,88 L116,88 Q126,88 126,96 L126,242 Q126,248 118,248 L82,248 Q74,248 74,242Z')}
          <path d="M84,104 L84,236" stroke="#ffffff" strokeOpacity="0.44" strokeWidth="6" strokeLinecap="round" />
          <rect x="80" y="56" width="40" height="34" rx="5" fill={`url(#${id('metal')})`} />
          <rect x="88" y="34" width="24" height="24" rx="4" fill="#1b2136" />
          <rect x="91" y="38" width="6" height="16" rx="3" fill="#f4ead7" opacity="0.3" />
          <rect x="82" y="150" width="36" height="26" rx="2" fill="#0b1026" opacity="0.55" />
          <text x="100" y="162" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7" fill="#f7dd9b">ATELIER</text>
          <text x="100" y="171" textAnchor="middle" fontFamily="Georgia, serif" fontSize="5" fill="#e3b23c">ÉTOILE</text>
        </>
      );
      break;

    /* ------------------------------- Compact ----------------------------- */
    case 'compact':
      body = (
        <>
          {Shadow}
          <ellipse cx="100" cy="206" rx="72" ry="34" fill={`url(#${id('metal')})`} />
          <ellipse cx="100" cy="198" rx="72" ry="34" fill="#171c2e" />
          <ellipse cx="100" cy="196" rx="62" ry="28" fill={c1} />
          {spec && <ellipse cx="100" cy="196" rx="62" ry="28" fill={`url(#${id('art')})`} opacity="0.55" />}
          <ellipse cx="100" cy="196" rx="62" ry="28" fill={`url(#${id('sheen')})`} />
          <ellipse cx="100" cy="196" rx="62" ry="28" fill="none" stroke={`url(#${id('metal')})`} strokeWidth="3" />
          {/* Raised lid, hinged open behind */}
          <g transform="translate(0 -4)">
            <ellipse cx="100" cy="108" rx="72" ry="30" fill="#111827" transform="rotate(-9 100 108)" />
            <ellipse cx="100" cy="106" rx="64" ry="25" fill={c2} transform="rotate(-9 100 106)" />
            {spec && <ellipse cx="100" cy="106" rx="64" ry="25" fill={`url(#${id('art')})`} opacity="0.7" transform="rotate(-9 100 106)" />}
            <ellipse cx="100" cy="106" rx="64" ry="25" fill="none" stroke={`url(#${id('metal')})`} strokeWidth="2.6" transform="rotate(-9 100 106)" />
            <ellipse cx="78" cy="98" rx="20" ry="8" fill="#ffffff" opacity="0.2" transform="rotate(-9 100 106)" />
          </g>
          <path d="M40,168 Q100,156 160,168" fill="none" stroke={`url(#${id('metal')})`} strokeWidth="3" opacity="0.8" />
        </>
      );
      break;

    /* ------------------------------- Coffret ----------------------------- */
    default:
      body = (
        <>
          {Shadow}
          <path d="M24,238 L24,140 L176,140 L176,238 Q176,246 168,246 L32,246 Q24,246 24,238Z" fill="#141a2c" />
          <path d="M24,140 L46,118 L198,118 L176,140Z" fill="#1d2540" />
          <path d="M176,140 L198,118 L198,216 L176,238Z" fill="#0d1120" />
          <rect x="34" y="150" width="132" height="84" rx="3" fill={c2} opacity="0.5" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${44 + i * 46} 150)`}>
              <rect width="34" height="84" rx="4" fill={`url(#${id('body')})`} opacity="0.9" />
              <rect x="10" y="-10" width="14" height="14" rx="3" fill={`url(#${id('metal')})`} />
              <rect x="4" y="10" width="6" height="64" rx="3" fill="#ffffff" opacity="0.3" />
            </g>
          ))}
          <path d="M24,140 L46,118 L198,118 L176,140Z" fill={`url(#${id('metal')})`} opacity="0.35" />
          {spec && <rect x="46" y="66" width="152" height="52" fill={`url(#${id('art')})`} opacity="0.85" transform="skewY(-8)" />}
          <rect x="46" y="66" width="152" height="52" fill="none" stroke={`url(#${id('metal')})`} strokeWidth="2.4" transform="skewY(-8)" />
          <rect x="86" y="196" width="60" height="22" rx="2" fill="#fbf6ec" opacity="0.9" />
          <text x="116" y="210" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#3a2415">COFFRET</text>
        </>
      );
  }

  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      style={float === undefined ? style : { animation: `vesselFloat ${7 + (float % 4)}s ease-in-out ${(float * 0.8).toFixed(1)}s infinite`, ...style }}
      role={label ? 'img' : 'presentation'} aria-label={label} aria-hidden={label ? undefined : true}>
      {label && <title>{label}</title>}
      {defs}
      {body}
    </svg>
  );
});

export default Vessel;
