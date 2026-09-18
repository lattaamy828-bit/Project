import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Painting, getPainting } from '../art/Painting';
import Vessel from '../components/Vessel';
import Reveal, { RevealText } from '../components/Reveal';
import { GiltRule } from '../components/Divider';
import { getProduct } from '../data/products';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

interface Chain {
  painting: string;
  productId: string;
  pigments: Array<{ hex: string; name: string }>;
  texture: string;
  claim: string;
}

const CHAINS: Chain[] = [
  {
    painting: 'sunflowers',
    productId: 'solaire-palette',
    pigments: [
      { hex: '#f7dd9b', name: 'Petal, full sun' },
      { hex: '#e3b23c', name: 'Chrome yellow' },
      { hex: '#c0902a', name: 'Ochre, shaded' },
      { hex: '#5e3a18', name: 'Seed brown' },
    ],
    texture: 'Pressed silk powder, six mattes and two foils',
    claim: 'Van Gogh’s yellows → golden pigments → a twelve-pan eye atelier',
  },
  {
    painting: 'starry-night',
    productId: 'nocturne-elixir',
    pigments: [
      { hex: '#0b1026', name: 'Midnight ground' },
      { hex: '#1b3a8c', name: 'Cobalt deep' },
      { hex: '#6f9bef', name: 'Star halo' },
      { hex: '#e3b23c', name: 'Lamp gold' },
    ],
    texture: 'Weightless aqueous serum, absorbs in forty seconds',
    claim: 'A restless night sky → cobalt and gold → an overnight restorative',
  },
  {
    painting: 'the-kiss',
    productId: 'byzance-foil',
    pigments: [
      { hex: '#f2c14e', name: 'Gold leaf' },
      { hex: '#8a6520', name: 'Bronze ancien' },
      { hex: '#3d2c0c', name: 'Burnt gilt' },
      { hex: '#cf6f7a', name: 'Floret rose' },
    ],
    texture: 'Mica-and-silk suspension with a beaten-metal grain',
    claim: 'Beaten gold leaf → metallic suspension → an eye foil with real texture',
  },
];

const STEPS = ['The painting', 'The pigment', 'The texture', 'The formula'];

