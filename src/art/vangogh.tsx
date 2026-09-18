/**
 * Van Gogh-inspired canvases, drawn from code.
 *
 * These are original generative interpretations — swirl fields, impasto dabs and
 * flame-shaped cypresses in the spirit of the works they are named after, not
 * reproductions. Each returns SVG children sized to the spec's w/h viewBox.
 */

import type { PaintingSpec } from './types';
import { dabField, flowLines, joinD, bands } from './helpers';
import { blob, comma, cypress, drag, petal, smoothPath, spiral, type Pt } from './strokes';
import type { Rng } from './rng';

/* ------------------------------------------------------------------ */
/* The Starry Night                                                    */
/* ------------------------------------------------------------------ */

function starryNight(r: Rng) {
  // Three passes of one flow field — dark ground, mid body, light crest — is what
  // separates "brushwork" from "blue tubes". Each pass is thin and numerous.
  const sky = { x0: -30, y0: -20, x1: 430, y1: 200, steps: 9, step: 11, scale: 0.012, bias: 0, range: 3.1, squash: 0.85 };
  const flowA = flowLines(7, r, { ...sky, count: 120 });
  const flowB = flowLines(7, r, { ...sky, count: 96 });
  const flowC = flowLines(23, r, { ...sky, count: 70, steps: 7, step: 12, range: 2.6 });

  const swirlBand = (cx: number, cy: number, r0: number, r1: number, turns: number, phase: number, n: number) =>
    joinD(Array.from({ length: n }, (_, i) => smoothPath(spiral(cx, cy, r0 + i * 2.6, r1 + i * 3.4, turns, 78, phase + i * 0.14))));

  const bigSwirl = swirlBand(172, 96, 4, 40, 2.45, 0.3, 5);
  const bigSwirlLit = swirlBand(172, 96, 6, 43, 2.45, 0.42, 3);
  const smallSwirl = swirlBand(238, 126, 3, 28, 2.2, 2.3, 4);

  const stars = [
    [46, 52, 8], [110, 32, 6], [152, 74, 5], [214, 44, 7],
    [268, 92, 5], [302, 38, 6], [86, 120, 4], [196, 140, 4], [336, 134, 5],
  ] as const;

  // Village: many small houses low on the horizon, not a mountain range.
  const roof: Pt[] = [[-10, 244]];
  let x = -6;
  while (x < 412) {
    const w = 8 + r() * 13;
    const h = 4 + r() * 8;
    roof.push([x, 244 - h * 0.35], [x + w * 0.5, 244 - h], [x + w, 244 - h * 0.3]);
    x += w + 1 + r() * 4;
  }
  roof.push([412, 246], [412, 300], [-10, 300]);

  const windows = Array.from({ length: 52 }, () => [-4 + r() * 408, 236 + r() * 24, 0.8 + r() * 1.2] as const);
  const hills = smoothPath(
    [[-10, 216], [64, 200], [138, 212], [212, 196], [286, 210], [356, 194], [412, 206], [412, 252], [-10, 252]],
    true,
  );

  return (
    <>
      <defs>
        <radialGradient id="sn-sky" cx="56%" cy="28%" r="92%">
          <stop offset="0%" stopColor="#23579f" />
          <stop offset="46%" stopColor="#122e66" />
          <stop offset="100%" stopColor="#060d28" />
        </radialGradient>
        <radialGradient id="sn-halo">
          <stop offset="0%" stopColor="#fff3cd" stopOpacity="0.95" />
          <stop offset="34%" stopColor="#e3b23c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e3b23c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill="url(#sn-sky)" />

      {/* Sky, built up in thin layered passes */}
      <path d={flowA} fill="none" stroke="#0e2356" strokeOpacity="0.85" strokeWidth="3.6" strokeLinecap="round" />
      <path d={flowA} fill="none" stroke="#2a5fd7" strokeOpacity="0.5" strokeWidth="1.9" strokeLinecap="round" />
      <path d={flowB} fill="none" stroke="#4a7fe0" strokeOpacity="0.4" strokeWidth="1.3" strokeLinecap="round" />
      <path d={flowC} fill="none" stroke="#9dc0f7" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />

      <path d={bigSwirl} fill="none" stroke="#5d90ea" strokeOpacity="0.4" strokeWidth="1.7" strokeLinecap="round" />
      <path d={bigSwirlLit} fill="none" stroke="#d6e6ff" strokeOpacity="0.34" strokeWidth="1.1" strokeLinecap="round" />
      <path d={smallSwirl} fill="none" stroke="#a9c8fb" strokeOpacity="0.3" strokeWidth="1.3" strokeLinecap="round" />

      {/* A little warmth scattered through the cold */}
      <path
        d={dabField(r, { x0: -10, y0: -10, x1: 410, y1: 190, count: 54, len: [2, 5], angle: () => r() * 6.28 })}
        fill="none" stroke="#e3b23c" strokeOpacity="0.1" strokeWidth="0.9" strokeLinecap="round"
      />

      {stars.map(([sx, sy, sr], i) => (
        <g key={i}>
          <circle cx={sx} cy={sy} r={sr * 2.8} fill="url(#sn-halo)" />
          <path
            d={joinD(Array.from({ length: 9 }, (_, k) => comma(sx, sy, sr * 1.5, (k / 9) * Math.PI * 2 + i, 0.45)))}
            fill="none" stroke="#f2c14e" strokeOpacity="0.4" strokeWidth="0.8" strokeLinecap="round"
          />
          <circle cx={sx} cy={sy} r={sr * 0.42} fill="#fff6d8" />
        </g>
      ))}

      <circle cx="352" cy="54" r="38" fill="url(#sn-halo)" />
      <path d="M352,30 a24,24 0 1,0 0,48 a19,19 0 1,1 0,-48Z" fill="#ffe9a8" />
      <path d="M352,34 a20,20 0 1,0 0,40 a16,16 0 1,1 0,-40Z" fill="#fff6d8" opacity="0.6" />

      {/* Hills */}
      <path d={hills} fill="#0c2148" />
      <path
        d={dabField(r, { x0: -10, y0: 192, x1: 410, y1: 252, count: 120, len: [4, 11], angle: () => -0.12 + (r() - 0.5) * 0.3 })}
        fill="none" stroke="#17356e" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"
      />
      <path
        d={dabField(r, { x0: -10, y0: 194, x1: 410, y1: 240, count: 46, len: [4, 10], angle: () => -0.1 })}
        fill="none" stroke="#3a6aa8" strokeOpacity="0.3" strokeWidth="1.1" strokeLinecap="round"
      />

      {/* Village and church spire */}
      <path d={smoothPath(roof, true, 0.35)} fill="#071228" />
      <path d="M198,244 L198,182 L203,166 L208,182 L208,244Z" fill="#071228" />
      <path d="M203,154 L206,168 L200,168Z" fill="#071228" />
      {windows.map(([wx, wy, wr], i) => (
        <circle key={i} cx={wx} cy={wy} r={wr} fill="#f2c14e" opacity={0.45 + r() * 0.5} />
      ))}
      <path
        d={dabField(r, { x0: -10, y0: 246, x1: 410, y1: 302, count: 90, len: [4, 12], angle: () => (r() - 0.5) * 0.5 })}
        fill="none" stroke="#0f1f3e" strokeOpacity="0.8" strokeWidth="2.2" strokeLinecap="round"
      />

      {/* The cypress: dark flame, then fine strokes climbing it */}
      <path d={cypress(52, 306, 272, 28, r)} fill="#0c1b0c" />
      <path d={cypress(49, 300, 244, 20, r)} fill="#17300f" opacity="0.94" />
      <path
        d={dabField(r, { x0: 26, y0: 50, x1: 78, y1: 300, count: 130, len: [4, 12], angle: () => -Math.PI / 2 + (r() - 0.5) * 0.55 })}
        fill="none" stroke="#2c5320" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d={dabField(r, { x0: 32, y0: 70, x1: 70, y1: 290, count: 44, len: [3, 9], angle: () => -Math.PI / 2 + (r() - 0.5) * 0.5 })}
        fill="none" stroke="#4d7534" strokeOpacity="0.3" strokeWidth="0.9" strokeLinecap="round"
      />
      <path d={cypress(380, 302, 116, 14, r)} fill="#10240e" opacity="0.92" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sunflowers                                                          */
/* ------------------------------------------------------------------ */

function sunflowers(r: Rng) {
  const heads = [
    [92, 108, 34, 0], [166, 88, 30, 0.4], [224, 126, 27, 1.1], [58, 168, 26, 2.0],
    [142, 152, 31, 0.8], [206, 196, 24, 1.6], [96, 212, 23, 2.6], [172, 236, 20, 0.2],
    [242, 168, 18, 1.3], [40, 116, 19, 2.2],
  ] as const;

  const petalsFor = (cx: number, cy: number, rad: number, phase: number, count: number) =>
    joinD(
      Array.from({ length: count }, (_, i) => {
        const a = phase + (i / count) * Math.PI * 2 + (r() - 0.5) * 0.16;
        const len = rad * (0.95 + r() * 0.55);
        return petal(cx + Math.cos(a) * rad * 0.34, cy + Math.sin(a) * rad * 0.34, len, rad * 0.2, a);
      }),
    );

  return (
    <>
      <defs>
        <linearGradient id="sf-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2c884" />
          <stop offset="62%" stopColor="#cfae63" />
          <stop offset="100%" stopColor="#b08f47" />
        </linearGradient>
        <radialGradient id="sf-petal">
          <stop offset="0%" stopColor="#f7dd9b" />
          <stop offset="70%" stopColor="#e3b23c" />
          <stop offset="100%" stopColor="#c0902a" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill="url(#sf-wall)" />
      <path d={flowLines(41, r, { x0: 0, y0: 0, x1: 300, y1: 306, count: 80, steps: 8, step: 10, scale: 0.015, range: 2.8, squash: 0.9 })}
        fill="none" stroke="#e7d49a" strokeOpacity="0.4" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M-5,300 L305,286 L305,410 L-5,410Z" fill="#a9853f" />
      <path d={bands(r, { x0: -5, x1: 305, y0: 292, y1: 400, rows: 9, per: 10, len: [24, 80] })}
        fill="none" stroke="#8c6b31" strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round" />

      {/* Stems, drawn before the vase so they emerge from behind its lip. */}
      {heads.map(([hx, hy], i) => (
        <path key={`s${i}`} d={drag(hx, hy, 150 + (hx - 150) * 0.16, 306, r, 6, 7)} fill="none"
          stroke="#6b7a4b" strokeOpacity="0.95" strokeWidth={3 + r() * 2} strokeLinecap="round" />
      ))}

      {heads.map(([hx, hy, hr, ph], i) => (
        <g key={i}>
          <path d={petalsFor(hx, hy, hr, ph, 13)} fill="url(#sf-petal)" stroke="#a9772099" strokeWidth="0.7" />
          <path d={petalsFor(hx, hy, hr * 0.66, ph + 0.35, 9)} fill="#f2c14e" opacity="0.85" />
          <circle cx={hx} cy={hy} r={hr * 0.36} fill={i % 3 === 0 ? '#7b4f22' : '#5e3a18'} />
          <path d={dabField(r, { x0: hx - hr * 0.34, y0: hy - hr * 0.34, x1: hx + hr * 0.34, y1: hy + hr * 0.34, count: 14, len: [1.5, 3.5] })}
            fill="none" stroke="#3a2415" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}

      {/* Earthenware vase */}
      <path d="M104,300 C100,332 104,360 112,382 L188,382 C196,360 200,332 196,300 Z" fill="#e8dcae" />
      <path d="M104,300 C100,332 104,360 112,382 L142,382 C136,352 134,326 138,300Z" fill="#f3ecc9" opacity="0.7" />
      <path d="M100,298 q50,-10 100,0 q-50,12 -100,0Z" fill="#d7c893" />
      <path d="M102,334 q48,9 96,0" fill="none" stroke="#b9a05c" strokeWidth="5" strokeLinecap="round" />
      <path d="M186,306 C192,334 190,360 182,380" fill="none" stroke="#b9a05c" strokeOpacity="0.6" strokeWidth="4" />
      <text x="150" y="366" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#8c6b31" opacity="0.75">
        Étoile
      </text>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Irises                                                              */
/* ------------------------------------------------------------------ */

function irises(r: Rng) {
  const leaves = joinD(
    Array.from({ length: 34 }, () => {
      const bx = 10 + r() * 380;
      const h = 90 + r() * 130;
      const sway = (r() - 0.5) * 90;
      return smoothPath([[bx, 300], [bx + sway * 0.3, 300 - h * 0.45], [bx + sway * 0.8, 300 - h * 0.82], [bx + sway, 300 - h]]);
    }),
  );

  const blooms = Array.from({ length: 11 }, (_, i) => {
    const bx = 24 + (i * 356) / 10 + (r() - 0.5) * 22;
    const by = 138 + r() * 92;
    return { x: bx, y: by, s: 0.8 + r() * 0.45, white: i === 4 };
  });

  return (
    <>
      <defs>
        <linearGradient id="ir-earth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c07a3c" />
          <stop offset="100%" stopColor="#8d4d22" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ir-earth)" />
      <path d="M-5,-5 H405 V96 q-100,18 -200,2 T-5,86Z" fill="#7d8f4e" />
      <path d={dabField(r, { x0: -5, y0: 0, x1: 405, y1: 104, count: 90, len: [5, 15], angle: () => -0.3 + r() * 0.6 })}
        fill="none" stroke="#9aa95f" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <path d={dabField(r, { x0: -5, y0: 88, x1: 405, y1: 300, count: 150, len: [5, 16], angle: () => 0.1 + r() * 0.5 })}
        fill="none" stroke="#b9713a" strokeOpacity="0.55" strokeWidth="3.4" strokeLinecap="round" />

      <path d={leaves} fill="none" stroke="#2f5a2b" strokeOpacity="0.95" strokeWidth="7" strokeLinecap="round" />
      <path d={leaves} fill="none" stroke="#5c8a3e" strokeOpacity="0.6" strokeWidth="2.4" strokeLinecap="round" />

      {blooms.map((b, i) => {
        const base = b.white ? '#f1ead6' : '#3f327f';
        const hi = b.white ? '#ffffff' : '#6c5cc0';
        const s = b.s;
        return (
          <g key={i} transform={`translate(${b.x} ${b.y}) scale(${s})`}>
            <path d={petal(0, 0, 26, 9, -1.9)} fill={base} />
            <path d={petal(0, 0, 22, 8, -1.2)} fill={hi} opacity="0.9" />
            <path d={petal(0, 0, 23, 8, -2.6)} fill={hi} opacity="0.75" />
            <path d={petal(0, 2, 24, 10, 0.9)} fill={base} opacity="0.95" />
            <path d={petal(0, 2, 21, 9, 2.3)} fill={base} opacity="0.85" />
            <path d={blob(0, 0, 5, r, 7, 0.4)} fill="#e3b23c" opacity={b.white ? 0.9 : 0.75} />
          </g>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Café Terrace at Night                                               */
/* ------------------------------------------------------------------ */

function cafeTerrace(r: Rng) {
  const cobbles = dabField(r, { x0: -10, y0: 210, x1: 410, y1: 310, count: 190, len: [3, 9], angle: () => r() * Math.PI });
  const stars = Array.from({ length: 26 }, () => [30 + r() * 360, 8 + r() * 110, 1 + r() * 2.6] as const);

  return (
    <>
      <defs>
        <linearGradient id="ct-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1c52" />
          <stop offset="100%" stopColor="#1d3f8d" />
        </linearGradient>
        <radialGradient id="ct-lamp" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e3b23c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill="url(#ct-sky)" />
      <path d={flowLines(5, r, { x0: -10, y0: -10, x1: 410, y1: 146, count: 60, steps: 8, step: 11, scale: 0.014, range: 2.6, squash: 0.8 })}
        fill="none" stroke="#3b64c4" strokeOpacity="0.38" strokeWidth="1.8" strokeLinecap="round" />
      {stars.map(([sx, sy, sr], i) => (
        <circle key={i} cx={sx} cy={sy} r={sr} fill="#ffeec2" opacity={0.45 + r() * 0.55} />
      ))}

      {/* Street receding to the right, buildings in deep blue */}
      <path d="M236,300 L262,96 L400,62 L400,300Z" fill="#12265c" />
      <path d="M-10,300 L-10,20 L60,26 L74,300Z" fill="#0d1c46" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={272 + (i % 4) * 32} y={96 + Math.floor(i / 4) * 44} width="17" height="26" rx="2"
          fill={i % 3 === 0 ? '#f2c14e' : '#1b3a8c'} opacity={i % 3 === 0 ? 0.8 : 0.9} />
      ))}

      {/* Terrace floor washed in lamplight */}
      <path d="M-10,214 L250,196 L262,300 L-10,300Z" fill="#c9962f" />
      <ellipse cx="120" cy="250" rx="180" ry="86" fill="url(#ct-lamp)" opacity="0.7" />
      <path d={cobbles} fill="none" stroke="#7c5a1c" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" />

      {/* The awning — a shallow sweep, not a wall */}
      <path d="M-14,128 C54,110 128,106 196,122 L192,146 C128,130 54,134 -14,154Z" fill="#e8b53e" />
      <path d="M-14,128 C54,110 128,106 196,122 L195,129 C130,114 54,118 -14,136Z" fill="#f7dd9b" opacity="0.85" />
      <path d={bands(r, { x0: -14, x1: 196, y0: 130, y1: 150, rows: 3, per: 8, len: [14, 36] })}
        fill="none" stroke="#c0902a" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <path d="M-8,150 L-8,222 M92,140 L92,214 M188,146 L188,206" stroke="#8c6b31" strokeOpacity="0.8" strokeWidth="2.4" />

      {/* Café front and tables */}
      <rect x="-10" y="150" width="150" height="58" fill="#d9a634" opacity="0.35" />
      <path d={dabField(r, { x0: -10, y0: 150, x1: 150, y1: 210, count: 40, len: [4, 11], angle: () => -1.4 + r() * 0.5 })}
        fill="none" stroke="#f0cf6e" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
      {[[40, 236, 17], [104, 226, 15], [166, 216, 13], [214, 208, 11]].map(([tx, ty, tr], i) => (
        <g key={i}>
          <ellipse cx={tx} cy={ty} rx={tr} ry={tr * 0.42} fill="#f3e2b4" />
          <ellipse cx={tx} cy={ty + 2} rx={tr} ry={tr * 0.4} fill="#b98c2c" opacity="0.5" />
          <path d={`M${tx},${ty} v${tr * 0.9}`} stroke="#6b4423" strokeWidth="2.4" />
        </g>
      ))}
      {[[22, 224, 15], [70, 218, 14], [130, 210, 12], [186, 202, 10], [246, 194, 9]].map(([fx, fy, fh], i) => (
        <g key={i} opacity="0.88">
          <ellipse cx={fx} cy={fy - fh} rx={fh * 0.34} ry={fh * 0.38} fill="#2a1a10" />
          <path d={`M${fx - fh * 0.5},${fy + fh * 0.5} C${fx - fh * 0.4},${fy - fh * 0.7} ${fx + fh * 0.4},${fy - fh * 0.7} ${fx + fh * 0.5},${fy + fh * 0.5}Z`} fill="#22160d" />
        </g>
      ))}
      <path d={dabField(r, { x0: 250, y0: 120, x1: 300, y1: 240, count: 30, len: [4, 11], angle: () => -1.4 })}
        fill="none" stroke="#2f5623" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Wheatfield with Cypresses                                           */
/* ------------------------------------------------------------------ */

function wheatfield(r: Rng) {
  return (
    <>
      <defs>
        <linearGradient id="wf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fa8dc" />
          <stop offset="100%" stopColor="#cfe0ef" />
        </linearGradient>
        <linearGradient id="wf-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7b356" />
          <stop offset="100%" stopColor="#b98c2c" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wf-sky)" />
      <path d={flowLines(97, r, { x0: -20, y0: -10, x1: 420, y1: 156, count: 90, steps: 9, step: 12, scale: 0.013, range: 2.4, squash: 0.8 })}
        fill="none" stroke="#ffffff" strokeOpacity="0.62" strokeWidth="3.6" strokeLinecap="round" />
      <path d={flowLines(97, r, { x0: -20, y0: -10, x1: 420, y1: 156, count: 66, steps: 8, step: 12, scale: 0.013, range: 2.4, squash: 0.8 })}
        fill="none" stroke="#5f86bd" strokeOpacity="0.38" strokeWidth="1.8" strokeLinecap="round" />
      <path d={flowLines(53, r, { x0: -20, y0: -10, x1: 420, y1: 150, count: 44, steps: 7, step: 11, scale: 0.016, range: 2 })}
        fill="none" stroke="#f7fbff" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" />
      <path d={joinD([0, 1, 2, 3].map((i) => smoothPath(spiral(96, 62, 4 + i * 2.2, 26 + i * 3, 2.1, 60, 1.2 + i * 0.16))))}
        fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" />
      <path d={joinD([0, 1, 2].map((i) => smoothPath(spiral(276, 48, 4 + i * 2.4, 22 + i * 3, 2, 56, 0.2 + i * 0.2))))}
        fill="none" stroke="#f7fbff" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />

      {/* Distant range */}
      <path d={smoothPath([[-10, 168], [56, 148], [126, 162], [196, 140], [268, 158], [340, 142], [410, 156], [410, 200], [-10, 200]], true)} fill="#6d7fa8" />
      <path d={dabField(r, { x0: -10, y0: 138, x1: 410, y1: 186, count: 80, len: [4, 12], angle: () => -0.2 })}
        fill="none" stroke="#4e5f86" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />

      {/* Olive scrub */}
      <path d={joinD(Array.from({ length: 16 }, () => blob(20 + r() * 370, 176 + r() * 22, 8 + r() * 12, r, 8, 0.45)))}
        fill="#5f7340" opacity="0.9" />

      <rect y="186" width="400" height="120" fill="url(#wf-field)" />
      <path d={dabField(r, { x0: -10, y0: 182, x1: 410, y1: 306, count: 320, len: [5, 16], angle: () => -1.2 + r() * 0.8, curve: [0.1, 0.4] })}
        fill="none" stroke="#f0cf6e" strokeOpacity="0.75" strokeWidth="2.6" strokeLinecap="round" />
      <path d={dabField(r, { x0: -10, y0: 196, x1: 410, y1: 306, count: 200, len: [6, 18], angle: () => -1.35 + r() * 0.7 })}
        fill="none" stroke="#8c6b31" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round" />
      <path d={dabField(r, { x0: -10, y0: 214, x1: 410, y1: 306, count: 110, len: [5, 13], angle: () => -1.3 + r() * 0.6 })}
        fill="none" stroke="#6b7a4b" strokeOpacity="0.6" strokeWidth="2.4" strokeLinecap="round" />

      <path d={cypress(316, 304, 250, 30, r)} fill="#1b3212" />
      <path d={cypress(348, 300, 190, 22, r)} fill="#24401a" />
      <path d={dabField(r, { x0: 290, y0: 60, x1: 372, y1: 300, count: 90, len: [5, 14], angle: () => -Math.PI / 2 + (r() - 0.5) * 0.7 })}
        fill="none" stroke="#3c6327" strokeOpacity="0.75" strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Almond Blossom                                                      */
/* ------------------------------------------------------------------ */

function almondBlossom(r: Rng) {
  const branches: string[] = [];
  const blossomPts: Array<[number, number, number]> = [];

  const grow = (x: number, y: number, ang: number, len: number, depth: number, w: number) => {
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    branches.push(`${drag(x, y, ex, ey, r, len * 0.16, 5)}|${w}`);
    if (depth <= 0) {
      blossomPts.push([ex, ey, 0.7 + r() * 0.6]);
      return;
    }
    if (r() > 0.45) blossomPts.push([x + Math.cos(ang) * len * 0.6, y + Math.sin(ang) * len * 0.6, 0.6 + r() * 0.5]);
    grow(ex, ey, ang - 0.28 - r() * 0.5, len * (0.62 + r() * 0.2), depth - 1, w * 0.62);
    grow(ex, ey, ang + 0.28 + r() * 0.5, len * (0.62 + r() * 0.2), depth - 1, w * 0.62);
  };

  grow(-8, 262, -0.5, 92, 4, 11);
  grow(-8, 150, 0.12, 86, 4, 9);
  grow(408, 268, Math.PI + 0.5, 84, 4, 10);
  grow(408, 96, Math.PI - 0.1, 78, 4, 8);

  const blossom = (bx: number, by: number, s: number, key: number) => (
    <g key={key} transform={`translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${s.toFixed(2)})`}>
      <path d={joinD(Array.from({ length: 5 }, (_, i) => petal(0, 0, 9, 3.6, (i / 5) * Math.PI * 2 + r() * 0.3)))}
        fill="#fdf6ee" stroke="#e8c9c9" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="2.2" fill="#e3b23c" />
      <path d={joinD(Array.from({ length: 5 }, (_, i) => comma(0, 0, 5, (i / 5) * Math.PI * 2 + 0.4, 0.2)))}
        fill="none" stroke="#c9a05c" strokeWidth="0.7" />
    </g>
  );

  return (
    <>
      <defs>
        <linearGradient id="ab-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ecfda" />
          <stop offset="100%" stopColor="#4ba3b4" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ab-sky)" />
      <path d={flowLines(61, r, { x0: -10, y0: -10, x1: 410, y1: 310, count: 90, steps: 8, step: 12, scale: 0.012, range: 2.4, squash: 0.85 })}
        fill="none" stroke="#a8e2e8" strokeOpacity="0.34" strokeWidth="2.2" strokeLinecap="round" />
      {branches.map((b, i) => {
        const [d, w] = b.split('|');
        return <path key={i} d={d} fill="none" stroke="#5b3a1c" strokeWidth={Number(w)} strokeLinecap="round" />;
      })}
      {branches.map((b, i) => {
        const [d, w] = b.split('|');
        return <path key={`h${i}`} d={d} fill="none" stroke="#8a6032" strokeOpacity="0.65" strokeWidth={Number(w) * 0.4} strokeLinecap="round" />;
      })}
      {blossomPts.map((p, i) => blossom(p[0], p[1], p[2], i))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The Bedroom                                                         */
/* ------------------------------------------------------------------ */

function bedroom(r: Rng) {
  return (
    <>
      <rect width="400" height="300" fill="#8fb0bf" />
      {/* Walls in receding perspective */}
      <path d="M0,0 L74,46 L74,232 L0,300Z" fill="#7ea3b6" />
      <path d="M400,0 L318,46 L318,232 L400,300Z" fill="#9dbccb" />
      <rect x="74" y="46" width="244" height="186" fill="#a7c4cf" />
      <path d="M0,300 L74,232 L318,232 L400,300Z" fill="#a9803f" />
      <path d={bands(r, { x0: 0, x1: 400, y0: 238, y1: 298, rows: 8, per: 12, len: [30, 110] })}
        fill="none" stroke="#8a6330" strokeOpacity="0.55" strokeWidth="3.4" strokeLinecap="round" />

      {/* Window with shutters */}
      <rect x="150" y="66" width="76" height="86" rx="2" fill="#cfe4e4" stroke="#6b7a4b" strokeWidth="5" />
      <path d="M188,66 V152 M150,110 H226" stroke="#6b7a4b" strokeWidth="4" />
      <rect x="126" y="62" width="22" height="94" fill="#5f7340" />
      <rect x="228" y="62" width="22" height="94" fill="#6b7a4b" />

      {/* Framed pictures — the boutique's own canvases on the wall */}
      <rect x="262" y="70" width="42" height="34" fill="#e3b23c" stroke="#8c6b31" strokeWidth="3" />
      <rect x="262" y="116" width="42" height="34" fill="#2a5fd7" stroke="#8c6b31" strokeWidth="3" />
      <rect x="86" y="72" width="34" height="46" fill="#c9784a" stroke="#8c6b31" strokeWidth="3" />

      {/* Bed */}
      <path d="M96,300 L96,182 L268,158 L268,262Z" fill="#c8a22f" />
      <path d="M96,182 L268,158 L268,176 L96,202Z" fill="#e3b23c" />
      <path d="M110,214 L268,182 L268,244 L112,286Z" fill="#b5482f" />
      <path d={dabField(r, { x0: 112, y0: 186, x1: 268, y1: 284, count: 70, len: [6, 16], angle: () => -0.24 })}
        fill="none" stroke="#8e3220" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      <path d="M108,206 L176,196 L178,222 L110,236Z" fill="#f1e7cd" />
      <path d="M118,192 L182,184 L184,204 L120,214Z" fill="#fbf6ec" />

      {/* Chair and table */}
      <path d="M40,300 L46,222 L88,214 L84,292Z" fill="#c8a22f" opacity="0.95" />
      <path d="M46,222 L88,214 L88,204 L46,212Z" fill="#e3b23c" />
      <path d="M294,300 L300,214 L360,206 L354,300Z" fill="#b99a4f" />
      <ellipse cx="326" cy="204" rx="34" ry="9" fill="#d7c893" />
      <circle cx="316" cy="198" r="7" fill="#f2c14e" />
      <rect x="332" y="188" width="9" height="14" rx="3" fill="#6b7a4b" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Self-Portrait                                                       */
/* ------------------------------------------------------------------ */

function selfPortrait(r: Rng) {
  return (
    <>
      <defs>
        <radialGradient id="sp-bg" cx="50%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#7fb3b6" />
          <stop offset="100%" stopColor="#2f5f68" />
        </radialGradient>
        <linearGradient id="sp-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2b381" />
          <stop offset="100%" stopColor="#b57c48" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#sp-bg)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={smoothPath(spiral(150 + (i - 2) * 58, 90 + (i % 2) * 70, 4, 34 + i * 6, 2.2, 56, i * 1.3))}
          fill="none" stroke="#bfe3e0" strokeOpacity="0.4" strokeWidth="3.4" strokeLinecap="round" />
      ))}
      <path d={flowLines(3, r, { x0: -10, y0: -10, x1: 310, y1: 410, count: 96, steps: 8, step: 10, scale: 0.014, range: 2.8, squash: 0.9 })}
        fill="none" stroke="#83c3c4" strokeOpacity="0.38" strokeWidth="1.9" strokeLinecap="round" />

      {/* Shoulders and jacket */}
      <path d="M22,400 C36,320 84,290 130,282 L176,282 C224,292 268,322 280,400Z" fill="#1f4f86" />
      <path d={dabField(r, { x0: 22, y0: 280, x1: 280, y1: 400, count: 120, len: [6, 16], angle: () => -0.9 + r() * 1.8 })}
        fill="none" stroke="#2a6fb8" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      <path d="M130,282 L150,330 L172,282 L160,278 L140,278Z" fill="#dfe8e4" />

      {/* Head */}
      <path d="M150,96 C190,96 206,128 204,166 C202,208 184,246 150,250 C116,246 98,208 96,166 C94,128 110,96 150,96Z" fill="url(#sp-skin)" />
      <path d="M150,96 C176,96 194,116 200,144 C182,128 160,122 150,122 C140,122 118,128 100,144 C106,116 124,96 150,96Z" fill="#c9752b" />
      <path d="M118,236 C128,258 172,258 182,236 C178,268 160,284 150,284 C140,284 122,268 118,236Z" fill="#c9752b" />
      <path d="M112,214 C128,244 172,244 188,214 C186,250 170,266 150,266 C130,266 114,250 112,214Z" fill="#a85520" opacity="0.85" />
      <ellipse cx="126" cy="164" rx="10" ry="6" fill="#f4ead7" />
      <ellipse cx="174" cy="164" rx="10" ry="6" fill="#f4ead7" />
      <circle cx="127" cy="164" r="4.2" fill="#2b5f52" />
      <circle cx="173" cy="164" r="4.2" fill="#2b5f52" />
      <circle cx="128.4" cy="162.6" r="1.4" fill="#fff" />
      <circle cx="174.4" cy="162.6" r="1.4" fill="#fff" />
      <path d="M112,152 q14,-9 28,-3 M160,149 q14,-6 28,3" stroke="#8a4a18" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M150,168 C146,186 144,196 150,202 C156,196 154,186 150,168Z" fill="#b5702f" />
      <path d="M134,216 q16,7 32,0" stroke="#8a3f18" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={dabField(r, { x0: 96, y0: 100, x1: 204, y1: 250, count: 46, len: [4, 10], angle: () => -1.1 + r() * 2.2 })}
        fill="none" stroke="#d99a55" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

export const VAN_GOGH: PaintingSpec[] = [
  {
    id: 'starry-night',
    title: 'Nocturne, After The Starry Night',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1889 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#0b1026', deep: '#070f2e', glow: '#e3b23c' },
    note: 'A generative nocturne: several hundred curling strokes laid over a sleeping village, with a cypress writing itself upward like smoke. Our Nocturne collection takes its cobalt from this sky.',
    render: starryNight,
  },
  {
    id: 'sunflowers',
    title: 'Ten Sunflowers in Ochre',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1888 / reimagined',
    w: 300,
    h: 400,
    palette: { bg: '#2a220f', deep: '#171205', glow: '#f2c14e' },
    note: 'Every petal here is a single tapered stroke. The pigment ladder from seed-brown to full sun became our Solaire palette — six golds, no two the same temperature.',
    render: sunflowers,
  },
  {
    id: 'irises',
    title: 'Irises at the Wall',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1889 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#241a2e', deep: '#140e1c', glow: '#6c5cc0' },
    note: 'Violet against fired earth — the most difficult contrast in the collection to formulate. One bloom refuses the palette entirely; so does one shade in every Étoile compact.',
    render: irises,
  },
  {
    id: 'cafe-terrace',
    title: 'Terrace, Lamplight',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1888 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#141d3f', deep: '#0a1230', glow: '#e8b53e' },
    note: 'Warm light poured onto cold stone. The boutique lighting in our Paris atelier is calibrated to this exact temperature — 2400 Kelvin, measured from the awning.',
    render: cafeTerrace,
  },
  {
    id: 'wheatfield',
    title: 'Wheatfield, Two Cypresses',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1889 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#2b2513', deep: '#191507', glow: '#d7b356' },
    note: 'Eight hundred and twenty individual strokes of wheat. The restless sky above it is the origin of the shimmer in our Mistral highlighter.',
    render: wheatfield,
  },
  {
    id: 'almond-blossom',
    title: 'Almond Branch in Turquoise',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1890 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#123840', deep: '#0a2027', glow: '#7ecfda' },
    note: 'A painting made as a gift for a newborn. Our Amande serum carries the same intention: something grown slowly, given away.',
    render: almondBlossom,
  },
  {
    id: 'bedroom',
    title: 'The Room at Arles',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1888 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#1f2c33', deep: '#111a1f', glow: '#e3b23c' },
    note: 'Deliberately imperfect perspective — every wall leans. Our packaging designer kept a print of it above the desk for the whole of the Maison line.',
    render: bedroom,
  },
  {
    id: 'self-portrait',
    title: 'Portrait in Teal',
    artist: 'Atelier Étoile Studio · after Vincent van Gogh',
    year: '1889 / reimagined',
    w: 300,
    h: 400,
    palette: { bg: '#14383c', deep: '#0a2124', glow: '#7fb3b6' },
    note: 'The background will not sit still. Neither will a face. The complexion tones sampled here seeded all twenty-four shades of our Terre foundation.',
    render: selfPortrait,
  },
];
