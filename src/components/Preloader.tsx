import { useEffect, useMemo, useRef, useState } from 'react';
import { getPainting, PaintingBody } from '../art/Painting';
import { smoothPath, spiral, type Pt } from '../art/strokes';
import { mulberry32 } from '../art/rng';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

/* Timeline, in milliseconds from mount. */
const T = {
  dust: 0,
  penIn: 520,
  drawStart: 760,
  drawEnd: 4300,
  titleIn: 4150,
  zoomEnd: 5300,
  wipe: 5500,
  done: 6350,
};

type Phase = 'dust' | 'draw' | 'settle' | 'wipe';

const PAINTING = 'starry-night';

/**
 * Builds the ordered list of brush strokes that reveal the canvas.
 *
 * The sequence is deliberately painterly rather than a wipe: broad serpentine
 * sweeps lay in the sky, two spirals carve the swirls, and short vertical
 * strokes finish the cypress and the village.
 */
function buildStrokes(): string[] {
  const rand = mulberry32(20260918);
  const out: string[] = [];

  /**
   * Serpentine sweeps at a pitch tighter than the brush is wide, so the hand
   * covers the whole canvas with no bare canvas left between passes.
   */
  const ROWS = 14;
  const PITCH = 23;
  for (let row = 0; row < ROWS; row++) {
    const y = -8 + row * PITCH;
    const ltr = row % 2 === 0;
    const pts: Pt[] = [];
    for (let i = 0; i <= 7; i++) {
      const t = ltr ? i / 7 : 1 - i / 7;
      pts.push([-40 + t * 480, y + Math.sin(i * 1.3 + row) * 5 + (rand() - 0.5) * 4]);
    }
    out.push(smoothPath(pts));
  }

  // The two great swirls, carved after the ground is laid.
  out.push(smoothPath(spiral(172, 96, 3, 52, 2.5, 90, 0.3)));
  out.push(smoothPath(spiral(238, 126, 3, 38, 2.3, 70, 2.3)));
  out.push(smoothPath(spiral(352, 54, 6, 34, 1.4, 44, 0)));

  // The cypress, drawn upward last — the signature gesture.
  for (let i = 0; i < 3; i++) {
    const x = 42 + i * 12;
    out.push(smoothPath([[x, 310], [x - 6, 240], [x + 6, 170], [x - 4, 104], [x + 2, 40]]));
  }
  return out;
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const { reduced } = useMotionPrefs();
  const spec = getPainting(PAINTING);
  const strokes = useMemo(buildStrokes, []);

  const [phase, setPhase] = useState<Phase>('dust');
  const [canSkip, setCanSkip] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const lengths = useRef<number[]>([]);
  const nibRef = useRef<SVGGElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
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
    const motes = Array.from({ length: 130 }, () => ({
      x: rand() * 1600,
      y: rand() * 1000,
      r: 0.4 + rand() * 2.4,
      vx: (rand() - 0.5) * 0.22,
      vy: -0.05 - rand() * 0.3,
      a: 0.12 + rand() * 0.55,
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
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + m.ph);
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
    const n = strokes.length;
    const trail: Pt[] = [];
    let frame = 0;
    let lastPhase: Phase = 'dust';
    let lastStroke = -1;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const e = now - t0;

      const next: Phase =
        e < T.drawStart ? 'dust' : e < T.drawEnd ? 'draw' : e < T.wipe ? 'settle' : 'wipe';
      if (next !== lastPhase) {
        lastPhase = next;
        setPhase(next);
      }
      if (e > 1200 && !finished.current) setCanSkip(true);

      // Global draw progress, eased so the hand slows into the last strokes.
      const raw = Math.min(1, Math.max(0, (e - T.drawStart) / (T.drawEnd - T.drawStart)));
      const p = ease(raw) * n;

      let nib: { x: number; y: number; a: number } | null = null;
      for (let i = 0; i < n; i++) {
        const el = pathRefs.current[i];
        if (!el) continue;
        const len = lengths.current[i] || 1;
        // Strokes overlap slightly so the hand never appears to stop.
        const local = Math.min(1, Math.max(0, (p - i) / 0.78));
        el.style.strokeDashoffset = `${len * (1 - local)}`;
        if (local > 0 && local < 1 && !nib) {
          const at = el.getPointAtLength(len * local);
          const ahead = el.getPointAtLength(Math.min(len, len * local + 6));
          nib = { x: at.x, y: at.y, a: (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI };
          // A new stroke means the nib was lifted: drop the wet trail behind it.
          if (i !== lastStroke) {
            lastStroke = i;
            trail.length = 0;
          }
        }
      }

      if (nibRef.current) {
        if (nib) {
          nibRef.current.style.opacity = e > T.penIn ? '1' : '0';
          nibRef.current.style.transform = `translate(${nib.x.toFixed(2)}px, ${nib.y.toFixed(2)}px) rotate(${(
            nib.a + 58
          ).toFixed(1)}deg)`;
          trail.push([nib.x, nib.y]);
          if (trail.length > 26) trail.shift();
        } else {
          nibRef.current.style.opacity = e < T.drawStart && e > T.penIn ? '0.85' : '0';
          if (trail.length) trail.shift();
        }
      }
      if (trailRef.current) {
        trailRef.current.setAttribute('d', trail.length > 1 ? smoothPath(trail) : '');
      }

      // Camera push toward the finished artwork.
      if (sceneRef.current) {
        const z = Math.min(1, Math.max(0, (e - T.drawEnd + 600) / (T.zoomEnd - T.drawEnd + 600)));
        const s = 1 + ease(z) * 0.14;
        sceneRef.current.style.transform = `scale(${s.toFixed(4)})`;
      }

      if (e >= T.done) {
        finish.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, strokes.length]);

  /* Escape or Enter skips once skipping is allowed. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Enter') && canSkip) finish.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canSkip]);

  const showTitle = phase === 'settle' || phase === 'wipe';

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
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, #101733 0%, #070a18 48%, #03040a 100%)',
        }}
      />

      <div
        ref={sceneRef}
        className="absolute inset-0 will-transform"
        style={{ transformOrigin: '52% 44%' }}
      >
        <svg
          viewBox={`0 0 ${spec.w} ${spec.h}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <mask id="intro-reveal" maskUnits="userSpaceOnUse" x="-40" y="-40" width="480" height="380">
              <rect x="-40" y="-40" width="480" height="380" fill="black" />
              <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
                {strokes.map((d, i) => (
                  <path
                    key={i}
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    d={d}
                    strokeWidth={i < 14 ? 46 : i < 17 ? 34 : 40}
                  />
                ))}
              </g>
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
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 6px rgba(227,178,60,.65))' }}
          />

          {/* The fountain pen / brush */}
          <g
            ref={nibRef}
            style={{ opacity: 0, transition: 'opacity .5s ease', willChange: 'transform' }}
          >
            <g transform="translate(0 0) scale(0.62)">
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
            transition: 'opacity 1.4s cubic-bezier(.22,1,.36,1)',
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
            transition: 'opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)',
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
            width: phase === 'dust' ? '6%' : phase === 'draw' ? '72%' : '100%',
            transition: 'width 3.4s cubic-bezier(.22,1,.36,1)',
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
              // Parked off-stage to the right; sweeps left across the frame on cue.
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

      <p className="absolute bottom-7 left-5 z-10 hidden text-[10px] uppercase tracking-widest2 text-cream/35 sm:left-8 sm:block">
        {phase === 'draw' ? 'Painting the hall…' : phase === 'dust' ? 'Opening the gallery…' : 'Welcome'}
      </p>
    </div>
  );
}
