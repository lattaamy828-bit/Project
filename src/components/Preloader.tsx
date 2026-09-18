import { useEffect, useMemo, useRef, useState } from 'react';
import { getPainting, PaintingBody } from '../art/Painting';
import { smoothPath, spiral, type Pt } from '../art/strokes';
import { mulberry32 } from '../art/rng';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

/* Timeline, in milliseconds from mount. */
const T = {
  penIn: 520,
  drawStart: 800,
  drawEnd: 6400,
  settleEnd: 7100,
  zoomEnd: 7600,
  wipe: 7800,
  done: 8600,
};

type Phase = 'dust' | 'draw' | 'settle' | 'wipe';

const PAINTING = 'starry-night';

interface Stroke {
  d: string;
  /** Core brush width, in canvas units. */
  w: number;
  /** Relative duration weight for this stroke. */
  dur?: number;
}

interface Region {
  label: string;
  strokes: Stroke[];
  /** How much each stroke overlaps the previous one, 0–1. */
  flow?: number;
  /** Pause after the region, in stroke-duration units — the hand lifting. */
  rest?: number;
}

/**
 * Feathering passes.
 *
 * The mask is luminance-based, so drawing the same geometry three times at
 * decreasing width and increasing brightness gives every stroke a soft ramp at
 * its edge — paint bleeding into the canvas rather than a hard wipe. Doing it
 * this way costs three extra `<use>` elements per stroke and nothing else; an
 * SVG blur filter over an animating full-screen mask would have to
 * re-rasterise on every frame.
 */
const FEATHER = [
  { scale: 1.5, tone: '#3d3d3d' },
  { scale: 1.2, tone: '#9a9a9a' },
  { scale: 1.0, tone: '#ffffff' },
];

/**
 * The canvas is revealed the way it would be painted: the focal gestures first,
 * alone in the dark, then the sky filling in around them, then the ground, the
 * village and finally the cypress. Each region is a recognisable part of the
 * picture, so the painting arrives in pieces rather than being wiped on.
 */
function buildRegions(): Region[] {
  const rand = mulberry32(20260918);

  /** A calm horizontal sweep across the canvas, alternating direction. */
  const sweep = (y: number, ltr: boolean): string => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 7; i++) {
      const t = ltr ? i / 7 : 1 - i / 7;
      pts.push([-40 + t * 480, y + Math.sin(i * 1.15 + y * 0.08) * 4 + (rand() - 0.5) * 3]);
    }
    return smoothPath(pts);
  };

  return [
    {
      label: 'The first swirl',
      rest: 1.3,
      strokes: [
        { d: smoothPath(spiral(172, 96, 3, 30, 2.5, 90, 0.3)), w: 26, dur: 1.9 },
        { d: smoothPath(spiral(172, 96, 26, 52, 1.5, 70, 1.1)), w: 26, dur: 1.3 },
      ],
    },
    {
      label: 'The second swirl',
      rest: 1.3,
      strokes: [{ d: smoothPath(spiral(238, 126, 3, 38, 2.3, 70, 2.3)), w: 24, dur: 1.7 }],
    },
    {
      label: 'The moon',
      rest: 1.3,
      strokes: [{ d: smoothPath(spiral(352, 54, 8, 32, 1.5, 48, 0)), w: 26, dur: 1.7 }],
    },
    {
      label: 'The stars',
      flow: 0.56,
      rest: 1.3,
      strokes: (
        [
          [46, 52], [110, 32], [214, 44], [302, 38],
          [268, 92], [152, 74], [86, 120], [196, 140], [336, 134],
        ] as const
      ).map(([x, y]) => ({
        d: smoothPath(spiral(x, y, 2, 15, 1.2, 26, rand() * 6)),
        w: 17,
        dur: 0.6,
      })),
    },
    {
      label: 'The night sky',
      rest: 1.2,
      strokes: [6, 47, 88, 129, 170].map((y, i) => ({ d: sweep(y, i % 2 === 0), w: 56, dur: 1.2 })),
    },
    {
      label: 'The hills',
      rest: 1.2,
      strokes: [185, 215].map((y, i) => ({ d: sweep(y, i % 2 === 1), w: 56, dur: 1.25 })),
    },
    {
      label: 'The village',
      rest: 1.3,
      strokes: [245, 275].map((y, i) => ({ d: sweep(y, i % 2 === 0), w: 56, dur: 1.25 })),
    },
    {
      label: 'The cypress',
      flow: 0.62,
      strokes: [0, 1, 2].map((i) => {
        const x = 42 + i * 12;
        return {
          // Drawn upward — the signature gesture, and the last mark on the canvas.
          d: smoothPath([[x, 312], [x - 6, 240], [x + 6, 170], [x - 4, 104], [x + 2, 36]]),
          w: 34,
          dur: 1.5,
        };
      }),
    },
  ];
}

