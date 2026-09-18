/** Fictional editorial entries for the demo's Journal. */
export interface Entry {
  slug: string;
  title: string;
  dek: string;
  painting: string;
  category: string;
  date: string;
  read: string;
  body: string[];
}

export const JOURNAL: Entry[] = [
  {
    slug: 'reading-a-canvas-for-colour',
    title: 'How to read a canvas for colour',
    dek: 'Four pigments, one argument, and why the fifth is always wrong.',
    painting: 'sunflowers',
    category: 'Method',
    date: '2026-09-02',
    read: '6 min',
    body: [
      'A formulator arriving at the atelier is handed a painting and a week. No brief, no shade card, no competitive set. The instruction is simply: come back with four colours and tell us why.',
      'Four is not arbitrary. Three is a palette anyone could guess from a thumbnail; five is where people start adding the colour they wish were there. Four forces a decision about what the painting is actually doing.',
      'The most common failure is choosing the brightest region. In a canvas of sunflowers, the eye goes straight to the full-sun petal — but that colour only reads as bright because of the seed-brown beside it. Take the yellow without the brown and you have a highlighter, not a palette.',
      'The second failure is subtler: sampling a colour that the painter mixed on the canvas rather than on the palette. Those transitions are optical, not physical. They cannot be pressed into a pan, and a formulator who tries will spend three months discovering it.',
    ],
  },
  {
    slug: 'the-2400-kelvin-rule',
    title: 'The 2400 Kelvin rule',
    dek: 'Why a shade that only works in one light never leaves the building.',
    painting: 'cafe-terrace',
    category: 'Craft',
    date: '2026-08-19',
    read: '4 min',
    body: [
      'Three lamps sit above the sign-off bench: a daylight panel at 5600K, a gallery spot at 4000K, and a small amber bulb at 2400K — the temperature of a café awning after dark.',
      'A shade is approved only if it holds under all three. This eliminates a surprising number of otherwise beautiful reds, which turn to brick under the warm lamp, and almost every cool-toned bronzer that has ever been proposed here.',
      'The rule costs the house perhaps a quarter of its candidate shades. It also means nobody has ever written to say a lipstick looked different when they got it home.',
    ],
  },
  {
    slug: 'against-the-shade-wheel',
    title: 'Against the shade wheel',
    dek: 'Twenty-four foundation shades, derived from a portrait rather than a grid.',
    painting: 'self-portrait',
    category: 'Formulation',
    date: '2026-07-30',
    read: '8 min',
    body: [
      'Standard foundation ranges are built outward from a centre: a mid-tone neutral, then steps of warmth and depth along two axes. It is tidy, and it is why deep shades so often go grey.',
      'Skin is not built on a grid. In any honest portrait study the complexion contains greens, violets and a surprising amount of cold blue in the shadow — all of which a grid treats as noise to be averaged out.',
      'Terre was derived the other way. Complexion regions were sampled directly from a generated portrait, including the colours that "should not" be there, and the range was assembled from those samples rather than interpolated between endpoints.',
      'The result is twenty-four shades that do not sit in a neat line, and four undertone families that overlap awkwardly. It is harder to merchandise. It also does not turn ashy at hour six.',
    ],
  },
  {
    slug: 'what-gold-leaf-actually-looks-like',
    title: 'What gold leaf actually looks like',
    dek: 'Eleven months to reproduce a texture most people call "shiny".',
    painting: 'the-kiss',
    category: 'Materials',
    date: '2026-07-08',
    read: '5 min',
    body: [
      'Ask anyone to describe gold leaf and they will say smooth. Look at it closely and it is nothing of the sort: beaten metal carries a fine, irregular grain, and light breaks across it in patches rather than sheets.',
      'Glitter fails because it is too regular. Standard metallic mica fails because it is too smooth. The gap between them is where Byzance spent eleven months.',
      'The answer turned out to be a suspension rather than a powder — synthetic fluorphlogopite in a silk-protein base that dries with a slight surface irregularity. Applied flat with a fingertip, it holds an edge. Blended, it becomes ordinary shimmer, which is why the instructions say not to.',
    ],
  },
  {
    slug: 'a-cream-made-as-a-gift',
    title: 'A cream that was never meant to be sold',
    dek: 'Amande began as a small batch for the workshop through a hard winter.',
    painting: 'almond-blossom',
    category: 'House',
    date: '2026-06-14',
    read: '3 min',
    body: [
      'The Amande barrier cream exists because of a cold February and a room full of people whose hands were cracking. It was mixed in a forty-unit batch, unlabelled, and left on the bench.',
      'It was never formulated to a cost, a claim or a category. Fragrance was left out because the person mixing it disliked fragrance. The texture is thick because thin did not help.',
      'It went on sale eighteen months later, unchanged, because enough people asked. It remains the only product in the house that was finished before anyone decided to sell it.',
    ],
  },
  {
    slug: 'the-case-for-an-empty-frame',
    title: 'The case for an empty frame',
    dek: 'On restraint, negative space, and why one highlight beats six.',
    painting: 'pearl-earring',
    category: 'Method',
    date: '2026-05-22',
    read: '4 min',
    body: [
      'In a certain Dutch portrait, the pearl is two strokes of lead white. Not a rendering of a pearl — two strokes, correctly placed, on a dark ground.',
      'It works because everything around it is withheld. The turban has no detail to speak of. The background is nothing at all. The entire canvas is arranged so that two marks can carry it.',
      'Most highlighting advice is additive: more points of light, more dimension. The opposite instruction is harder and better. Place one highlight where the bone actually is, and leave the rest of the face alone.',
    ],
  },
];

export const getEntry = (slug: string) => JOURNAL.find((e) => e.slug === slug);
