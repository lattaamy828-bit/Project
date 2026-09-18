/**
 * The Masters Gallery — generative homages to works in the public domain.
 *
 * As with the Van Gogh room, nothing here is a reproduction: each canvas is
 * built from primitives (sfumato gradients, gold-leaf tessellation, chiaroscuro
 * pools) that gesture at the original's composition and palette.
 */

import type { PaintingSpec } from './types';
import { bands, dabField, flowLines, joinD } from './helpers';
import { blob, comma, petal, smoothPath } from './strokes';
import type { Rng } from './rng';

/* ---------------------------- Mona Lisa ---------------------------- */

function monaLisa(r: Rng) {
  return (
    <>
      <defs>
        <linearGradient id="ml-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fa6a0" />
          <stop offset="42%" stopColor="#7c7a52" />
          <stop offset="100%" stopColor="#3b2d18" />
        </linearGradient>
        <radialGradient id="ml-skin" cx="48%" cy="38%">
          <stop offset="0%" stopColor="#e8cfa6" />
          <stop offset="100%" stopColor="#a67f4e" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="url(#ml-bg)" />
      {/* Distant valley, bridge and winding river */}
      <path d={smoothPath([[-10, 168], [46, 142], [104, 160], [150, 136], [206, 158], [260, 138], [310, 156], [310, 220], [-10, 220]], true)} fill="#6f7f79" opacity="0.8" />
      <path d={smoothPath([[-10, 206], [58, 190], [92, 206], [142, 192], [196, 210], [256, 196], [310, 208], [310, 260], [-10, 260]], true)} fill="#5c6247" opacity="0.85" />
      <path d="M8,196 q26,-12 52,-2 q26,10 44,-4" fill="none" stroke="#a9bcc0" strokeWidth="4" opacity="0.7" />
      <path d="M198,182 q28,-8 54,4" fill="none" stroke="#a9bcc0" strokeWidth="5" opacity="0.6" />
      <path d="M204,180 h46 M210,180 v8 M226,179 v9 M242,178 v9" stroke="#4a3d24" strokeWidth="2.4" opacity="0.8" />
      <path d={flowLines(77, r, { x0: -10, y0: 120, x1: 310, y1: 244, count: 54, steps: 7, step: 9, scale: 0.018, range: 2.2, squash: 0.7 })}
        fill="none" stroke="#9db0a8" strokeOpacity="0.24" strokeWidth="2.2" strokeLinecap="round" />

      {/* Torso, sleeve, folded hands */}
      <path d="M150,196 C214,200 254,250 266,400 L34,400 C46,250 86,200 150,196Z" fill="#2c2313" />
      <path d="M150,200 C176,206 190,224 196,246 L104,246 C110,224 124,206 150,200Z" fill="#514226" />
      <path d="M72,400 C86,300 118,290 150,296 C182,290 214,300 228,400Z" fill="#241c0f" />
      <path d="M104,344 C124,330 152,332 168,346 C176,354 172,366 160,364 C142,360 120,362 108,358 C100,354 98,348 104,344Z" fill="url(#ml-skin)" />
      <path d="M112,350 q16,-6 34,2 M114,357 q18,-5 36,3" stroke="#8a6a3f" strokeWidth="1.4" fill="none" opacity="0.7" />

      {/* Face in sfumato */}
      <path d="M150,84 C182,84 196,112 194,146 C192,182 174,206 150,208 C126,206 108,182 106,146 C104,112 118,84 150,84Z" fill="url(#ml-skin)" />
      <path d="M150,72 C192,72 208,104 206,148 C204,196 186,224 150,232 C114,224 96,196 94,148 C92,104 108,72 150,72Z" fill="#2b2011" opacity="0.92" />
      <path d="M150,84 C182,84 196,112 194,146 C192,182 174,206 150,208 C126,206 108,182 106,146 C104,112 118,84 150,84Z" fill="url(#ml-skin)" />
      <path d="M150,72 C186,72 202,98 204,126 C186,104 170,96 150,96 C130,96 114,104 96,126 C98,98 114,72 150,72Z" fill="#241a0d" />
      <path d="M96,126 C90,176 104,214 130,236 L120,240 C92,220 82,178 88,132Z" fill="#241a0d" />
      <path d="M204,126 C210,176 196,214 170,236 L180,240 C208,220 218,178 212,132Z" fill="#241a0d" />
      <ellipse cx="128" cy="142" rx="9" ry="5" fill="#f0e3cc" />
      <ellipse cx="172" cy="142" rx="9" ry="5" fill="#f0e3cc" />
      <circle cx="129" cy="142" r="3.6" fill="#4a3620" />
      <circle cx="171" cy="142" r="3.6" fill="#4a3620" />
      <path d="M118,132 q11,-6 22,-1 M160,131 q11,-5 22,1" stroke="#7a5c33" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M150,148 C146,164 144,172 150,177 C156,172 154,164 150,148Z" fill="#b08a55" opacity="0.6" />
      <path d="M134,190 C142,196 158,196 166,190 C160,199 140,199 134,190Z" fill="#8f6238" opacity="0.85" />
      {/* Veil */}
      <path d="M96,124 C112,96 188,96 204,124 C190,112 110,112 96,124Z" fill="#c9bfa6" opacity="0.3" />
    </>
  );
}

/* ------------------------- Birth of Venus -------------------------- */

