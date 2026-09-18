/**
 * Deterministic pseudo-randomness for the painting generators.
 *
 * Every painting on the site is drawn from code rather than loaded as a bitmap,
 * so the geometry has to be stable: the same seed must yield the same canvas on
 * every render, on every device, forever. mulberry32 is small, fast and has
 * more than enough quality for brush scatter.
 */

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash so painting ids can seed the generators directly. */
export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rngFor(id: string): Rng {
  return mulberry32(hashSeed(id));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const round = (v: number, p = 2) => Number(v.toFixed(p));

/** Smooth 2D value noise — drives the swirling flow fields of the skies. */
export function makeNoise2D(seed: number) {
  const rand = mulberry32(seed);
  const size = 256;
  const table = new Float32Array(size * size);
  for (let i = 0; i < table.length; i++) table[i] = rand();
  const fade = (t: number) => t * t * (3 - 2 * t);
  const at = (x: number, y: number) => table[(((y & 255) << 8) | (x & 255)) >>> 0];

  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = fade(x - xi);
    const yf = fade(y - yi);
    const a = lerp(at(xi, yi), at(xi + 1, yi), xf);
    const b = lerp(at(xi, yi + 1), at(xi + 1, yi + 1), xf);
    return lerp(a, b, yf);
  };
}

/** Fractal sum of the noise above — richer turbulence for skies and water. */
export function makeFbm(seed: number, octaves = 3) {
  const n = makeNoise2D(seed);
  return (x: number, y: number) => {
    let amp = 0.5;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o++) {
      sum += n(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.07;
    }
    return sum / norm;
  };
}
