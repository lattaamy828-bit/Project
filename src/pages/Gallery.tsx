import { useEffect } from 'react';
import GalleryHall from '../sections/GalleryHall';
import { RevealText } from '../components/Reveal';
import { PAINTINGS, Painting, getPainting } from '../art/Painting';

export default function Gallery() {
  useEffect(() => window.scrollTo({ top: 0 }), []);

  return (
    <>
      <header className="relative overflow-hidden pb-10 pt-[calc(var(--nav-h)+4rem)]">
        <div className="absolute inset-0 -z-10 opacity-30">
          <Painting id="night-watch" decorative className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(5,6,13,.84), #070a18 88%)' }} />
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-gold/60" />
              The Museum · {PAINTINGS.length} canvases
            </p>
            <RevealText as="h1" text="A Museum That Sells Beauty" className="block max-w-[16ch] font-display text-[clamp(2.4rem,7vw,5.2rem)] font-light leading-[0.92] text-cream" />
            <p className="mt-6 max-w-[58ch] font-sans text-[15px] leading-relaxed text-cream/55">
              Eight rooms after Van Gogh, ten after the masters who came before and after him.
              Choose a canvas and the hall changes its light to match — double-click any small work
              to hang it on the principal wall and open it full size.
            </p>
          </div>

          {/* A wall of frames, hung at slightly different heights */}
          <div className="hidden grid-cols-3 gap-4 lg:grid" aria-hidden="true">
            {['sunflowers', 'the-kiss', 'pearl-earring', 'cafe-terrace', 'water-lilies', 'irises'].map((pid, i) => (
              <div
                key={pid}
                className="self-start overflow-hidden rounded-sm gilt"
                style={{
                  aspectRatio: `${getPainting(pid).w} / ${getPainting(pid).h}`,
                  marginTop: `${(i % 3) * 18}px`,
                  transform: `rotate(${((i % 3) - 1) * 1.4}deg)`,
                  animation: `frameIn .9s cubic-bezier(.22,1,.36,1) ${i * 90}ms both`,
                }}
              >
                <Painting id={pid} decorative className="h-full w-full" />
              </div>
            ))}
            <style>{`@keyframes frameIn{from{opacity:0;transform:translateY(22px) scale(.96)}to{opacity:1}}`}</style>
          </div>
        </div>
      </header>
      <GalleryHall showIntro={false} />
    </>
  );
}
