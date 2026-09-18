import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Maximize2, X, ZoomIn } from 'lucide-react';
import { PAINTINGS, Painting, getPainting } from '../art/Painting';
import { VAN_GOGH } from '../art/vangogh';
import Reveal, { RevealText } from '../components/Reveal';
import { GiltRule } from '../components/Divider';
import { PRODUCTS } from '../data/products';
import Vessel from '../components/Vessel';
import { useMotionPrefs } from '../hooks/useMotionPrefs';

type Room = 'all' | 'vangogh' | 'masters';

const VG_IDS = new Set(VAN_GOGH.map((p) => p.id));

/** A magnifiable view of one canvas, with drag-to-pan once zoomed. */
function Lightbox({ id, onClose }: { id: string; onClose(): void }) {
  const spec = getPainting(id);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3.2, z + 0.4));
      if (e.key === '-') setZoom((z) => Math.max(1, z - 0.4));
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (zoom === 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  return (
    <div className="fixed inset-0 z-[88] grid place-items-center bg-ink/95 p-4 sm:p-10" role="dialog" aria-modal="true" aria-label={`${spec.title}, enlarged`} style={{ animation: 'lbIn .45s ease both' }}>
      <button ref={closeRef} type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream/75 transition hover:border-gold/60 hover:text-gold-200 sm:right-8 sm:top-8" aria-label="Close enlarged view">
        <X className="h-4 w-4" strokeWidth={1.5} />
      </button>

      <div
        className="relative max-h-full w-full max-w-[1100px] overflow-hidden rounded-sm gilt-lux"
        style={{ aspectRatio: `${spec.w} / ${spec.h}`, cursor: zoom > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in' }}
        onPointerDown={(e) => {
          if (zoom > 1) {
            dragging.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const lim = (zoom - 1) * 260;
          setPan({
            x: Math.max(-lim, Math.min(lim, e.clientX - dragging.current.x)),
            y: Math.max(-lim, Math.min(lim, e.clientY - dragging.current.y)),
          });
        }}
        onPointerUp={() => {
          dragging.current = null;
        }}
        onClick={() => zoom === 1 && setZoom(2)}
      >
        <Painting
          id={id}
          texture
          className="h-full w-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: dragging.current ? 'none' : 'transform .6s cubic-bezier(.22,1,.36,1)',
          }}
        />
      </div>

      <div className="mt-5 flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-cream">{spec.title}</p>
          <p className="font-sans text-[11px] text-cream/45">{spec.artist} · {spec.year}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="btn-quiet" disabled={zoom <= 1}>− Zoom out</button>
          <span className="font-sans text-[11px] tabular-nums text-cream/50" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(3.2, z + 0.5))} className="btn-quiet" disabled={zoom >= 3.2}>+ Zoom in</button>
        </div>
      </div>
      <style>{`@keyframes lbIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

export default function GalleryHall({
  preview = false,
  showIntro = true,
}: {
  preview?: boolean;
  /** The dedicated gallery page supplies its own heading, so the hall omits one. */
  showIntro?: boolean;
}) {
  const [room, setRoom] = useState<Room>('all');
  const [activeId, setActiveId] = useState(PAINTINGS[0].id);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { reduced } = useMotionPrefs();

  const list = useMemo(() => {
    const all =
      room === 'vangogh'
        ? PAINTINGS.filter((p) => VG_IDS.has(p.id))
        : room === 'masters'
          ? PAINTINGS.filter((p) => !VG_IDS.has(p.id))
          : PAINTINGS;
    // The home page shows a selection; the gallery page shows the whole hall.
    return preview ? all.slice(0, 8) : all;
  }, [room, preview]);

  useEffect(() => {
    if (!list.some((p) => p.id === activeId)) setActiveId(list[0].id);
  }, [list, activeId]);

  const active = getPainting(activeId);
  const linked = PRODUCTS.filter((p) => p.painting === activeId).slice(0, 3);

  return (
    <section
      className="defer-paint relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="gallery-title"
      style={{
        // The whole room takes its light from whichever canvas is on the wall.
        background: `radial-gradient(120% 90% at 50% 0%, ${active.palette.bg} 0%, ${active.palette.deep} 46%, #05060d 100%)`,
        transition: reduced ? 'none' : 'background 1.4s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {/* Raking gallery light, tinted by the active canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 40% at 50% 8%, ${active.palette.glow}22, transparent 70%)`,
          transition: reduced ? 'none' : 'background 1.4s cubic-bezier(.22,1,.36,1)',
        }}
      />

      <div className="shell relative">
        <div className={`flex flex-wrap items-end gap-6 ${showIntro ? 'justify-between' : 'justify-start'}`}>
          {showIntro && (
            <div>
              <Reveal variant="fade">
                <p className="eyebrow mb-4 flex items-center gap-3">
                  <span className="inline-block h-px w-10 bg-gold/60" />
                  Salle III · The Hall of Canvases
                </p>
              </Reveal>
              <RevealText as="h2" id="gallery-title" text="The Art Gallery" className="block font-display text-[clamp(2.2rem,6vw,4.4rem)] font-light leading-[0.95] text-cream" />
              <Reveal variant="up" delay={200}>
                <p className="mt-5 max-w-[52ch] font-sans text-[15px] leading-relaxed text-cream/55">
                  {PAINTINGS.length} canvases, every one generated in code for this demo — swirl
                  fields, impasto dabs and gold tessellation written as geometry rather than
                  photographed. They are interpretations, never reproductions.
                </p>
              </Reveal>
            </div>
          )}
          {!showIntro && <h2 id="gallery-title" className="sr-only-focusable">The hall of canvases</h2>}

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['all', 'All rooms'],
                ['vangogh', 'Van Gogh'],
                ['masters', 'The Masters'],
              ] as Array<[Room, string]>
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setRoom(k)}
                className="rounded-full border px-4 py-2 font-sans text-[10px] uppercase tracking-widest2 transition-all duration-500"
                style={{
                  borderColor: room === k ? 'rgba(227,178,60,.7)' : 'rgba(244,234,215,.16)',
                  color: room === k ? '#f7dd9b' : 'rgba(244,234,215,.55)',
                  background: room === k ? 'rgba(227,178,60,.09)' : 'transparent',
                }}
                aria-pressed={room === k}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ------- The wall: one principal canvas, its label, and the rest ------- */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <button
              type="button"
              onClick={() => setLightbox(activeId)}
              className="group relative block w-full overflow-hidden rounded-sm gilt-lux outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{ aspectRatio: `${active.w} / ${active.h}` }}
              aria-label={`Enlarge ${active.title}`}
            >
              <Painting
                key={active.id}
                id={active.id}
                texture={!reduced}
                className="h-full w-full transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.035]"
                style={reduced ? undefined : { animation: 'canvasIn 1s cubic-bezier(.22,1,.36,1) both' }}
              />
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(60% 50% at 50% 50%, transparent, rgba(5,6,13,.5))' }} />
              <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-cream/25 bg-midnight-900/70 px-3 py-1.5 font-sans text-[9px] uppercase tracking-widest2 text-cream/85 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                <ZoomIn className="h-3 w-3" strokeWidth={1.6} /> Examine closely
              </span>
            </button>

            {/* Museum wall label */}
            <div className="placard mt-5 max-w-[540px] rounded-[2px] px-5 py-4">
              <p className="font-sans text-[9px] uppercase tracking-widest2 text-[#8a6f45]">{active.year}</p>
              <p className="mt-1.5 font-display text-2xl leading-tight text-[#2a2013]">{active.title}</p>
              <p className="mt-0.5 font-sans text-[11px] text-[#5c4a2e]">{active.artist}</p>
              <p className="mt-3 font-sans text-[12.5px] leading-relaxed text-[#40331f]">{active.note}</p>
            </div>

            {linked.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow mb-3">Formulated from this canvas</p>
                <ul className="flex flex-wrap gap-3">
                  {linked.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.id}`} className="group flex items-center gap-3 rounded-xl border border-cream/12 bg-midnight-900/50 p-2 pr-4 transition-all duration-500 hover:border-gold/50">
                        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-midnight-800">
                          <Vessel kind={p.vessel} hue={p.hue} className="h-full w-full" shadow={false} />
                        </span>
                        <span>
                          <span className="block font-display text-base text-cream transition-colors group-hover:text-gold-200">{p.name}</span>
                          <span className="block font-sans text-[10px] text-cream/40">€{p.price}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* The rest of the hall */}
          <div>
            <p className="eyebrow mb-4">
              {preview ? `${list.length} of ${PAINTINGS.length} canvases` : `${list.length} canvases on view`}
            </p>
            <ul className="grid max-h-[620px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
              {list.map((p, i) => {
                const on = p.id === activeId;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      onDoubleClick={() => setLightbox(p.id)}
                      className="group relative block w-full overflow-hidden rounded-sm outline-none transition-all duration-600 ease-silk focus-visible:ring-2 focus-visible:ring-gold"
                      style={{
                        aspectRatio: `${p.w} / ${p.h}`,
                        boxShadow: on
                          ? 'inset 0 0 0 2px rgba(227,178,60,.85), 0 18px 38px -18px rgba(0,0,0,.95)'
                          : 'inset 0 0 0 1px rgba(244,234,215,.14), 0 10px 26px -16px rgba(0,0,0,.9)',
                        transform: on ? 'translateY(-3px)' : 'none',
                        animation: reduced ? undefined : `canvasIn .6s cubic-bezier(.22,1,.36,1) ${i * 45}ms both`,
                      }}
                      aria-pressed={on}
                      aria-label={`Show ${p.title} on the principal wall`}
                    >
                      <Painting id={p.id} decorative className="h-full w-full transition-all duration-700 ease-silk group-hover:scale-105" style={{ opacity: on ? 1 : 0.68 }} />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/92 to-transparent px-2.5 pb-2 pt-6 text-left">
                        <span className="block truncate font-display text-[13px] leading-tight text-cream">{p.title}</span>
                        <span className="block truncate font-sans text-[9px] text-cream/40">{p.year}</span>
                      </span>
                      <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-cream/25 bg-midnight-900/70 opacity-0 backdrop-blur transition-opacity duration-400 group-hover:opacity-100">
                        <Maximize2 className="h-3 w-3 text-cream/85" strokeWidth={1.6} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {preview && (
              <Link to="/gallery" className="btn-ghost mt-6 w-full">
                Enter the full gallery
              </Link>
            )}
          </div>
        </div>

        <GiltRule className="mx-auto mt-16 max-w-[420px]" />
        <p className="mt-6 text-center font-sans text-[11px] leading-relaxed text-cream/35">
          Every canvas on this site is generated from code for this demo — an interpretation in the
          spirit of the work it is named after, never a reproduction of it.
        </p>
      </div>

      {lightbox && <Lightbox id={lightbox} onClose={() => setLightbox(null)} />}
      <style>{`@keyframes canvasIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
