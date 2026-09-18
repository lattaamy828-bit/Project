# Atelier Étoile

**An interactive Van Gogh museum, reimagined as a luxury cosmetics boutique.**

A front-end demo built around one idea: every product in the house was formulated
from a painting. The site is a museum you can shop in — eighteen canvases hanging
in a gallery whose light changes with whichever work is on the wall, and
twenty-four cosmetics whose shades, textures and names are drawn from them.

> **This is a fictional demo.** Atelier Étoile is not a real company. Every
> product, price, rating, review, ingredient list, statistic and biographical
> detail was invented for this project. Nothing is for sale and no orders are
> processed.

---

## Every painting is generated in code

Out of the box there isn't a single bitmap on this site. All eighteen canvases —
eight after Van Gogh, ten after other masters — are **generated as SVG from
seeded geometry**: turbulent flow fields for skies, tapered comma dabs for
impasto, flame-shaped silhouettes for cypresses, tessellated rectangles for gold
leaf.

They are **original interpretations in the spirit of** the public-domain works
they are named after, never reproductions of them.

This was a deliberate choice, and it pays off several ways:

- every canvas is crisp at any size, from a 48px chip to a full-bleed hero
- the entire gallery costs **zero image requests** and a few kB of code
- a painting can be projected into glass, clipped by a brush mask, or animated
  stroke-by-stroke, because it is geometry rather than pixels

The art engine lives in `src/art/`:

| File | Role |
| --- | --- |
| `rng.ts` | Seeded PRNG and fractal value noise — same seed, same canvas, forever |
| `strokes.ts` | Brush geometry: smoothed paths, spirals, comma dabs, petals, splashes |
| `helpers.ts` | Dab fields, flow-field streamlines, broken bands |
| `vangogh.tsx` | Eight Van Gogh-inspired canvases |
| `masters.tsx` | Ten canvases after da Vinci, Vermeer, Rembrandt, Monet, Klimt, and others |
| `Painting.tsx` | Renders and memoises a canvas; each one is generated exactly once |

The same approach draws the products: `src/components/Vessel.tsx` builds nine
kinds of cosmetic vessel (flacon, lipstick, dropper, jar, palette, brush, tube,
compact, coffret) from gradients and fake specular light, with the product's own
painting projected through the glass or onto the lid.

### Or use the real paintings

If you would rather see the actual works, run:

```bash
npm run fetch:art          # everything that is missing
npm run fetch:art -- --force
npm run fetch:art -- starry-night irises
```

This pulls public-domain photographs from Wikimedia Commons into
`src/art/plates/`. Because every painting on the site renders through the single
`Painting` module, each plate that lands there **takes over automatically** —
gallery walls, product cards, the projections inside the glass, the framed
canvases, and the opening sequence's brush-mask reveal, which works on a
photograph exactly as it does on vector geometry. Delete a plate and that
painting goes back to being generated. The two modes mix freely, so a partial
download is fine.

A few caveats worth knowing:

- **Licensing is uneven.** The paintings are long out of copyright, but the
  licence on a given *photograph* varies. Commons hosts these as PD-Art, on the
  basis that a faithful reproduction of a 2D public-domain work carries no new
  copyright in the US (*Bridgeman v. Corel*); other jurisdictions differ. Some
  museums hold their images tightly — MoMA licenses *The Starry Night* through
  Art Resource rather than releasing it. The script writes the licence tag and
  credit line for every file it downloads to `src/art/plates/CREDITS.md`. Read
  it before going beyond a demo.
- **Weight.** Eighteen plates at 1600px are roughly 5–10 MB, against
  approximately zero today.
- **Loading.** Plates are inline `<image>` inside the SVG, so they are not lazily
  loaded individually; the `content-visibility` deferral on below-fold sections
  does most of that work instead.

## The opening sequence

On first visit the site paints itself into existence. A dark gallery fills with
drifting dust, a fountain pen appears, and *The Starry Night* is laid in
stroke by stroke — seventeen brush sweeps animated through an SVG mask, with the
nib tracked along the live path via `getPointAtLength` and a wet ink trail
following behind. The camera pushes into the finished canvas, the title resolves,
and a paint wipe hands over to the homepage.

It is skippable after 1.2s (button, `Esc` or `Enter`), replayable from the
footer, shown once per tab session, and replaced by a short fade when the visitor
prefers reduced motion.

## What's in it

**Shop** — 24 products across 8 categories with URL-backed filtering (category,
collection, price, stock), six sort orders, and a mobile filter sheet.
**Product detail** — five views of each piece (the object, its canvas, a canvas
detail, the shade swatched, the work framed), shade selection that recolours the
vessel live, tabbed record, rating breakdown and related pieces.
**Art Gallery** — a principal wall, a museum placard, room filters, and a
zoomable, pannable lightbox. Selecting a canvas retints the whole hall.
**Cart & wishlist** — persisted drawers, a product that flies to the cart
trailing pigment, and museum wall-label notifications.
**Search** — a fullscreen overlay with a painting surfacing behind it,
keyboard-navigable results, `⌘K` / `Ctrl-K`.
**Also** — product comparison, quick view, a four-chapter pinned brand story,
a journal, and a checkout that ends in a bloom of thrown paint.

## Performance notes

The site is heavy by nature — a page can hold several thousand vector paths — so
a few things are done deliberately:

- **Parallax writes `transform` directly to the handful of layers that move.**
  Driving it from a CSS custom property on the section was measured at ~700ms of
  style recalculation per second of scrolling, because changing a custom property
  invalidates every descendant that could inherit it. Direct writes: ~13ms.
- **Animated elements carry no CSS `drop-shadow`.** Chained drop-shadows on the
  floating vessels forced a full re-rasterisation each frame and more than halved
  the frame rate; the shadow is drawn inside the vessel's own SVG instead.
- **`content-visibility: auto`** on the heavy below-the-fold sections.
- Painting geometry is **generated once and cached** by id, so the same canvas in
  a card, a hero and a lightbox is built a single time.
- Product cards skip the vessel's internal painting projection — the card already
  shows that painting behind it.
- Particle canvases share one `requestAnimationFrame` loop each and **pause when
  the tab is hidden**; counts step down on coarse pointers and small viewports.

## Accessibility

Semantic landmarks and a clean heading hierarchy, a skip link, visible focus
rings, accessible names on every control (verified: zero unnamed buttons or
links), no tab stops inside `aria-hidden` regions, focus trapping and restoration
in drawers and dialogs, and full keyboard operation of the gallery, filters and
checkout.

Motion is honoured twice over: `prefers-reduced-motion` and an in-page switch in
the footer. With motion off the opening sequence is skipped, particles and cursor
effects are dropped, and the pinned story section becomes a plain readable list —
nothing is lost but the movement.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Lucide icons.

No animation library: every transition is a CSS transition, a keyframe, or the
Web Animations API. No image assets unless you fetch them. No Three.js — the 3D
is CSS perspective and hand-built specular gradients, which render faster and
stay crisp at any size.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # typecheck + production build
npm run preview    # serve the build
npm run fetch:art  # optional: real paintings instead of generated ones
```

To serve the build as a plain static page from any path — no server rewrites, no
route configuration — use the standalone mode, which emits relative asset paths
and switches the router to hash routing:

```bash
VITE_HASH_ROUTER=1 npm run build:standalone
```
