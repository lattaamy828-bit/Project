import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Painting, getPainting } from '../art/Painting';
import Vessel from '../components/Vessel';
import Reveal, { RevealText } from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { COLLECTIONS, PRODUCTS } from '../data/products';

const BLURB: Record<string, string> = {
  Nocturne: 'Cobalt, gold and the particular blue of a sky painted at two in the morning.',
  Solaire: 'Twelve golds, no two the same temperature, ordered from seed-brown to full noon.',
  Lamplight: 'Warm light poured onto cold stone — every shade signed off at 2400 Kelvin.',
  Champ: 'Restless texture: wind across a field, and the shimmer that comes with it.',
  Amande: 'The quiet collection. Fragrance-free, unhurried, made originally as a gift.',
  Portrait: 'Complexion read from a painted face rather than a shade wheel.',
  Maison: 'Objects for keeping — pear wood, linen, brass, and a balm for the end of the day.',
  Vermeer: 'One highlight, placed correctly, is worth six.',
  Naissance: 'A flush that is neither coral nor rose, taken from the inside of a shell.',
  Rembrandt: 'Chiaroscuro: withhold most of the canvas so a little of it can blaze.',
  Monet: 'Surface without horizon — formulas that leave no visible edge.',
  Klimt: 'Beaten metal, not glitter. The difference took eleven months.',
  Fresque: 'Pigment that binds as it cures. No corrections possible.',
  Manet: 'Eyes level with the lens.',
};

export default function Collections() {
  useEffect(() => window.scrollTo({ top: 0 }), []);

  const rows = COLLECTIONS.map((c) => {
    const items = PRODUCTS.filter((p) => p.collection === c);
    return { name: c, items, painting: items[0]?.painting ?? 'starry-night' };
  }).sort((a, b) => b.items.length - a.items.length);

  return (
    <>
      <header className="relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10 opacity-25">
          <Painting id="wheatfield" decorative className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.82), #070a18 88%)' }} />
        <div className="shell">
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-gold/60" />
            {rows.length} collections
          </p>
          <RevealText as="h1" text="Hung by Collection" className="block max-w-[14ch] font-display text-[clamp(2.4rem,7vw,5.2rem)] font-light leading-[0.92] text-cream" />
          <p className="mt-6 max-w-[54ch] font-sans text-[15px] leading-relaxed text-cream/55">
            Each collection answers to one canvas. Some hold a single object; the largest holds five.
          </p>
        </div>
      </header>

      <div className="shell space-y-6 pb-28">
        {rows.map((row, i) => {
          const spec = getPainting(row.painting);
          return (
            <Reveal key={row.name} variant="up" delay={Math.min(i, 6) * 80}>
              <TiltCard max={4} lift={8}>
                <article
                  className="group relative grid overflow-hidden rounded-2xl border border-cream/12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
                  style={{ background: `linear-gradient(140deg, ${spec.palette.bg}, ${spec.palette.deep})` }}
                >
                  <div className="relative min-h-[240px] overflow-hidden">
                    <Painting id={row.painting} decorative className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-silk group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(7,10,24,.15), rgba(7,10,24,.85))' }} />
                    <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(300px circle at var(--mx) var(--my), rgba(227,178,60,.2), transparent 62%)' }} />
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-9">
                    <p className="eyebrow">{row.items.length} {row.items.length === 1 ? 'piece' : 'pieces'} · after {spec.title}</p>
                    <h2 className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3rem)] font-light leading-none text-cream">{row.name}</h2>
                    <p className="mt-4 max-w-[44ch] font-sans text-[14px] leading-relaxed text-cream/55">
                      {BLURB[row.name] ?? 'A collection drawn from a single canvas.'}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2.5">
                      {row.items.map((p) => (
                        <li key={p.id}>
                          <Link to={`/product/${p.id}`} className="group/i flex items-center gap-2.5 rounded-full border border-cream/14 py-1.5 pl-1.5 pr-4 transition-all duration-500 hover:border-gold/55">
                            <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-midnight-900/60">
                              <Vessel kind={p.vessel} hue={p.hue} className="h-full w-full" shadow={false} />
                            </span>
                            <span className="font-sans text-[11px] text-cream/70 transition-colors group-hover/i:text-gold-200">{p.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/shop?collection=${encodeURIComponent(row.name)}`} className="btn-ghost mt-8 self-start">
                      See the collection
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
