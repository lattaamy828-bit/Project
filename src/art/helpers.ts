/**
 * Small composition helpers shared by every painting generator.
 *
 * The generators emit as few SVG nodes as possible: dozens of dabs that share a
 * stroke are concatenated into one `d` string rather than one element each,
 * which keeps a page holding fifteen paintings comfortably under a thousand
 * nodes.
 */

import { comma, smoothPath, type Pt } from './strokes';
import { makeFbm, type Rng } from './rng';

export const joinD = (parts: string[]) => parts.join(' ');

export interface DabOpts {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  count: number;
  len: [number, number];
  /** Radians. When omitted, the flow field decides. */
  angle?: (x: number, y: number) => number;
  curve?: [number, number];
}

/** Scatter comma-shaped dabs across a rectangle, returning one path string. */
export function dabField(rand: Rng, o: DabOpts): string {
  const parts: string[] = [];
  const [lmin, lmax] = o.len;
  const [cmin, cmax] = o.curve ?? [0.2, 0.7];
  for (let i = 0; i < o.count; i++) {
    const x = o.x0 + rand() * (o.x1 - o.x0);
    const y = o.y0 + rand() * (o.y1 - o.y0);
    const a = o.angle ? o.angle(x, y) : rand() * Math.PI * 2;
    parts.push(comma(x, y, lmin + rand() * (lmax - lmin), a, cmin + rand() * (cmax - cmin)));
  }
  return joinD(parts);
}

/**
 * Streamlines through a turbulent field — the long, curling strokes that make a
 * sky read as "painted" rather than "gradient".
 *
 * `bias` and `range` are what keep it from becoming spaghetti: the field angle
 * is a *deviation* from a base direction rather than a full rotation, so a sky
 * sweeps horizontally and curls, instead of wandering in every direction at once.
 */
export function flowLines(
  seed: number,
  rand: Rng,
  o: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    count: number;
    steps?: number;
    step?: number;
    scale?: number;
    /** Base direction in radians (0 = left to right). */
    bias?: number;
    /** Total angular spread around the bias. */
    range?: number;
    /** Vertical compression of each step — flattens the sweep. */
    squash?: number;
  },
): string {
  const fbm = makeFbm(seed, 3);
  const steps = o.steps ?? 16;
  const step = o.step ?? 7;
  const scale = o.scale ?? 0.02;
  const bias = o.bias ?? 0;
  const range = o.range ?? Math.PI * 4;
  const squash = o.squash ?? 0.6;
  const parts: string[] = [];
  for (let i = 0; i < o.count; i++) {
    let x = o.x0 + rand() * (o.x1 - o.x0);
    let y = o.y0 + rand() * (o.y1 - o.y0);
    const pts: Pt[] = [[x, y]];
    for (let s = 0; s < steps; s++) {
      const a = bias + (fbm(x * scale, y * scale) - 0.5) * range;
      x += Math.cos(a) * step;
      y += Math.sin(a) * step * squash;
      pts.push([x, y]);
    }
    parts.push(smoothPath(pts));
  }
  return joinD(parts);
}

/** Horizontal broken bands — water reflections, fields, plaster walls. */
export function bands(
  rand: Rng,
  o: { x0: number; x1: number; y0: number; y1: number; rows: number; per: number; len: [number, number]; h?: number },
): string {
  const parts: string[] = [];
  for (let r = 0; r < o.rows; r++) {
    const y = o.y0 + ((o.y1 - o.y0) * r) / Math.max(1, o.rows - 1);
    for (let i = 0; i < o.per; i++) {
      const w = o.len[0] + rand() * (o.len[1] - o.len[0]);
      const x = o.x0 + rand() * (o.x1 - o.x0 - w);
      const yy = y + (rand() - 0.5) * 3;
      parts.push(`M${x.toFixed(1)},${yy.toFixed(1)} h${w.toFixed(1)}`);
    }
  }
  return joinD(parts);
}