export default function ArtToCosmetic() {
  const [active, setActive] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { reduced } = useMotionPrefs();
  const chain = CHAINS[active];
  const product = getProduct(chain.productId);
  const spec = getPainting(chain.painting);

  useEffect(() => {
    if (reduced) {
      setDrawn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  if (!product) return null;

  return (
    <section className="defer-paint relative overflow-hidden py-24 sm:py-28" aria-labelledby="chain-title">
      <div className="absolute inset-0 -z-10 opacity-[0.16]">
        <Painting id={chain.painting} decorative className="h-full w-full" style={{ transition: 'opacity .9s ease' }} />
      </div>
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(90% 70% at 50% 40%, rgba(7,10,24,.72), #070a18 82%)' }} />

      <div className="shell">
        <div className="mx-auto max-w-[760px] text-center">
          <Reveal variant="fade">
            <p className="eyebrow mb-5">Salle II · The Method</p>
          </Reveal>
          <RevealText
            as="h2"
            id="chain-title"
            text="Every Formula Is a Brushstroke"
            className="block font-display text-[clamp(2.2rem,6.4vw,4.6rem)] font-light leading-[0.95] text-cream"
          />
          <Reveal variant="up" delay={220}>
            <p className="mx-auto mt-6 max-w-[54ch] font-sans text-[15px] leading-relaxed text-cream/55">
              Nothing in this house begins with a shade card. It begins with a canvas — its
              pigments read, its texture matched, its light argued about for months. This is the
              route from one to the other.
            </p>
          </Reveal>
          <GiltRule className="mx-auto mt-8 max-w-[300px]" />
        </div>

        {/* Chain switcher */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CHAINS.map((c, i) => {
            const s = getPainting(c.painting);
            return (
              <button
                key={c.painting}
                type="button"
                onClick={() => setActive(i)}
                className="rounded-full border px-4 py-2 font-sans text-[10px] uppercase tracking-widest2 transition-all duration-500"
                style={{
                  borderColor: i === active ? 'rgba(227,178,60,.7)' : 'rgba(244,234,215,.16)',
                  color: i === active ? '#f7dd9b' : 'rgba(244,234,215,.55)',
                  background: i === active ? 'rgba(227,178,60,.09)' : 'transparent',
                }}
                aria-pressed={i === active}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* The chain */}
        <div ref={ref} className="relative mt-14">
          {/* Connecting line, drawn once in view — behind the steps, through the gutters */}
          <svg
            className="pointer-events-none absolute left-0 top-[86px] -z-10 hidden h-[260px] w-full lg:block"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M150,150 C250,90 290,210 400,150 C510,90 550,210 660,150 C770,90 810,210 920,150 C1000,110 1040,150 1060,150"
              fill="none"
              stroke="#e3b23c"
              strokeOpacity="0.32"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: drawn ? 0 : 1, transition: 'stroke-dashoffset 2.2s cubic-bezier(.22,1,.36,1) .2s' }}
            />
            <path
              d="M150,162 C250,102 290,222 400,162 C510,102 550,222 660,162 C770,102 810,222 920,162 C1000,122 1040,162 1060,162"
              fill="none"
              stroke="#6f9bef"
              strokeOpacity="0.2"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: drawn ? 0 : 1, transition: 'stroke-dashoffset 2.4s cubic-bezier(.22,1,.36,1) .35s' }}
            />
          </svg>

          <ol className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {/* 1 — painting */}
            <li className="flex flex-col items-center text-center">
              <span className="eyebrow mb-4">01 · {STEPS[0]}</span>
              <div className="w-full max-w-[220px] overflow-hidden rounded-sm gilt-lux" style={{ aspectRatio: `${spec.w} / ${spec.h}` }}>
                <Painting id={chain.painting} className="h-full w-full" />
              </div>
              <p className="mt-4 font-display text-lg text-cream">{spec.title}</p>
              <p className="mt-1 font-sans text-[11px] text-cream/40">{spec.year}</p>
            </li>

            {/* 2 — pigments */}
            <li className="flex flex-col items-center text-center">
              <span className="eyebrow mb-4">02 · {STEPS[1]}</span>
              <div className="flex w-full max-w-[220px] flex-col gap-2">
                {chain.pigments.map((pg, i) => (
                  <div
                    key={pg.hex}
                    className="flex items-center gap-3 rounded-lg border border-cream/10 bg-midnight-800/50 p-2"
                    style={{
                      opacity: drawn ? 1 : 0,
                      transform: drawn ? 'translateX(0)' : 'translateX(-16px)',
                      transition: `opacity .5s ease ${220 + i * 90}ms, transform .5s cubic-bezier(.22,1,.36,1) ${220 + i * 90}ms`,
                    }}
                  >
                    <span className="h-8 w-8 shrink-0 rounded-md ring-1 ring-cream/20" style={{ background: pg.hex, boxShadow: `0 6px 18px -6px ${pg.hex}` }} />
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate font-sans text-[11px] text-cream/75">{pg.name}</span>
                      <span className="block font-sans text-[9px] uppercase tracking-widest2 text-cream/30">{pg.hex}</span>
                    </span>
                  </div>
                ))}
              </div>
            </li>

            {/* 3 — texture */}
            <li className="flex flex-col items-center text-center">
              <span className="eyebrow mb-4">03 · {STEPS[2]}</span>
              <div className="relative w-full max-w-[220px] overflow-hidden rounded-xl border border-cream/10 bg-midnight-800/60" style={{ aspectRatio: '1 / 1' }}>
                <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id={`smear-${active}`} x1="0" y1="0" x2="1" y2="1">
                      {chain.pigments.map((pg, i) => (
                        <stop key={pg.hex} offset={`${(i / (chain.pigments.length - 1)) * 100}%`} stopColor={pg.hex} />
                      ))}
                    </linearGradient>
                  </defs>
                  {/* A swatch smeared with a palette knife */}
                  <path
                    d="M22,128 C42,84 76,66 116,72 C152,78 176,98 180,120 C184,146 156,166 116,164 C74,162 34,158 22,128Z"
                    fill={`url(#smear-${active})`}
                    style={{
                      clipPath: drawn ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                      transition: 'clip-path .95s cubic-bezier(.65,0,.35,1) .3s',
                    }}
                  />
                  <path d="M30,140 C60,120 100,116 140,126" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="4" strokeLinecap="round" />
                  <path d="M40,152 C72,138 108,136 150,146" fill="none" stroke="#000000" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" />
                  <path d="M170,116 C182,112 190,120 186,130" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-4 max-w-[26ch] font-sans text-[12px] leading-relaxed text-cream/55">{chain.texture}</p>
            </li>

            {/* 4 — product */}
            <li className="flex flex-col items-center text-center">
              <span className="eyebrow mb-4">04 · {STEPS[3]}</span>
              <Link to={`/product/${product.id}`} className="group block w-full max-w-[220px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <div className="relative overflow-hidden rounded-xl border border-cream/10 bg-midnight-800/60 p-4" style={{ aspectRatio: '1 / 1' }}>
                  <div className="absolute inset-0 opacity-25">
                    <Painting id={chain.painting} decorative className="h-full w-full" />
                  </div>
                  <Vessel
                    kind={product.vessel}
                    hue={product.hue}
                    painting={product.painting}
                    label={product.name}
                    className="relative h-full w-full transition-transform duration-700 ease-silk group-hover:scale-105"
                    float={reduced ? undefined : 1}
                  />
                </div>
                <p className="mt-4 font-display text-lg text-cream transition-colors group-hover:text-gold-200">{product.name}</p>
                <p className="mt-1 font-sans text-[11px] text-cream/40">{product.subtitle} · €{product.price}</p>
              </Link>
            </li>
          </ol>

          <p className="mt-10 text-center font-script text-[clamp(1.1rem,3vw,1.7rem)] text-gold-200/85">{chain.claim}</p>
        </div>
      </div>
    </section>
  );
}
