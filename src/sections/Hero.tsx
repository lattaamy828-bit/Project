import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { PAINTINGS, Painting } from '../art/Painting';
import Vessel from './../components/Vessel';
import MagneticButton from '../components/MagneticButton';
import { RevealText } from '../components/Reveal';
import { useParallax } from '../hooks/usePointer';
import { useMotionPrefs } from '../hooks/useMotionPrefs';
import { AVERAGE_RATING, CATALOGUE_SIZE, getProduct } from '../data/products';
import { mulberry32 } from '../art/rng';

const FLOATERS = ['nocturne-elixir', 'solaire-palette', 'iris-nuit', 'terrasse-lip'] as const;

/** Depth positions for the floating products, in percentages of the stage. */
const STAGE = [
  { x: 52, y: 50, s: 1, z: 0, d: 0 },
  { x: 27, y: 24, s: 0.42, z: -180, d: 0.9 },
  { x: 85, y: 26, s: 0.4, z: -240, d: 1.6 },
  { x: 79, y: 76, s: 0.52, z: -110, d: 2.4 },
];

export default function Hero() {
  const { reduced, lite } = useMotionPrefs();
  const sectionRef = useRef<HTMLElement | null>(null);
  const petalRef = useRef<HTMLCanvasElement | null>(null);

  /* Layers declare their depth below; the hook writes their transforms. */
  useParallax(sectionRef, 0.07);

  /* Petals and paint flecks blowing across the hero. */
  useEffect(() => {
    if (reduced) return;
    const cv = petalRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const rand = mulberry32(777);
    const n = lite ? 12 : 22;
    const petals = Array.from({ length: n }, () => ({
      x: rand(),
      y: rand(),
      r: 4 + rand() * 9,
      rot: rand() * 6.28,
      vr: (rand() - 0.5) * 0.02,
      vx: 0.0004 + rand() * 0.0012,
      vy: 0.0002 + rand() * 0.0006,
      sw: rand() * 6.28,
      c: rand() > 0.55 ? 'rgba(251,246,236,' : rand() > 0.3 ? 'rgba(227,178,60,' : 'rgba(232,183,176,',
      a: 0.2 + rand() * 0.45,
    }));

    let frame = 0;
    let t = 0;
    let paused = document.hidden;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (paused) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.x += p.vx + Math.sin(t + p.sw) * 0.0006;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.x > 1.06) p.x = -0.06;
        if (p.y > 1.06) {
          p.y = -0.06;
          p.x = rand();
        }
        const px = p.x * w;
        const py = p.y * h;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.42, 0, 0, 6.2832);
        ctx.fillStyle = `${p.c}${(p.a * (0.6 + 0.4 * Math.sin(t * 1.4 + p.sw))).toFixed(3)})`;
        ctx.fill();
        ctx.restore();
      }
    };
    const onVis = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced, lite]);


  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden pt-[var(--nav-h)]"
      aria-labelledby="hero-title"
    >
      {/* The sky: slowest layer, and the only full-bleed canvas on the page */}
      <div className="absolute inset-0 -z-30 will-transform" data-parallax="0.35" style={{ scale: '1.14' }}>
        <Painting id="starry-night" decorative className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-20" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.62) 0%, rgba(7,10,24,.4) 34%, rgba(7,10,24,.92) 88%, #070a18 100%)' }} />

      <canvas ref={petalRef} className="pointer-events-none absolute inset-0 -z-[5] h-full w-full" aria-hidden="true" />

      <div className="shell relative grid min-h-[calc(100svh-var(--nav-h))] items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-20">
        {/* ---------------- Copy ---------------- */}
        <div className="relative z-10 max-w-[620px]" data-parallax="0.18">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-gold/60" />
            Maison de Beauté · Paris · A fictional demo
          </p>

          {/* The line is split into three animated blocks, so the accessible name
              is stated once here rather than being read as run-together words. */}
          <h1
            id="hero-title"
            aria-label="Beauty, Painted Into Life."
            className="font-display text-[clamp(3rem,9vw,7.2rem)] font-light leading-[0.9] tracking-[-0.015em]"
          >
            <RevealText text="Beauty," className="block text-cream" />
            <RevealText text="Painted Into" className="block" delay={140} gilt />
            <RevealText text="Life." className="block text-cream" delay={300} />
          </h1>

          <p className="mt-7 max-w-[46ch] font-sans text-[15px] leading-relaxed text-cream/60 sm:text-base">
            {CATALOGUE_SIZE} formulations, each one sampled from a painting. Pigments ground in a
            Paris atelier, bottled in hand-blown glass, and named for the light they came from.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton to="/shop" className="btn-gold">
              Enter the boutique
            </MagneticButton>
            <MagneticButton to="/gallery" className="btn-ghost">
              Visit the gallery
            </MagneticButton>
          </div>

          <dl className="mt-12 grid max-w-[460px] grid-cols-3 gap-x-3 gap-y-2 border-t border-cream/10 pt-6">
            {[
              [String(CATALOGUE_SIZE), 'Formulations'],
              [String(PAINTINGS.length), 'Canvases'],
              [AVERAGE_RATING.toFixed(1), 'Average rating'],
            ].map(([n, l]) => (
              <div key={l} className="min-w-0">
                <dt className="font-display text-2xl text-gold-200 sm:text-3xl">{n}</dt>
                <dd className="mt-1 font-sans text-[9px] uppercase leading-snug tracking-[0.14em] text-cream/40 sm:text-[10px] sm:tracking-widest2">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------------- Floating composition ---------------- */}
        <div className="relative h-[46vh] min-h-[320px] w-full perspective-1400 lg:h-[76vh]">
          {/* Halo behind the centre piece */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(227,178,60,.22) 0%, rgba(42,95,215,.14) 38%, transparent 68%)' }}
          />

          {/* Framed canvases hanging behind the products */}
          <div
            aria-hidden="true"
            className="absolute bottom-[4%] left-[1%] hidden h-[27%] w-[20%] overflow-hidden rounded-sm gilt xl:block"
            data-parallax="1.5"
            style={{ rotate: '-5deg' }}
          >
            <Painting id="sunflowers" decorative className="h-full w-full" />
          </div>
          <div
            aria-hidden="true"
            className="absolute left-0 top-[2%] hidden h-[20%] w-[15%] overflow-hidden rounded-sm gilt xl:block"
            data-parallax="1.2"
            style={{ rotate: '6deg' }}
          >
            <Painting id="almond-blossom" decorative className="h-full w-full" />
          </div>

          {FLOATERS.map((id, i) => {
            const prod = getProduct(id);
            const s = STAGE[i];
            if (!prod) return null;
            return (
              <Link
                key={id}
                to={`/product/${id}`}
                className="group absolute block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={`${prod.name} — ${prod.subtitle}`}
                data-parallax={(2.2 - s.s).toFixed(2)}
                data-parallax-base="translate(-50%,-50%)"
                data-parallax-z={s.z}
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  height: `${s.s * 88}%`,
                  transform: `translate(-50%,-50%) translateZ(${s.z}px)`,
                  transition: 'height .6s ease',
                }}
              >
                <Vessel
                  kind={prod.vessel}
                  hue={prod.hue}
                  painting={prod.painting}
                  float={reduced ? undefined : i}
                  className="h-full w-auto transition-transform duration-700 ease-silk group-hover:scale-[1.07]"
                />
                {i === 0 && (
                  <span className="placard absolute -bottom-4 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-[2px] px-3 py-1.5 font-sans text-[9px] uppercase tracking-widest2 sm:block">
                    {prod.name} · €{prod.price}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#collection"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-sans text-[9px] uppercase tracking-widest2 text-cream/40 transition-colors hover:text-gold-200"
      >
        Continue through the hall
        <ArrowDown className="h-4 w-4 animate-drift" strokeWidth={1.2} />
      </a>

    </section>
  );
}