function venus(r: Rng) {
  return (
    <>
      <defs>
        <linearGradient id="vn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c3d6cf" />
          <stop offset="100%" stopColor="#8fb0ab" />
        </linearGradient>
        <linearGradient id="vn-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e6d0" />
          <stop offset="100%" stopColor="#d9b98c" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#vn-sky)" />
      <rect y="186" width="400" height="114" fill="#6f96a0" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 190, y1: 298, rows: 12, per: 11, len: [16, 60] })}
        fill="none" stroke="#c8ded9" strokeOpacity="0.55" strokeWidth="2.6" strokeLinecap="round" />
      <path d={flowLines(19, r, { x0: -10, y0: 10, x1: 410, y1: 176, count: 50, steps: 8, step: 11, scale: 0.015, range: 2.2, squash: 0.7 })}
        fill="none" stroke="#e7efe9" strokeOpacity="0.4" strokeWidth="2.6" strokeLinecap="round" />

      {/* Scallop shell */}
      <path d="M200,244 C142,244 104,214 104,192 C104,180 148,166 200,166 C252,166 296,180 296,192 C296,214 258,244 200,244Z" fill="url(#vn-shell)" />
      {Array.from({ length: 13 }, (_, i) => {
        const t = (i / 12 - 0.5) * 1.9;
        return <path key={i} d={`M200,168 Q${200 + t * 52},${196} ${200 + t * 96},${212 + Math.abs(t) * 18}`} stroke="#c49a63" strokeWidth="2" fill="none" opacity="0.6" />;
      })}
      <path d="M200,166 C176,166 160,176 158,186 C176,178 224,178 242,186 C240,176 224,166 200,166Z" fill="#fbf1e0" />

      {/* Figure */}
      <g>
        <path d="M200,96 C216,96 224,112 222,128 C220,146 212,156 200,158 C188,156 180,146 178,128 C176,112 184,96 200,96Z" fill="#f0d7b8" />
        <path d="M200,158 C214,160 224,180 224,204 C224,222 216,232 214,244 L186,244 C184,232 176,222 176,204 C176,180 186,160 200,158Z" fill="#f2dcc0" />
        <path d="M186,244 C186,262 190,266 190,272 L210,272 C210,266 214,262 214,244Z" fill="#eed6b6" />
        <path d="M178,172 C164,186 156,206 158,228 C160,240 168,242 170,232 C170,214 176,194 186,182Z" fill="#f0d7b8" />
        <path d="M222,172 C238,186 246,208 244,230 C242,242 234,242 232,232 C232,214 226,192 214,182Z" fill="#f0d7b8" />
        {/* Hair as long curling strands */}
        <path d={joinD([
          smoothPath([[200, 90], [176, 104], [168, 136], [176, 170], [166, 206], [174, 238]]),
          smoothPath([[200, 90], [224, 104], [234, 136], [226, 172], [238, 206], [230, 240]]),
          smoothPath([[196, 92], [180, 118], [186, 150], [178, 186]]),
          smoothPath([[204, 92], [220, 118], [214, 152], [222, 188]]),
        ])} fill="none" stroke="#c08b3b" strokeWidth="9" strokeLinecap="round" />
        <path d="M200,84 C220,84 230,98 230,112 C222,98 212,94 200,94 C188,94 178,98 170,112 C170,98 180,84 200,84Z" fill="#b57e30" />
        <circle cx="192" cy="122" r="2.3" fill="#4a3620" />
        <circle cx="208" cy="122" r="2.3" fill="#4a3620" />
        <path d="M194,140 q6,4 12,0" stroke="#b5825a" strokeWidth="1.6" fill="none" />
      </g>

      {/* Drifting roses and a wind-borne cloak */}
      <path d="M330,120 C368,104 396,128 388,168 C376,204 344,208 330,186 C346,178 352,148 330,120Z" fill="#c8d9cf" opacity="0.55" />
      <path d="M60,128 C24,116 4,146 16,180 C28,208 58,206 66,186 C50,176 44,152 60,128Z" fill="#cfe0d6" opacity="0.5" />
      {Array.from({ length: 18 }, (_, i) => {
        const x = 30 + r() * 340;
        const y = 40 + r() * 160;
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)})`} opacity={0.65 + r() * 0.35}>
            <path d={joinD(Array.from({ length: 5 }, (_, k) => petal(0, 0, 5, 2.2, (k / 5) * Math.PI * 2)))} fill="#e8b7b0" />
            <circle r="1.4" fill="#e3b23c" />
          </g>
        );
      })}
    </>
  );
}

/* --------------------- Girl with a Pearl Earring -------------------- */

function pearlEarring(r: Rng) {
  return (
    <>
      <defs>
        <radialGradient id="pe-bg" cx="60%" cy="34%" r="86%">
          <stop offset="0%" stopColor="#23302f" />
          <stop offset="100%" stopColor="#060a0b" />
        </radialGradient>
        <radialGradient id="pe-skin" cx="42%" cy="34%">
          <stop offset="0%" stopColor="#f1d9b8" />
          <stop offset="100%" stopColor="#a97c4f" />
        </radialGradient>
        <radialGradient id="pe-pearl" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#d8dfe4" />
          <stop offset="100%" stopColor="#59636b" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="url(#pe-bg)" />

      <path d="M150,242 C206,246 244,290 252,400 L48,400 C56,290 94,246 150,242Z" fill="#6b5a33" />
      <path d="M150,246 C176,252 190,268 196,290 L104,290 C110,268 124,252 150,246Z" fill="#d8cdb0" />
      <path d="M118,268 C136,258 164,258 182,268 C170,282 130,282 118,268Z" fill="#f0e8d2" />

      {/* Head turned over the shoulder */}
      <path d="M152,104 C190,104 206,138 202,180 C198,222 178,248 150,250 C122,248 104,222 100,180 C96,138 114,104 152,104Z" fill="url(#pe-skin)" />
      <path d="M100,176 C96,152 108,120 132,110 C120,132 116,156 118,180Z" fill="#8d6238" opacity="0.5" />
      <ellipse cx="128" cy="172" rx="11" ry="6.4" fill="#f6efe0" />
      <ellipse cx="172" cy="170" rx="10" ry="6" fill="#f6efe0" />
      <circle cx="130" cy="172" r="4.4" fill="#3d3326" />
      <circle cx="173" cy="170" r="4.2" fill="#3d3326" />
      <circle cx="131.6" cy="170.4" r="1.5" fill="#fff" />
      <circle cx="174.4" cy="168.4" r="1.4" fill="#fff" />
      <path d="M116,160 q13,-7 26,-2 M160,157 q13,-5 25,2" stroke="#6f4f2c" strokeWidth="2.2" fill="none" opacity="0.65" />
      <path d="M152,178 C148,196 146,204 152,210 C158,204 156,196 152,178Z" fill="#c69a62" opacity="0.65" />
      <path d="M134,222 C142,216 162,216 170,222 C162,232 142,232 134,222Z" fill="#b5675a" />
      <path d="M134,222 C142,226 162,226 170,222 C162,232 142,232 134,222Z" fill="#8e4438" />
      <ellipse cx="152" cy="219" rx="5" ry="2" fill="#f4e2d2" opacity="0.65" />

      {/* Turban: cobalt wrap with a falling gold tail */}
      <path d="M100,168 C92,116 116,80 154,80 C192,80 214,110 206,160 C200,124 180,104 152,104 C124,104 106,128 100,168Z" fill="#1b3a8c" />
      <path d="M100,150 C110,120 128,100 154,100 C176,100 194,114 202,140 C186,118 168,110 150,112 C126,114 110,128 100,150Z" fill="#2a5fd7" />
      <path d="M198,120 C226,126 232,158 220,190 C212,212 196,222 190,214 C202,196 210,160 198,120Z" fill="#c9a94a" />
      <path d="M198,120 C218,128 224,152 216,178 C210,196 200,206 196,200 C206,182 210,152 198,120Z" fill="#e3b23c" />
      <path d="M104,118 C118,92 140,80 158,80 C140,86 122,98 110,124Z" fill="#6f9bef" opacity="0.6" />

      {/* The pearl */}
      <circle cx="182" cy="216" r="10.5" fill="url(#pe-pearl)" />
      <circle cx="178.6" cy="212.4" r="2.6" fill="#ffffff" opacity="0.95" />
      <circle cx="184" cy="221" r="3.4" fill="#ffeecb" opacity="0.4" />
      <path d={dabField(r, { x0: 30, y0: 30, x1: 270, y1: 380, count: 26, len: [4, 12], angle: () => r() * 6.28 })}
        fill="none" stroke="#3a4a48" strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

/* --------------------------- Night Watch --------------------------- */

function nightWatch(r: Rng) {
  const figures = Array.from({ length: 16 }, (_, i) => {
    const x = 26 + i * 23 + (r() - 0.5) * 12;
    const h = 96 + r() * 54;
    const lit = Math.abs(x - 150) < 46 || Math.abs(x - 214) < 30;
    return { x, h, lit, hat: r() > 0.4 };
  });

  return (
    <>
      <defs>
        <radialGradient id="nw-light" cx="42%" cy="56%" r="56%">
          <stop offset="0%" stopColor="#f2d493" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f2d493" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="#1c1409" />
      <path d="M0,0 H400 V300 H0Z" fill="#241a0c" />
      {/* Arch behind the company */}
      <path d="M118,300 V150 A82,82 0 0 1 282,150 V300Z" fill="#150f06" />
      <path d="M126,300 V152 A74,74 0 0 1 274,152 V300Z" fill="#2c2010" />
      <path d={bands(r, { x0: 0, x1: 400, y0: 20, y1: 290, rows: 14, per: 8, len: [30, 120] })}
        fill="none" stroke="#3a2a12" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="160" cy="190" rx="170" ry="120" fill="url(#nw-light)" />

      {/* Pikes and a banner raked across the top */}
      <path d="M40,300 L128,26 M78,300 L150,40 M300,300 L262,30 M336,290 L300,44 M356,300 L338,70"
        stroke="#4a3418" strokeWidth="3" opacity="0.85" />
      <path d="M296,44 C324,36 344,48 352,66 C330,60 312,58 298,64Z" fill="#8c2f22" opacity="0.8" />

      {figures.map((f, i) => (
        <g key={i} opacity={f.lit ? 1 : 0.62}>
          <path d={`M${f.x},${300} C${f.x - 16},${300 - f.h * 0.5} ${f.x - 12},${300 - f.h * 0.8} ${f.x},${300 - f.h} C${f.x + 12},${300 - f.h * 0.8} ${f.x + 16},${300 - f.h * 0.5} ${f.x},300Z`}
            fill={f.lit ? '#6e4c19' : '#160f06'} />
          {f.lit && (
            <path d={`M${f.x - 9},${300 - f.h * 0.62} q9,-8 18,0 l-2,${f.h * 0.3} q-7,5 -14,0Z`} fill="#c9a03c" opacity="0.9" />
          )}
          <circle cx={f.x} cy={300 - f.h - 8} r="8.5" fill={f.lit ? '#e2c093' : '#241a0c'} />
          {f.hat && <path d={`M${f.x - 15},${300 - f.h - 12} q15,-13 30,0 q-15,5 -30,0Z`} fill="#120c05" />}
          {f.lit && <ellipse cx={f.x} cy={300 - f.h + 6} rx="13" ry="5" fill="#f4e0b2" opacity="0.75" />}
        </g>
      ))}
      {/* The small figure in gold, lit like a lantern */}
      <g>
        <ellipse cx="128" cy="222" rx="30" ry="46" fill="#e0bb5b" opacity="0.92" />
        <circle cx="128" cy="172" r="11" fill="#f2dfb4" />
        <path d="M114,164 q14,-11 28,0 q-14,5 -28,0Z" fill="#8c6b31" />
        <ellipse cx="128" cy="230" rx="34" ry="16" fill="#f2c14e" opacity="0.4" />
      </g>
      <path d={dabField(r, { x0: 0, y0: 100, x1: 400, y1: 300, count: 60, len: [5, 14], angle: () => r() * 3.14 })}
        fill="none" stroke="#f2c14e" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/* --------------------------- Water Lilies -------------------------- */

function waterLilies(r: Rng) {
  const pads = Array.from({ length: 26 }, () => ({
    x: r() * 400,
    y: 60 + r() * 240,
    s: 8 + r() * 22,
    bloom: r() > 0.62,
  }));

  return (
    <>
      <defs>
        <linearGradient id="wl-pond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#274b5a" />
          <stop offset="40%" stopColor="#3d6f6a" />
          <stop offset="100%" stopColor="#1d3a46" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wl-pond)" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 4, y1: 296, rows: 26, per: 9, len: [26, 96] })}
        fill="none" stroke="#8fc7bf" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 10, y1: 290, rows: 20, per: 7, len: [20, 80] })}
        fill="none" stroke="#d8e7c8" strokeOpacity="0.25" strokeWidth="2.6" strokeLinecap="round" />
      {/* Reflected willow and sky */}
      <path d={flowLines(31, r, { x0: -10, y0: 0, x1: 410, y1: 150, count: 64, steps: 7, step: 11, scale: 0.014, range: 2.2, squash: 0.65 })}
        fill="none" stroke="#5b8f7f" strokeOpacity="0.4" strokeWidth="2.4" strokeLinecap="round" />
      <path d={joinD(Array.from({ length: 10 }, () => {
        const x = r() * 400;
        return `M${x.toFixed(1)},0 q${((r() - 0.5) * 30).toFixed(1)},70 ${((r() - 0.5) * 22).toFixed(1)},140`;
      }))} fill="none" stroke="#2f5d52" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      <path d={bands(r, { x0: 40, x1: 340, y0: 40, y1: 210, rows: 10, per: 5, len: [22, 70] })}
        fill="none" stroke="#c6d8e6" strokeOpacity="0.32" strokeWidth="3.4" strokeLinecap="round" />

      {pads.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y} rx={p.s} ry={p.s * 0.42} fill="#3f7250" opacity="0.92" />
          <ellipse cx={p.x} cy={p.y - 1.4} rx={p.s * 0.82} ry={p.s * 0.3} fill="#6f9a5c" opacity="0.7" />
          {p.bloom && (
            <g transform={`translate(${p.x.toFixed(1)} ${(p.y - 3).toFixed(1)})`}>
              <path d={joinD(Array.from({ length: 7 }, (_, k) => petal(0, 0, p.s * 0.4, p.s * 0.14, (k / 7) * Math.PI * 2)))}
                fill={i % 3 === 0 ? '#f3d4dd' : '#f7e9ee'} opacity="0.95" />
              <circle r={p.s * 0.1} fill="#f2c14e" />
            </g>
          )}
        </g>
      ))}
      <path d={dabField(r, { x0: -10, y0: -10, x1: 410, y1: 310, count: 90, len: [4, 12], angle: () => (r() - 0.5) * 0.6 })}
        fill="none" stroke="#a7d0c4" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/* ------------------------ Impression, Sunrise ---------------------- */

function sunrise(r: Rng) {
  return (
    <>
      <defs>
        <linearGradient id="su-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7b92" />
          <stop offset="48%" stopColor="#97a1ab" />
          <stop offset="100%" stopColor="#6d7c8c" />
        </linearGradient>
        <radialGradient id="su-sun">
          <stop offset="0%" stopColor="#ff9a3c" />
          <stop offset="55%" stopColor="#f2762a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f2762a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#su-sky)" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 6, y1: 150, rows: 14, per: 8, len: [24, 100] })}
        fill="none" stroke="#b7c0c8" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 20, y1: 140, rows: 8, per: 5, len: [30, 90] })}
        fill="none" stroke="#e0a97c" strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" />

      {/* Harbour cranes and masts dissolving into mist */}
      <path d="M300,156 V72 M322,156 V90 M348,156 V60 M366,156 V96 M270,156 V104"
        stroke="#5c6673" strokeOpacity="0.55" strokeWidth="2.4" />
      <path d="M292,86 h26 M340,72 h24 M262,110 h20" stroke="#5c6673" strokeOpacity="0.45" strokeWidth="3" />
      <path d="M40,150 V96 M58,150 V110 M76,150 V88" stroke="#59616e" strokeOpacity="0.4" strokeWidth="2" />

      <circle cx="122" cy="118" r="42" fill="url(#su-sun)" />
      <circle cx="122" cy="118" r="15" fill="#ff8f2e" />

      <rect y="150" width="400" height="150" fill="#5f6f80" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 154, y1: 298, rows: 20, per: 10, len: [16, 68] })}
        fill="none" stroke="#7e8d9b" strokeOpacity="0.5" strokeWidth="3.4" strokeLinecap="round" />
      {/* Sun's broken reflection */}
      <path d={bands(r, { x0: 92, x1: 154, y0: 156, y1: 296, rows: 22, per: 3, len: [8, 34] })}
        fill="none" stroke="#ff8f2e" strokeOpacity="0.75" strokeWidth="3.6" strokeLinecap="round" />
      <path d={bands(r, { x0: 100, x1: 148, y0: 160, y1: 280, rows: 14, per: 2, len: [6, 22] })}
        fill="none" stroke="#ffc07a" strokeOpacity="0.6" strokeWidth="2.4" strokeLinecap="round" />

      {/* Rowing boats */}
      {[[86, 232, 1], [166, 204, 0.72], [248, 182, 0.5]].map(([bx, by, s], i) => (
        <g key={i} transform={`translate(${bx} ${by}) scale(${s})`}>
          <path d="M-32,6 C-18,18 18,18 32,6 C16,12 -16,12 -32,6Z" fill="#1c232b" />
          <path d="M-8,6 L-4,-18 L2,6Z" fill="#1c232b" />
          <path d="M10,4 L16,-14 L20,4Z" fill="#1c232b" />
          <path d="M-20,2 l-14,10" stroke="#1c232b" strokeWidth="2.4" />
        </g>
      ))}
    </>
  );
}

/* ----------------------------- The Kiss ---------------------------- */

function theKiss(r: Rng) {
  const flakes = Array.from({ length: 150 }, () => ({
    x: r() * 300,
    y: r() * 400,
    w: 3 + r() * 11,
    h: 3 + r() * 11,
    o: 0.12 + r() * 0.4,
    rot: r() * 90,
  }));

  return (
    <>
      <defs>
        <linearGradient id="kk-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c8952c" />
          <stop offset="45%" stopColor="#8a6520" />
          <stop offset="100%" stopColor="#3d2c0c" />
        </linearGradient>
        <linearGradient id="kk-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3d574" />
          <stop offset="100%" stopColor="#b4842a" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#kk-gold)" />
      {flakes.map((f, i) => (
        <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} fill="#f2c14e" opacity={f.o}
          transform={`rotate(${f.rot.toFixed(0)} ${f.x.toFixed(0)} ${f.y.toFixed(0)})`} />
      ))}
      <path d="M-10,300 C60,286 120,296 170,286 C220,276 270,288 310,278 L310,410 L-10,410Z" fill="#6f7a35" />
      <path d={joinD(Array.from({ length: 60 }, () => {
        const x = r() * 300;
        const y = 290 + r() * 110;
        return blob(x, y, 2 + r() * 5, r, 6, 0.5);
      }))} fill="#e3b23c" opacity="0.55" />

      {/* The embracing column of robes */}
      <path d="M150,110 C210,118 238,178 234,252 C230,312 200,344 150,346 C100,344 70,312 66,252 C62,178 90,118 150,110Z" fill="url(#kk-robe)" />
      <path d="M150,112 C104,122 80,172 78,236 C76,296 104,334 150,340Z" fill="#cfa03a" />
      {/* Rectangles on his side, circles and florets on hers */}
      {Array.from({ length: 34 }, (_, i) => (
        <rect key={i} x={84 + (i % 4) * 16 + r() * 4} y={140 + Math.floor(i / 4) * 22 + r() * 6}
          width={8 + r() * 8} height={9 + r() * 12} fill={i % 3 === 0 ? '#2b2411' : '#f7dd9b'} opacity={0.55 + r() * 0.4} rx="1" />
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={166 + (i % 4) * 16 + r() * 6} cy={170 + Math.floor(i / 4) * 22 + r() * 6}
          r={2.6 + r() * 5} fill={i % 4 === 0 ? '#5f7ea0' : '#f3e2a8'} opacity={0.5 + r() * 0.45} />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const cx = 160 + r() * 66;
        const cy = 180 + r() * 150;
        return (
          <g key={`f${i}`} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`} opacity="0.85">
            <path d={joinD(Array.from({ length: 6 }, (_, k) => petal(0, 0, 5, 2, (k / 6) * Math.PI * 2)))} fill="#cf6f7a" />
            <circle r="1.6" fill="#f7dd9b" />
          </g>
        );
      })}

      {/* Heads */}
      <path d="M126,96 C126,72 144,58 162,62 C184,66 192,88 184,110 C176,130 150,136 136,124 C128,116 126,106 126,96Z" fill="#e6c49b" />
      <path d="M124,70 C130,48 158,40 178,52 C196,62 198,86 188,96 C186,74 166,60 144,66 C136,68 128,70 124,70Z" fill="#3a2a12" />
      <path d="M140,118 C150,142 176,152 196,140 C214,128 216,104 204,92 C206,116 190,136 166,134 C154,132 146,126 140,118Z" fill="#edcfa8" />
      <path d="M196,92 C218,86 232,104 228,124 C224,144 206,152 196,144 C210,136 212,108 196,92Z" fill="#8a5a2a" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={comma(198 + r() * 30, 96 + r() * 52, 6 + r() * 7, r() * 6.28, 0.5)}
          fill="none" stroke="#f2c14e" strokeWidth="1.6" opacity="0.8" />
      ))}
      <path d="M154,104 q10,-5 20,-1" stroke="#7a5a32" strokeWidth="1.8" fill="none" opacity="0.7" />
    </>
  );
}

