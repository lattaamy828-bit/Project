import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Painting } from '../art/Painting';
import { GiltRule } from '../components/Divider';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

const CHAPTERS = [
  {
    painting: 'almond-blossom',
    n: 'I',
    title: 'A room above a colour merchant',
    body: 'Atelier Étoile begins, in this fiction, in two rooms above a pigment merchant in the 6th arrondissement — chosen because the smell of linseed came up through the floorboards and nobody complained.',
  },
  {
    painting: 'sunflowers',
    n: 'II',
    title: 'Pigment before product',
    body: 'The house rule has never changed: read the canvas first. A formulator is given a painting, not a brief, and is expected to return with four colours and an argument about each one.',
  },
  {
    painting: 'cafe-terrace',
    n: 'III',
    title: 'Light at 2400 Kelvin',
    body: 'Every shade is signed off under three lights — noon, gallery, and the particular amber of a café terrace after dark. A colour that only works in one of them does not leave the building.',
  },
  {
    painting: 'starry-night',
    n: 'IV',
    title: 'Made to be kept',
    body: 'Glass is blown by hand, brass is turned, and everything refills. The house measures success in how long a flacon stays on a shelf, not how quickly it empties.',
  },
];

/**
 * Pinned cinematic chapter section.
 *
 * The canvas stays fixed while the copy advances, and the painting behind it
 * cross-fades and pushes in as scroll progresses — one scroll listener for the
 * whole section rather than one per chapter.
 */
export default function AtelierStory() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        if (span <= 0) return;
        // Quantised: a full-bleed canvas does not need sub-percent updates, and
        // every distinct value costs a React render plus a style write.
        const next = Math.max(0, Math.min(1, -r.top / span));
        setProgress((prev) => (Math.abs(next - prev) > 0.004 ? next : prev));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const idx = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length + 0.0001));

  /* Reduced motion gets the same content as a plain, readable list. */
  if (reduced) {
    return (
      <section className="shell py-24" aria-labelledby="atelier-title">
        <p className="eyebrow mb-4">Salle IV · The House</p>
        <h2 id="atelier-title" className="font-display text-[clamp(2.2rem,6vw,4rem)] font-light text-cream">The Atelier</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2">
          {CHAPTERS.map((c) => (
            <li key={c.n} className="card-oil rounded-xl p-6">
              <div className="mb-4 aspect-[4/3] overflow-hidden rounded-sm gilt">
                <Painting id={c.painting} decorative className="h-full w-full" />
              </div>
              <p className="font-script text-2xl text-gold-200">{c.n}</p>
              <h3 className="mt-2 font-display text-2xl text-cream">{c.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-cream/60">{c.body}</p>
            </li>
          ))}
        </ol>
        <Link to="/about" className="btn-ghost mt-10">Read the full history</Link>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${CHAPTERS.length * 88}vh` }} aria-labelledby="atelier-title">
      <section className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/*
          Only the current chapter and its immediate neighbours are mounted: the
          crossfade never spans more than two, and an offscreen full-bleed canvas
          is expensive to keep rasterised. The darkening is done with an overlay
          rather than a CSS filter, which would force the whole layer to
          re-rasterise on every scroll frame.
        */}
        {CHAPTERS.map((c, i) =>
          Math.abs(i - idx) > 1 ? null : (
            <div
              key={c.painting}
              className="absolute inset-0 -z-10 will-transform"
              style={{
                opacity: i === idx ? 1 : 0,
                transform: `scale(${(1.04 + progress * 0.12).toFixed(3)})`,
                transition: 'opacity 1.1s cubic-bezier(.22,1,.36,1)',
              }}
              aria-hidden="true"
            >
              <Painting id={c.painting} decorative className="h-full w-full" />
            </div>
          ),
        )}
        <div className="absolute inset-0 -z-10 bg-ink/45" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(100deg, rgba(5,6,13,.97) 0%, rgba(5,6,13,.9) 34%, rgba(7,10,24,.68) 72%, rgba(7,10,24,.52) 100%)',
          }}
        />
        <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(90% 70% at 20% 50%, rgba(5,6,13,.7), transparent 62%)' }} />

        <div className="shell relative w-full">
          <div className="max-w-[560px]">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-gold/60" />
              Salle IV · The House
            </p>
            <h2 id="atelier-title" className="mb-8 font-display text-[clamp(2rem,5.4vw,3.6rem)] font-light leading-none text-cream">
              The Atelier
            </h2>

            <div className="relative min-h-[300px]">
              {CHAPTERS.map((c, i) => (
                <article
                  key={c.n}
                  className="absolute inset-0"
                  style={{
                    opacity: i === idx ? 1 : 0,
                    transform: i === idx ? 'translateY(0)' : i < idx ? 'translateY(-26px)' : 'translateY(26px)',
                    transition: 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)',
                    pointerEvents: i === idx ? 'auto' : 'none',
                  }}
                  aria-hidden={i !== idx}
                >
                  <p className="font-script text-[clamp(2.4rem,7vw,4rem)] leading-none text-gold-200/80">{c.n}</p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.6rem)] font-light leading-tight text-cream">{c.title}</h3>
                  <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-relaxed text-cream/60">{c.body}</p>
                </article>
              ))}
            </div>

            {/* Chapter progress */}
            <div className="mt-10 flex items-center gap-2">
              {CHAPTERS.map((c, i) => (
                <span key={c.n} className="h-px flex-1 overflow-hidden bg-cream/12">
                  <span
                    className="block h-full origin-left bg-gradient-to-r from-gold to-gold-200"
                    style={{
                      transform: `scaleX(${i < idx ? 1 : i === idx ? Math.min(1, (progress * CHAPTERS.length) % 1) : 0})`,
                      transition: 'transform .2s linear',
                    }}
                  />
                </span>
              ))}
            </div>

            <GiltRule className="mt-8 max-w-[240px]" />
            <Link to="/about" className="btn-ghost mt-8">Read the full history</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
