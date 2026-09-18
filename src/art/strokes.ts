/**
 * Brush-stroke geometry.
 *
 * These helpers turn point lists into the tapered, slightly wobbly paths that
 * give the generated paintings their impasto feel. Everything returns plain SVG
 * path strings so the output can be animated with stroke-dasharray, used as a
 * mask, or handed to a <textPath>.
 */

import { round, type Rng } from './rng';

export type Pt = [number, number];

/** Catmull-Rom through the points, converted to cubic beziers. */
export function smoothPath(pts: Pt[], closed = false, tension = 1): string {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${round(p[1][0])},${round(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    const c1x = x1 + ((x2 - x0) / 6) * tension;
    const c1y = y1 + ((y2 - y0) / 6) * tension;
    const c2x = x2 - ((x3 - x1) / 6) * tension;
    const c2y = y2 - ((y3 - y1) / 6) * tension;
    d += ` C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(x2)},${round(y2)}`;
  }
  return closed ? `${d}Z` : d;
}

/** Points along a spiral — the backbone of every Van Gogh-style sky swirl. */
export function spiral(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  turns: number,
  steps = 60,
  phase = 0,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = phase + t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.78]);
  }
  return out;
}

/** A single comma-shaped dab: the unit of a Van Gogh sky. */
export function comma(x: number, y: number, len: number, angle: number, curve = 0.5): string {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const ex = x + dx * len;
  const ey = y + dy * len;
  return `M${round(x)},${round(y)} Q${round(x + dx * len * 0.5 + nx * len * curve)},${round(
    y + dy * len * 0.5 + ny * len * curve,
  )} ${round(ex)},${round(ey)}`;
}

/** Ragged wobble applied along a straight run — a hand-dragged brush. */
export function drag(x0: number, y0: number, x1: number, y1: number, rand: Rng, jitter = 3, steps = 8): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = Math.sin(t * Math.PI); // no wobble at the tips
    pts.push([x0 + (x1 - x0) * t + (rand() - 0.5) * jitter * w, y0 + (y1 - y0) * t + (rand() - 0.5) * jitter * w]);
  }
  return smoothPath(pts);
}

/** Closed organic blob — petals, foliage clumps, cloud masses. */
export function blob(cx: number, cy: number, r: number, rand: Rng, lobes = 9, wobble = 0.3): string {
  const pts: Pt[] = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2;
    const rr = r * (1 - wobble / 2 + rand() * wobble);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothPath(pts, true);
}

/** Teardrop petal pointing along `angle`. */
export function petal(cx: number, cy: number, len: number, width: number, angle: number): string {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy * width;
  const ny = dx * width;
  const tx = cx + dx * len;
  const ty = cy + dy * len;
  const mx = cx + dx * len * 0.45;
  const my = cy + dy * len * 0.45;
  return (
    `M${round(cx)},${round(cy)} C${round(mx + nx)},${round(my + ny)} ${round(tx + nx * 0.25)},${round(
      ty + ny * 0.25,
    )} ${round(tx)},${round(ty)}` +
    ` C${round(tx - nx * 0.25)},${round(ty - ny * 0.25)} ${round(mx - nx)},${round(my - ny)} ${round(cx)},${round(cy)}Z`
  );
}

/** Cypress / poplar flame silhouette. */
export function cypress(x: number, baseY: number, h: number, w: number, rand: Rng): string {
  const left: Pt[] = [];
  const right: Pt[] = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = baseY - h * t;
    const taper = Math.pow(1 - t, 0.72);
    const jag = (rand() - 0.5) * w * 0.55 * (1 - t * 0.4);
    left.push([x - w * taper + jag, y]);
    right.push([x + w * taper + jag, y]);
  }
  return smoothPath([...left, ...right.reverse()], true, 0.9);
}

/**
 * Thrown-paint silhouette.
 *
 * Spiky alternating radii read as a cartoon starburst, so the body stays nearly
 * round and only a few points pull out into arms — which is how a splash of
 * paint actually lands.
 */
export function splash(cx: number, cy: number, r: number, rand: Rng, steps = 26): string {
  const pts: Pt[] = [];
  const arms = new Set<number>();
  const armCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < armCount; i++) arms.add(Math.floor(rand() * steps));

  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const base = r * (0.86 + rand() * 0.2);
    const rr = arms.has(i) ? base * (1.3 + rand() * 0.5) : base;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothPath(pts, true, 0.9);
}

/** Small satellite droplets thrown clear of a splash. */
export function droplets(cx: number, cy: number, r: number, rand: Rng, count = 7): string {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const d = r * (1.15 + rand() * 0.75);
    const rr = r * (0.04 + rand() * 0.09);
    parts.push(blob(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.9, rr, rand, 7, 0.4));
  }
  return parts.join(' ');
}