/* ----------------------- The Creation of Adam ---------------------- */

function creation(r: Rng) {
  const hand = (x: number, y: number, flip: number, fill: string) => (
    <g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
      <path d="M0,0 C-26,-6 -48,2 -60,16 C-66,24 -60,34 -50,32 C-34,28 -14,26 0,28 C10,28 14,14 0,0Z" fill={fill} />
      <path d="M0,4 C16,2 30,6 40,12 C46,16 44,24 36,24 C24,22 10,22 2,24Z" fill={fill} />
      <path d="M40,12 C50,10 58,14 60,19 C61,23 57,26 52,24 C47,22 43,20 38,20Z" fill={fill} />
      <path d="M-58,20 C-70,22 -78,30 -76,38 C-74,44 -66,44 -62,38 C-58,32 -54,28 -50,26Z" fill={fill} opacity="0.92" />
    </g>
  );

  return (
    <>
      <defs>
        <linearGradient id="ca-fresco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9cdb4" />
          <stop offset="100%" stopColor="#b5a486" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ca-fresco)" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 4, y1: 296, rows: 22, per: 6, len: [40, 150] })}
        fill="none" stroke="#c4b697" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" />
      {/* Plaster cracks */}
      <path d="M62,0 q10,60 -6,120 q-14,60 4,180 M318,0 q-12,80 6,150" fill="none" stroke="#9c8c6d" strokeOpacity="0.4" strokeWidth="1.6" />

      {/* Left: the reclining figure on the earth */}
      <path d="M-10,300 C40,250 110,240 168,250 L168,300Z" fill="#a08f70" opacity="0.8" />
      <path d="M26,268 C36,222 70,206 104,214 C126,220 138,236 140,252 C142,268 130,280 112,280 L54,286 C36,288 24,282 26,268Z" fill="#e2c9a4" />
      <circle cx="58" cy="206" r="19" fill="#e2c9a4" />
      <path d="M40,200 C42,182 62,176 74,186 C84,194 82,206 74,210 C72,196 56,192 40,200Z" fill="#7a5a32" />
      <path d="M100,220 C124,214 150,216 168,224 L166,240 C144,232 120,230 102,234Z" fill="#e2c9a4" />
      <path d="M40,278 C60,300 100,302 128,288 L134,300 L30,300Z" fill="#dcc29c" />

      {/* Right: the mantle sweeping in */}
      <path d="M410,60 C330,50 262,96 250,150 C238,204 274,262 340,276 C410,290 410,290 410,290Z" fill="#8d6f7d" />
      <path d="M410,74 C342,66 284,104 274,150 C264,196 294,244 348,258 C404,270 410,270 410,270Z" fill="#a6889a" />
      <path d="M394,110 C346,106 306,134 300,166 C294,198 316,230 354,240" fill="none" stroke="#c7a9b8" strokeWidth="6" opacity="0.7" />
      <path d="M340,132 C318,136 304,152 306,172 C308,192 324,204 344,202 C334,188 330,158 340,132Z" fill="#e2c9a4" />
      <circle cx="334" cy="128" r="17" fill="#e2c9a4" />
      <path d="M318,118 C320,102 342,96 352,108 C358,116 354,126 348,128 C344,116 330,112 318,118Z" fill="#8a7a5a" />
      <path d="M300,170 C276,166 250,168 232,176 L236,190 C256,182 280,180 300,184Z" fill="#e2c9a4" />

      {hand(168, 236, 1, '#e2c9a4')}
      {hand(232, 182, -1, '#e2c9a4')}
      {/* The gap */}
      <circle cx="200" cy="208" r="26" fill="#fff6d8" opacity="0.18" />
      <circle cx="200" cy="208" r="9" fill="#fff6d8" opacity="0.28" />
    </>
  );
}

