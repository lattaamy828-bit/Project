import { memo, useMemo, type CSSProperties, type ReactNode } from 'react';
import { VAN_GOGH } from './vangogh';
import { MASTERS } from './masters';
import { rngFor } from './rng';
import type { PaintingSpec } from './types';

export const PAINTINGS: PaintingSpec[] = [...VAN_GOGH, ...MASTERS];
export const PAINTING_BY_ID = new Map(PAINTINGS.map((p) => [p.id, p]));
export type PaintingId = string;

/**
 * Photographic plates, if any are present.
 *
 * `src/art/plates/` is empty by default and the site draws its own canvases.
 * Running `npm run fetch:art` fills it with public-domain photographs from
 * Wikimedia Commons, and every painting on the site — gallery walls, product
 * cards, the projections inside the glass, the opening sequence's brush mask —
 * switches to the photograph, because they all render through this one module.
 * Delete the folder's contents and it switches back. Vite resolves the glob at
 * build time, so an absent plate costs nothing at all in the bundle.
 */
const PLATE_URLS = import.meta.glob('./plates/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const PLATES = new Map(
  Object.entries(PLATE_URLS).map(([file, url]) => [
    file.split('/').pop()!.replace(/\.[^.]+$/, ''),
    url,
  ]),
);

/** Whether this painting is currently backed by a photograph rather than geometry. */
export const hasPlate = (id: string) => PLATES.has(id);
export const plateCount = () => PLATES.size;

/**
 * Generated geometry is cached per painting id. Each spec costs a few thousand
 * trig calls to build, so a page that shows the same canvas in a card, a hero
 * and a lightbox pays for it exactly once.
 */
const cache = new Map<string, ReactNode>();

function bodyFor(spec: PaintingSpec): ReactNode {
  const hit = cache.get(spec.id);
  if (hit) return hit;

  const plate = PLATES.get(spec.id);
  /*
   * A plate is drawn into the spec's own viewBox and cropped to it, so every
   * layout, mask, pattern and aspect ratio downstream behaves identically
   * whether the canvas is a photograph or generated geometry.
   */
  const built = plate ? (
    <image href={plate} x="0" y="0" width={spec.w} height={spec.h} preserveAspectRatio="xMidYMid slice" />
  ) : (
    spec.render(rngFor(spec.id))
  );

  cache.set(spec.id, built);
  return built;
}

export function getPainting(id: string): PaintingSpec {
  return PAINTING_BY_ID.get(id) ?? PAINTINGS[0];
}

/**
 * The raw SVG children of a painting, without its own <svg> wrapper — for
 * callers that need to place a canvas inside their own coordinate system, such
 * as the opening sequence drawing it under an animated brush mask.
 */
export function PaintingBody({ id }: { id: string }) {
  const spec = getPainting(id);
  const body = useMemo(() => bodyFor(spec), [spec]);
  return <>{body}</>;
}

interface PaintingProps {
  id: PaintingId;
  className?: string;
  style?: CSSProperties;
  /** `cover` crops to fill its box; `contain` shows the whole canvas. */
  fit?: 'cover' | 'contain';
  /** Painterly edge displacement. Costly at large sizes — off by default. */
  texture?: boolean;
  /** Decorative instances are hidden from assistive tech. */
  decorative?: boolean;
  title?: string;
}

/**
 * Renders one generated canvas as inline SVG.
 *
 * Everything is vector, so a painting is equally crisp as a 96px thumbnail and
 * as a full-bleed hero, and the whole gallery costs no network requests.
 */
export const Painting = memo(function Painting({
  id,
  className,
  style,
  fit = 'cover',
  texture = false,
  decorative = false,
  title,
}: PaintingProps) {
  const spec = getPainting(id);
  const body = useMemo(() => bodyFor(spec), [spec]);
  const label = title ?? `${spec.title} — ${spec.artist}`;

  return (
    <svg
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}
      className={className}
      style={style}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
    >
      {!decorative && <title>{label}</title>}
      <g filter={texture ? 'url(#atelier-oil)' : undefined}>{body}</g>
    </svg>
  );
});

/**
 * Document-level filter defs, mounted once by the app shell. Keeping them in a
 * single hidden SVG lets every painting reference them by id without paying to
 * re-declare turbulence per instance.
 */
export function ArtFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <filter id="atelier-oil" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028 0.04" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="atelier-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="atelier-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  );
}
