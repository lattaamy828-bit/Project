# Plates

Empty by default — the site draws its own canvases from code.

Run `npm run fetch:art` to fill this folder with public-domain photographs of
the works those canvases interpret, pulled from Wikimedia Commons. Every
painting on the site renders through `src/art/Painting.tsx`, so each plate that
lands here takes over automatically: gallery walls, product cards, the
projections inside the glass vessels, and the opening sequence's brush-mask
reveal. Delete a plate and that painting goes back to being generated.

File names must match the painting id, e.g. `starry-night.jpg`. You can also
drop in your own images by hand — anything `.jpg`, `.jpeg`, `.png`, `.webp` or
`.avif` is picked up at build time.

The ids are: `starry-night`, `sunflowers`, `irises`, `cafe-terrace`,
`wheatfield`, `almond-blossom`, `bedroom`, `self-portrait`, `mona-lisa`,
`venus`, `pearl-earring`, `night-watch`, `water-lilies`, `sunrise`, `the-kiss`,
`creation`, `olympia`, `last-supper`.

`CREDITS.md` is written by the fetch script and records the licence and credit
line for every file it downloads. Read it before using any of them beyond a
demo — the paintings are public domain, but the licence on a given *photograph*
varies by source and jurisdiction.
