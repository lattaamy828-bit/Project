import type { ReactNode } from 'react';
import type { Rng } from './rng';

/** Ambient colours a painting pushes into the surrounding UI when it is focused. */
export interface ArtPalette {
  bg: string;
  deep: string;
  glow: string;
}

export interface PaintingSpec {
  id: string;
  /** Title of the work this generated canvas takes its cue from. */
  title: string;
  artist: string;
  year: string;
  /** Intrinsic aspect of the generated canvas. */
  w: number;
  h: number;
  palette: ArtPalette;
  /** Museum wall-label text (fictional curation for this demo). */
  note: string;
  render: (r: Rng) => ReactNode;
}