/* ----------------------------- Olympia ----------------------------- */

function olympia(r: Rng) {
  return (
    <>
      <rect width="400" height="300" fill="#2a2118" />
      <path d="M0,0 H186 V300 H0Z" fill="#3a2e20" />
      <path d={bands(r, { x0: 0, x1: 400, y0: 0, y1: 300, rows: 16, per: 6, len: [40, 130] })}
        fill="none" stroke="#4a3b28" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      {/* Curtain */}
      <path d="M186,-10 C210,60 200,140 214,300 L400,300 L400,-10Z" fill="#20180f" />
      <path d="M232,-10 q14,120 2,310 M268,-10 q18,140 4,310 M310,-10 q14,120 0,310" stroke="#3b2c1c" strokeWidth="6" fill="none" opacity="0.7" />

      {/* Bed and linen */}
      <path d="M-10,214 C60,196 300,190 410,206 L410,300 L-10,300Z" fill="#6b5233" />
      <path d="M-10,206 C70,182 300,178 410,194 L410,238 C300,222 70,226 -10,246Z" fill="#efe7d6" />
      <path d={bands(r, { x0: -10, x1: 410, y0: 190, y1: 244, rows: 8, per: 9, len: [20, 70] })}
        fill="none" stroke="#c9bda2" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <path d="M8,176 C60,158 152,156 196,170 L192,206 C150,192 62,194 10,210Z" fill="#fbf7ef" />

      {/* Reclining figure */}
      <path d="M52,196 C66,168 96,162 124,170 C150,178 170,178 186,186 C200,194 196,208 180,208 L70,212 C54,212 46,206 52,196Z" fill="#f0dcc0" />
      <circle cx="74" cy="158" r="20" fill="#f0dcc0" />
      <path d="M56,152 C58,132 84,126 96,138 C104,146 100,158 92,160 C88,144 72,142 56,152Z" fill="#4a3620" />
      <circle cx="68" cy="156" r="2.4" fill="#3a2a18" />
      <circle cx="82" cy="155" r="2.4" fill="#3a2a18" />
      <path d="M70,168 q8,5 16,0" stroke="#c09878" strokeWidth="1.6" fill="none" />
      <path d="M186,186 C214,190 248,192 268,200 L264,214 C242,206 208,204 184,204Z" fill="#f0dcc0" />
      <path d="M120,176 C134,184 140,194 136,202" fill="none" stroke="#d8bfa0" strokeWidth="2" />
      <circle cx="92" cy="146" r="3.4" fill="#e3b23c" />
      <path d="M62,176 q12,-5 22,-1" stroke="#e3b23c" strokeWidth="2.4" fill="none" opacity="0.8" />

      {/* Servant with the bouquet */}
      <path d="M272,300 C268,236 284,206 310,204 C338,202 356,232 354,300Z" fill="#c9bda2" />
      <circle cx="312" cy="186" r="19" fill="#5a4330" />
      <path d="M294,180 C296,160 328,156 334,174 C336,182 330,190 322,188 C318,174 306,172 294,180Z" fill="#241a10" />
      <path d="M292,178 q22,-14 40,-2" stroke="#e8dcae" strokeWidth="5" fill="none" />
      {Array.from({ length: 24 }, (_, i) => {
        const cx = 250 + r() * 62;
        const cy = 212 + r() * 54;
        return (
          <g key={i} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
            <path d={joinD(Array.from({ length: 5 }, (_, k) => petal(0, 0, 5 + r() * 3, 2.4, (k / 5) * Math.PI * 2)))}
              fill={['#f2dfe4', '#e8b7b0', '#fbf7ef', '#e3b23c'][i % 4]} opacity="0.95" />
            <circle r="1.4" fill="#8c6b31" />
          </g>
        );
      })}
      <path d="M244,244 C232,254 226,266 228,278" fill="none" stroke="#6b7a4b" strokeWidth="4" />
      {/* Cat at the foot of the bed */}
      <path d="M368,244 C378,230 392,232 394,246 C396,262 386,270 376,266 C368,262 364,254 368,244Z" fill="#12100c" />
      <path d="M368,238 l-4,-10 l10,6 M388,234 l6,-10 l0,12" fill="#12100c" />
      <circle cx="376" cy="248" r="1.8" fill="#e3b23c" />
      <circle cx="386" cy="247" r="1.8" fill="#e3b23c" />
    </>
  );
}

