import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Painting, getPainting } from '../art/Painting';
import Reveal, { RevealText } from '../components/Reveal';
import { GiltRule } from '../components/Divider';
import BrushDivider from '../components/Divider';
import TiltCard from '../components/TiltCard';

const VALUES = [
  { n: '01', painting: 'sunflowers', title: 'Read the canvas first', body: 'A formulator is handed a painting, not a brief, and returns with four colours and an argument about each one. Three is a guess; five is wishful thinking.' },
  { n: '02', painting: 'cafe-terrace', title: 'Three lights, no exceptions', body: 'Daylight at 5600K, gallery at 4000K, café awning at 2400K. A shade that only works under one of them does not leave the building.' },
  { n: '03', painting: 'bedroom', title: 'Made to be kept', body: 'Hand-blown glass, turned brass, refills for everything. We measure success in how long a flacon stays on a shelf, not how fast it empties.' },
  { n: '04', painting: 'self-portrait', title: 'No averaged skin', body: 'Complexion ranges are derived from painted faces — greens, violets and cold blues included — rather than interpolated along a grid.' },
];

const TIMELINE: Array<[string, string, string, string]> = [
  ['MMXXVI', 'Two rooms above a pigment merchant', 'The house is founded in the 6th arrondissement, chosen because the smell of linseed came up through the floorboards and nobody complained.', 'bedroom'],
  ['MMXXVI', 'The first canvas is read', 'A generated nocturne yields four pigments. Eleven attempts later, one of them holds. The Nocturne Élixir is bottled.', 'starry-night'],
  ['MMXXVI', 'Twenty-four shades, derived not designed', 'Terre is assembled from samples taken directly from a portrait study rather than a shade ladder. It is harder to merchandise, and it does not go ashy.', 'self-portrait'],
  ['MMXXVI', 'A wall of canvases', 'The gallery opens to visitors. Every work in it is generated in code — an interpretation, never a reproduction.', 'night-watch'],
];

export default function About() {
  useEffect(() => window.scrollTo({ top: 0 }), []);

  return (
    <>
      <header className="relative flex min-h-[72svh] items-end overflow-hidden pb-14 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10">
          <Painting id="almond-blossom" decorative className="h-full w-full" style={{ opacity: 0.5 }} />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.7) 0%, rgba(7,10,24,.6) 40%, #070a18 92%)' }} />
        <div className="shell">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-gold/60" />
            The House · A fictional maison
          </p>
          <RevealText as="h1" text="Atelier Étoile" className="block font-display text-[clamp(3rem,10vw,7rem)] font-light leading-[0.9] text-gilt" />
          <p className="mt-6 max-w-[56ch] font-sans text-[16px] leading-relaxed text-cream/60">
            An invented maison de beauté, written for this demo. What follows is a story, not a
            history — but it is the story the rest of this site is built to.
          </p>
        </div>
      </header>

      <BrushDivider seed={7} />

      <section className="shell py-20" aria-labelledby="creed">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="eyebrow mb-4">The creed</p>
            <h2 id="creed" className="font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-tight text-cream">
              Pigment before product
            </h2>
            <GiltRule className="mt-8 max-w-[220px]" />
          </div>
          <div className="space-y-5 font-sans text-[15px] leading-relaxed text-cream/60">
            <p>
              There is a particular kind of cosmetics company that begins with a gap in the market.
              This one, in this fiction, begins with a wall of paintings and an argument about
              whether the yellow in a sunflower is one colour or six.
            </p>
            <p>
              It is six. The full-sun petal only reads as bright because of the seed-brown beside
              it. Take the yellow without the brown and you have a highlighter, not a palette. That
              observation — obvious once stated, and consistently ignored — is the whole method.
            </p>
            <p>
              So every formulation here begins on a canvas. The colours are read, the texture is
              matched, the light is argued about for months, and only then does anyone discuss what
              it might be. Some of those arguments take eleven months. One cream was never intended
              to be sold at all.
            </p>
            <p className="font-script text-2xl text-gold-200/85">Every formula is a brushstroke.</p>
          </div>
        </div>
      </section>

      <section className="shell py-16" aria-label="How the house works">
        <ul className="grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <li key={v.n}>
              <Reveal variant="up" delay={i * 100}>
                <TiltCard max={5} lift={10}>
                  <article className="group relative h-full overflow-hidden rounded-2xl card-oil p-7">
                    <div className="absolute inset-0 -z-10 opacity-[0.16] transition-opacity duration-700 group-hover:opacity-30">
                      <Painting id={v.painting} decorative className="h-full w-full" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(280px circle at var(--mx) var(--my), rgba(227,178,60,.16), transparent 62%)' }} />
                    <p className="font-script text-4xl leading-none text-gold-200/75">{v.n}</p>
                    <h3 className="mt-4 font-display text-2xl leading-tight text-cream">{v.title}</h3>
                    <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream/55">{v.body}</p>
                  </article>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell py-20" aria-labelledby="timeline">
        <p className="eyebrow mb-4">A short, invented history</p>
        <h2 id="timeline" className="mb-12 font-display text-[clamp(2rem,5vw,3.4rem)] font-light text-cream">Four moments</h2>
        <ol className="relative border-l border-cream/12 pl-8 sm:pl-12">
          {TIMELINE.map(([year, title, body, painting], i) => (
            <li key={title} className="relative pb-14 last:pb-0">
              <Reveal variant="left" delay={i * 110}>
                <span className="absolute -left-[41px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-gold/60 bg-midnight sm:-left-[57px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest2 text-gold-200/70">{year}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-light leading-tight text-cream">{title}</h3>
                    <p className="mt-3 max-w-[54ch] font-sans text-[14px] leading-relaxed text-cream/55">{body}</p>
                  </div>
                  <TiltCard max={6} lift={10} className="hidden md:block">
                    <div
                      className="overflow-hidden rounded-sm gilt"
                      style={{ aspectRatio: `${getPainting(painting).w} / ${getPainting(painting).h}`, transform: `rotate(${(i % 2 ? 1 : -1) * 1.6}deg)` }}
                    >
                      <Painting id={painting} decorative className="h-full w-full" />
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-gold/20 px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 -z-10 opacity-20">
            <Painting id="starry-night" decorative className="h-full w-full" />
          </div>
          <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(80% 90% at 50% 50%, rgba(7,10,24,.7), rgba(5,6,13,.94))' }} />
          <p className="eyebrow mb-5">Please note</p>
          <h2 className="mx-auto max-w-[22ch] font-display text-[clamp(1.6rem,4.4vw,2.8rem)] font-light leading-tight text-cream">
            Atelier Étoile is not a real company
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] font-sans text-[14px] leading-relaxed text-cream/55">
            Every product, price, review, rating, ingredient list, statistic and biographical detail
            on this site was invented for a design demonstration. Nothing is for sale and no orders
            are processed. The canvases are generated in code as original interpretations in the
            spirit of public-domain works — never reproductions of them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/gallery" className="btn-gold">Visit the gallery</Link>
            <Link to="/shop" className="btn-ghost">Browse the boutique</Link>
          </div>
        </div>
      </section>
    </>
  );
}
