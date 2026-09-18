import { useEffect, useRef } from 'react';
import { mulberry32 } from '../art/rng';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

/** Fixed film grain and light rays over the whole document. */
export function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] opacity-[0.5]"
        style={{
          background:
            'radial-gradient(140% 100% at 50% -10%, rgba(227,178,60,.09), transparent 46%), radial-gradient(120% 90% at 50% 110%, rgba(42,95,215,.1), transparent 52%)',
        }}
      />
    </>
  );
}

/**
 * Ambient paint motes drifting behind the page.
 *
 * One canvas for the whole site rather than a particle layer per section, and
 * it pauses itself whenever the tab is hidden.
 */
export function AmbientParticles({ density = 28 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { reduced, lite } = useMotionPrefs();

  useEffect(() => {
    if (reduced) return;
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    const count = lite ? Math.round(density * 0.45) : density;
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

    const rand = mulberry32(4242);
    const parts = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      r: 0.6 + rand() * 2.6,
      vx: (rand() - 0.5) * 0.00018,
      vy: -0.00006 - rand() * 0.00022,
      a: 0.1 + rand() * 0.4,
      c: rand() > 0.62 ? '227,178,60' : rand() > 0.3 ? '111,155,239' : '244,234,215',
      ph: rand() * 6.28,
    }));

    let frame = 0;
    let t = 0;
    let paused = document.hidden;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (paused) return;
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = rand();
        }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        const tw = 0.6 + 0.4 * Math.sin(t + p.ph);
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, 6.2832);
        ctx.fillStyle = `rgba(${p.c},${(p.a * tw).toFixed(3)})`;
        ctx.fill();
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
  }, [density, reduced, lite]);

  if (reduced) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
    />
  );
}

/**
 * A soft pool of light that follows the cursor, plus a small pigment-dot cursor.
 * Desktop and fine pointers only — it is decoration, never a control.
 */
export function CursorHalo() {
  const haloRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const { reduced, lite } = useMotionPrefs();

  useEffect(() => {
    if (reduced || lite) return;
    const halo = haloRef.current;
    const dot = dotRef.current;
    if (!halo || !dot) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let hx = tx;
    let hy = ty;
    let frame = 0;
    let over = false;
    let armed = false;

    const onMove = (e: PointerEvent) => {
      // Hidden until the pointer first moves, so neither marker sits parked in
      // the top-left corner on load.
      if (!armed) {
        armed = true;
        halo.style.opacity = '0.5';
        dot.style.opacity = '1';
      }
      tx = e.clientX;
      ty = e.clientY;
      // Positioned with no easing so the ring frames the real pointer exactly;
      // only its size animates. A lagging second dot reads as a glitch.
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%,-50%) scale(${over ? 1.55 : 1})`;
      const t = e.target as HTMLElement | null;
      const isInteractive = !!t?.closest('a, button, [role="button"], input, select, textarea');
      if (isInteractive !== over) {
        over = isInteractive;
        dot.style.borderColor = over ? 'rgba(227,178,60,.9)' : 'rgba(244,234,215,.42)';
        halo.style.opacity = over ? '0.85' : '0.5';
      }
    };
    const tick = () => {
      hx += (tx - hx) * 0.12;
      hy += (ty - hy) * 0.12;
      halo.style.transform = `translate3d(${hx.toFixed(1)}px, ${hy.toFixed(1)}px, 0) translate(-50%,-50%)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced, lite]);

  if (reduced || lite) return null;

  return (
    <div aria-hidden="true">
      <div
        ref={haloRef}
        className="pointer-events-none fixed left-0 top-0 z-[58] h-[420px] w-[420px] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(227,178,60,.14), rgba(42,95,215,.08) 42%, transparent 68%)',
          opacity: 0,
          transition: 'opacity .4s ease',
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[59] h-7 w-7 rounded-full border"
        style={{
          borderColor: 'rgba(244,234,215,.42)',
          opacity: 0,
          transition: 'scale .35s var(--ease-silk), border-color .3s ease, opacity .3s ease',
        }}
      />
    </div>
  );
}