/** Gentle in and out, so no stroke starts or stops abruptly. */
const easeSine = (t: number) => 0.5 - Math.cos(Math.PI * Math.min(1, Math.max(0, t))) / 2;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const { reduced } = useMotionPrefs();
  const spec = getPainting(PAINTING);

  /** Flatten the regions into a schedule of normalised [start, end] windows. */
  const { strokes, schedule, regionOf, labels } = useMemo(() => {
    const regions = buildRegions();
    const flat: Stroke[] = [];
    const windows: Array<[number, number]> = [];
    const owner: number[] = [];

    let cursor = 0;
    regions.forEach((region, ri) => {
      const flow = region.flow ?? 0.74;
      region.strokes.forEach((s) => {
        const dur = s.dur ?? 1;
        flat.push(s);
        owner.push(ri);
        windows.push([cursor, cursor + dur]);
        cursor += dur * flow;
      });
      cursor += region.rest ?? 0.6;
    });

    const total = cursor || 1;
    return {
      strokes: flat,
      schedule: windows.map(([a, b]) => [a / total, b / total] as [number, number]),
      regionOf: owner,
      labels: regions.map((r) => r.label),
    };
  }, []);

  const [phase, setPhase] = useState<Phase>('dust');
  const [region, setRegion] = useState(-1);
  const [canSkip, setCanSkip] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const lengths = useRef<number[]>([]);
  const nibRef = useRef<SVGGElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const settleRef = useRef<SVGRectElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finished = useRef(false);

  const finish = useRef(() => {});
  finish.current = () => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
    window.setTimeout(onDone, reduced ? 120 : 620);
  };

  /* -------- Floating dust, paint fragments and glowing specks -------- */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = mulberry32(99);
    const motes = Array.from({ length: 110 }, () => ({
      x: rand() * 1600,
      y: rand() * 1000,
      r: 0.4 + rand() * 2.2,
      vx: (rand() - 0.5) * 0.18,
      vy: -0.04 - rand() * 0.24,
      a: 0.12 + rand() * 0.5,
      hue: rand() > 0.72 ? '227,178,60' : rand() > 0.4 ? '111,155,239' : '244,234,215',
      ph: rand() * 6.28,
    }));

    let frame = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = rand() * w;
        }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;
        const tw = 0.55 + 0.45 * Math.sin(t * 1.4 + m.ph);
        ctx.beginPath();
        ctx.arc(m.x % (w + 20), m.y, m.r, 0, 6.2832);
        ctx.fillStyle = `rgba(${m.hue},${(m.a * tw).toFixed(3)})`;
        ctx.fill();
        if (m.r > 1.8) {
          ctx.beginPath();
          ctx.arc(m.x % (w + 20), m.y, m.r * 4, 0, 6.2832);
          ctx.fillStyle = `rgba(${m.hue},${(m.a * tw * 0.07).toFixed(3)})`;
          ctx.fill();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  /* --------------------- The drawing timeline ---------------------- */
  useEffect(() => {
    if (reduced) {
      // Honour the preference: show the finished canvas, then move on.
      setPhase('settle');
      setCanSkip(true);
      pathRefs.current.forEach((el) => {
        if (el) el.style.strokeDashoffset = '0';
      });
      if (settleRef.current) settleRef.current.style.opacity = '1';
      const id = window.setTimeout(() => finish.current(), 900);
      return () => window.clearTimeout(id);
    }

    lengths.current = pathRefs.current.map((el) => (el ? el.getTotalLength() : 0));
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = lengths.current[i];
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
    });

    const t0 = performance.now();
    const trail: Pt[] = [];
    let frame = 0;
    let lastPhase: Phase = 'dust';
    let lastRegion = -1;
    let lastStroke = -1;

    const tick = (now: number) => {
      const e = now - t0;

      const next: Phase =
        e < T.drawStart ? 'dust' : e < T.drawEnd ? 'draw' : e < T.wipe ? 'settle' : 'wipe';
      if (next !== lastPhase) {
        lastPhase = next;
        setPhase(next);
      }
      if (e > 1200 && !finished.current) setCanSkip(true);

      /* Linear clock: the gentleness lives in each stroke's own easing. */
      const p = Math.min(1, Math.max(0, (e - T.drawStart) / (T.drawEnd - T.drawStart)));

      let nib: { x: number; y: number; a: number } | null = null;
      let activeRegion = -1;

      for (let i = 0; i < strokes.length; i++) {
        const el = pathRefs.current[i];
        if (!el) continue;
        const [from, to] = schedule[i];
        const local = easeSine((p - from) / (to - from));
        const len = lengths.current[i] || 1;
        el.style.strokeDashoffset = `${len * (1 - local)}`;

        // The pen rides the most recently started stroke still in motion.
        if (local > 0 && local < 1) {
          const at = el.getPointAtLength(len * local);
          const ahead = el.getPointAtLength(Math.min(len, len * local + 6));
          nib = { x: at.x, y: at.y, a: (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI };
          activeRegion = regionOf[i];
          if (i !== lastStroke) {
            // A new stroke means the nib was lifted: drop the wet trail behind it.
            lastStroke = i;
            trail.length = 0;
          }
        }
      }

      // Hold the last part's name through the pause that follows it.
      if (activeRegion >= 0 && activeRegion !== lastRegion) {
        lastRegion = activeRegion;
        setRegion(activeRegion);
      }

      if (nibRef.current) {
        if (nib) {
          nibRef.current.style.opacity = e > T.penIn ? '1' : '0';
          nibRef.current.style.transform = `translate(${nib.x.toFixed(2)}px, ${nib.y.toFixed(2)}px) rotate(${(
            nib.a + 58
          ).toFixed(1)}deg)`;
          trail.push([nib.x, nib.y]);
          if (trail.length > 12) trail.shift();
        } else {
          // Between parts the hand rests, so the pen eases out rather than jumping.
          nibRef.current.style.opacity = e > T.penIn && e < T.drawEnd ? '0.3' : '0';
          if (trail.length) trail.shift();
        }
      }
      if (trailRef.current) {
        trailRef.current.setAttribute('d', trail.length > 1 ? smoothPath(trail) : '');
      }

      /*
       * A last, very soft wash that brings anything the brush missed up to full
       * strength. Fading a white rect into the mask keeps it a settling of paint
       * rather than a wipe.
       */
      if (settleRef.current) {
        const s = Math.min(1, Math.max(0, (e - (T.drawEnd - 700)) / (T.settleEnd - (T.drawEnd - 700))));
        settleRef.current.style.opacity = easeSine(s).toFixed(3);
      }

      // Camera push toward the finished artwork.
      if (sceneRef.current) {
        const z = Math.min(1, Math.max(0, (e - T.drawEnd + 1400) / (T.zoomEnd - T.drawEnd + 1400)));
        sceneRef.current.style.transform = `scale(${(1 + easeSine(z) * 0.12).toFixed(4)})`;
      }

      if (e >= T.done) {
        finish.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, strokes, schedule, regionOf]);

  /* Escape or Enter skips once skipping is allowed. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Enter') && canSkip) finish.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canSkip]);

  const showTitle = phase === 'settle' || phase === 'wipe';
  const caption =
    phase === 'settle' || phase === 'wipe'
      ? 'Welcome'
      : region >= 0
        ? labels[region]
        : 'Opening the gallery…';

  return (
    <div
      className="fixed inset-0 z-[120] overflow-hidden bg-ink"
      style={{ opacity: leaving ? 0 : 1, transition: 'opacity .6s cubic-bezier(.22,1,.36,1)' }}
      role="dialog"
      aria-label="Opening sequence"
      aria-live="polite"
    >
      {/* Museum darkness with a single raking light */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 42%, #101733 0%, #070a18 48%, #03040a 100%)' }}
      />

      <div ref={sceneRef} className="absolute inset-0 will-transform" style={{ transformOrigin: '52% 44%' }}>
        <svg
          viewBox={`0 0 ${spec.w} ${spec.h}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            {/* The stroke geometry, referenced once per feather pass. */}
            {strokes.map((s, i) => (
              <path
                key={i}
                id={`ae-stroke-${i}`}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={s.d}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            <mask id="intro-reveal" maskUnits="userSpaceOnUse" x="-60" y="-60" width="520" height="420">
              <rect x="-60" y="-60" width="520" height="420" fill="black" />
              {FEATHER.map((f, fi) => (
                <g key={fi} fill="none" stroke={f.tone} strokeLinecap="round" strokeLinejoin="round">
                  {strokes.map((s, i) => (
                    <use key={i} href={`#ae-stroke-${i}`} strokeWidth={s.w * f.scale} />
                  ))}
                </g>
              ))}
              <rect
                ref={settleRef}
                x="-60"
                y="-60"
                width="520"
                height="420"
                fill="white"
                opacity="0"
              />
            </mask>

            <linearGradient id="intro-ink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7dd9b" />
              <stop offset="100%" stopColor="#c0902a" />
            </linearGradient>
          </defs>

          {/* Primed canvas showing through wherever paint has not yet landed */}
          <rect width={spec.w} height={spec.h} fill="#0a0d1c" />
          <g mask="url(#intro-reveal)">
            <PaintingBody id={PAINTING} />
          </g>

          {/* Wet ink trailing the nib */}
          <path
            ref={trailRef}
            d=""
            fill="none"
            stroke="url(#intro-ink)"
            strokeWidth="2.1"
            strokeLinecap="round"
            opacity="0.5"
            style={{ filter: 'drop-shadow(0 0 4px rgba(227,178,60,.45))' }}
          />

          {/* The fountain pen / brush */}
          <g ref={nibRef} style={{ opacity: 0, transition: 'opacity .55s ease', willChange: 'transform' }}>
            <g transform="scale(0.62)">
              <g transform="translate(-2 -2)">
                <path d="M0,0 L-5,-13 L5,-13 Z" fill="#f7dd9b" />
                <path d="M0,0 L0,-13" stroke="#8c6b31" strokeWidth="1.1" />
                <rect x="-5.6" y="-26" width="11.2" height="14" rx="2.4" fill="#d8dfe4" />
                <rect x="-5.6" y="-22" width="11.2" height="3" fill="#c0902a" />
                <path d="M-5.2,-26 L-5.2,-62 Q0,-72 5.2,-62 L5.2,-26 Z" fill="#161c2e" />
                <path d="M-5.2,-26 L-5.2,-62 Q-2.6,-68 0,-69 L0,-26 Z" fill="#2b3450" />
                <rect x="-6.2" y="-50" width="12.4" height="5" rx="2" fill="#e3b23c" />
                <circle cx="0" cy="-66" r="2.1" fill="#e3b23c" />
              </g>
              <circle cx="0" cy="0" r="2.4" fill="#fff6d8" opacity="0.9" />
            </g>
          </g>
        </svg>

        {/* Vignette that lifts as the camera moves in */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(70% 60% at 50% 46%, transparent 40%, rgba(3,4,10,.86) 100%)',
            opacity: showTitle ? 0.5 : 0.88,
            transition: 'opacity 1.6s cubic-bezier(.22,1,.36,1)',
          }}
        />
      </div>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* Title card */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
        <div
          className="text-center"
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 1.1s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <p className="eyebrow mb-5">Maison de Beauté · Est. MMXXVI · A fictional demo</p>
          <h1 className="font-display text-[clamp(2.6rem,10vw,7rem)] font-light leading-[0.95] text-gilt">
            Atelier Étoile
          </h1>
          <p className="mt-5 font-script text-[clamp(1.1rem,3.4vw,1.9rem)] text-cream/85">
            Beauty, Painted Into Life.
          </p>
        </div>
      </div>

      {/* Progress hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-cream/10">
        <div
          className="h-full bg-gradient-to-r from-cobalt via-gold to-gold-200"
          style={{
            width: phase === 'dust' ? '4%' : phase === 'draw' ? '78%' : '100%',
            transition: 'width 5.4s cubic-bezier(.33,0,.2,1)',
          }}
        />
      </div>

      {/* Brush-stroke wipe out */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={0}
            y={i * 16.8 - 0.5}
            width="130"
            height="17.6"
            fill={i % 2 ? '#0b1026' : '#070a18'}
            style={{
              transform: phase === 'wipe' ? 'translateX(-135px)' : 'translateX(105px)',
              transition: `transform .8s cubic-bezier(.65,0,.35,1) ${i * 55}ms`,
            }}
          />
        ))}
      </svg>

      <button
        type="button"
        onClick={() => finish.current()}
        className="btn-quiet absolute bottom-7 right-5 z-10 backdrop-blur-sm sm:right-8"
        style={{
          opacity: canSkip && !leaving ? 1 : 0,
          pointerEvents: canSkip && !leaving ? 'auto' : 'none',
          transition: 'opacity .5s ease',
        }}
      >
        Skip the overture
      </button>

      {/* Names the part of the picture currently being painted. */}
      <p
        key={caption}
        className="absolute bottom-7 left-5 z-10 hidden text-[10px] uppercase tracking-widest2 text-cream/45 sm:left-8 sm:block"
        style={{ animation: reduced ? undefined : 'captionIn .7s cubic-bezier(.22,1,.36,1) both' }}
      >
        {caption}
      </p>

      <style>{`@keyframes captionIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