/* --------------------------- Last Supper --------------------------- */

function lastSupper(r: Rng) {
  const cluster = (cx: number, n: number, flip: number) =>
    Array.from({ length: n }, (_, i) => {
      const x = cx + (i - (n - 1) / 2) * 20 * flip;
      const lean = (i - (n - 1) / 2) * 0.1;
      return (
        <g key={`${cx}-${i}`} transform={`translate(${x.toFixed(1)} 0) rotate(${(lean * 10).toFixed(1)} 0 196)`}>
          <path d="M0,196 C-18,196 -26,178 -24,160 C-22,142 -10,132 0,132 C10,132 22,142 24,160 C26,178 18,196 0,196Z"
            fill={['#4a3a20', '#5c4626', '#6d5a34', '#3f3018'][i % 4]} />
          <circle cx="0" cy="122" r="12" fill="#e2c49a" />
          <path d="M-12,116 C-10,102 10,100 12,114 C8,106 -6,106 -12,116Z" fill="#2c2012" />
          <path d="M-9,178 q9,-7 18,0" stroke="#e2c49a" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />
        </g>
      );
    });

  return (
    <>
      <defs>
        <linearGradient id="ls-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4436" />
          <stop offset="100%" stopColor="#2a251c" />
        </linearGradient>
        <radialGradient id="ls-light" cx="50%" cy="46%" r="46%">
          <stop offset="0%" stopColor="#d9e3ea" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d9e3ea" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ls-wall)" />
      {/* One-point perspective: ceiling coffers and side walls converge at centre */}
      <path d="M0,0 L130,74 L270,74 L400,0Z" fill="#3a352a" />
      <path d="M0,0 L130,74 M52,0 L146,74 M108,0 L164,74 M400,0 L270,74 M348,0 L254,74 M292,0 L236,74"
        stroke="#241f18" strokeWidth="2.4" opacity="0.8" />
      <path d="M0,300 L130,214 L270,214 L400,300Z" fill="#584a34" />
      <path d="M0,300 L130,214 M74,300 L152,214 M400,300 L270,214 M326,300 L248,214" stroke="#3d3222" strokeWidth="2.4" opacity="0.7" />
      <path d="M0,0 L0,300 L130,214 L130,74Z" fill="#3f392c" />
      <path d="M400,0 L400,300 L270,214 L270,74Z" fill="#453e30" />
      {[[14, 34], [56, 60], [96, 84]].map(([x, w], i) => (
        <rect key={i} x={x} y={100 + i * 6} width={w * 0.5} height={70 - i * 8} fill="#241f18" opacity="0.7" />
      ))}

      {/* Three windows opening onto evening */}
      <rect x="150" y="96" width="34" height="58" rx="3" fill="#9fb4c4" />
      <rect x="186" y="90" width="42" height="64" rx="3" fill="#b3c6d4" />
      <rect x="230" y="96" width="34" height="58" rx="3" fill="#9fb4c4" />
      <path d="M150,138 q17,-16 34,0 M186,132 q21,-18 42,0 M230,138 q17,-16 34,0" fill="#7f95a6" opacity="0.7" />
      <ellipse cx="207" cy="130" rx="86" ry="58" fill="url(#ls-light)" />

      {cluster(76, 3, 1)}
      {cluster(140, 3, 1)}
      {cluster(274, 3, 1)}
      {cluster(338, 3, 1)}
      {/* The central figure, arms open */}
      <g>
        <path d="M207,200 C182,200 172,176 176,154 C180,134 194,124 207,124 C220,124 234,134 238,154 C242,176 232,200 207,200Z" fill="#2f4d86" />
        <path d="M207,124 C194,124 182,134 178,152 C186,140 196,134 207,134 C218,134 228,140 236,152 C232,134 220,124 207,124Z" fill="#8c3b2c" />
        <circle cx="207" cy="114" r="13" fill="#eccfa4" />
        <path d="M194,108 C196,94 218,92 220,106 C216,98 200,98 194,108Z" fill="#6b4423" />
        <path d="M176,160 q-24,18 -40,28 M238,160 q24,18 40,28" stroke="#eccfa4" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>

      {/* The long table */}
      <path d="M40,212 L368,212 L380,232 L28,232Z" fill="#efe7d6" />
      <path d={bands(r, { x0: 34, x1: 374, y0: 214, y1: 230, rows: 3, per: 14, len: [10, 40] })}
        fill="none" stroke="#cdc2a8" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={48 + i * 20 + r() * 6} cy={216 + r() * 8} r={2.4 + r() * 3}
          fill={i % 4 === 0 ? '#8c2f22' : '#d9c89a'} opacity="0.9" />
      ))}
      <path d="M28,232 L380,232 L376,244 L32,244Z" fill="#b9a884" />
    </>
  );
}

export const MASTERS: PaintingSpec[] = [
  {
    id: 'mona-lisa',
    title: 'Sfumato Study',
    artist: 'Atelier Étoile Studio · after Leonardo da Vinci',
    year: 'c. 1503 / reimagined',
    w: 300,
    h: 400,
    palette: { bg: '#2b2416', deep: '#15110a', glow: '#c9aa6c' },
    note: 'Sfumato means "vanished like smoke" — no line anywhere, only gradient. The blur of our Voile finishing powder was benchmarked against this transition.',
    render: monaLisa,
  },
  {
    id: 'venus',
    title: 'Arrival on the Shell',
    artist: 'Atelier Étoile Studio · after Sandro Botticelli',
    year: 'c. 1485 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#1d3339', deep: '#0e1b1f', glow: '#e8c9a0' },
    note: 'Tempera on canvas, pale as breath. The shell rose is the exact flush in our Naissance cream blush.',
    render: venus,
  },
  {
    id: 'pearl-earring',
    title: 'Turban and Pearl',
    artist: 'Atelier Étoile Studio · after Johannes Vermeer',
    year: 'c. 1665 / reimagined',
    w: 300,
    h: 400,
    palette: { bg: '#10181a', deep: '#060a0b', glow: '#d8dfe4' },
    note: 'Two strokes of lead white make the whole pearl. Our Perle illuminator is built on the same principle — one highlight, placed correctly.',
    render: pearlEarring,
  },
  {
    id: 'night-watch',
    title: 'The Company, Lit',
    artist: 'Atelier Étoile Studio · after Rembrandt van Rijn',
    year: '1642 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#241a0c', deep: '#120c05', glow: '#f2d493' },
    note: 'Chiaroscuro: most of the canvas withheld so a little of it can blaze. The lesson behind every contour in the Maison collection.',
    render: nightWatch,
  },
  {
    id: 'water-lilies',
    title: 'Pond, No Horizon',
    artist: 'Atelier Étoile Studio · after Claude Monet',
    year: 'c. 1906 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#15292f', deep: '#0a1518', glow: '#8fc7bf' },
    note: 'A painting with no sky and no ground — only surface. Our Nymphéa gel-cream behaves the same way: it disappears into skin without a visible edge.',
    render: waterLilies,
  },
  {
    id: 'sunrise',
    title: 'Harbour, First Light',
    artist: 'Atelier Étoile Studio · after Claude Monet',
    year: '1872 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#2a2a2e', deep: '#16171b', glow: '#ff8f2e' },
    note: 'The painting that gave Impressionism its name, as an insult. The orange sun reads bright only because everything around it is grey — our Aurore lip oil follows suit.',
    render: sunrise,
  },
  {
    id: 'the-kiss',
    title: 'Gold Leaf Embrace',
    artist: 'Atelier Étoile Studio · after Gustav Klimt',
    year: 'c. 1908 / reimagined',
    w: 300,
    h: 400,
    palette: { bg: '#2c2109', deep: '#181203', glow: '#f2c14e' },
    note: 'Real gold leaf over oil. Our Byzance eye foil uses a mica-and-silk suspension to reproduce that specific, slightly granular shine.',
    render: theKiss,
  },
  {
    id: 'creation',
    title: 'The Reaching Hands',
    artist: 'Atelier Étoile Studio · after Michelangelo Buonarroti',
    year: 'c. 1512 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#2f2a1e', deep: '#191510', glow: '#e8d6b4' },
    note: 'Painted into wet plaster — no corrections possible, ever. A useful reminder in a house that reformulates a shade forty times before release.',
    render: creation,
  },
  {
    id: 'olympia',
    title: 'The Direct Gaze',
    artist: 'Atelier Étoile Studio · after Édouard Manet',
    year: '1863 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#231b12', deep: '#120d08', glow: '#efe7d6' },
    note: 'Scandalous in 1865 for refusing to look away. Every portrait in our campaign is shot the same way: eyes level with the lens.',
    render: olympia,
  },
  {
    id: 'last-supper',
    title: 'The Long Table',
    artist: 'Atelier Étoile Studio · after Leonardo da Vinci',
    year: 'c. 1497 / reimagined',
    w: 400,
    h: 300,
    palette: { bg: '#2a251c', deep: '#161309', glow: '#b3c6d4' },
    note: 'One vanishing point, placed at the centre figure’s temple. Composition as argument — the whole room points at the meaning.',
    render: lastSupper,
  },
];
