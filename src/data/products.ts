/**
 * Fictional catalogue for the Atelier Étoile demo.
 *
 * Every name, price, rating, review and ingredient below is invented for this
 * project. Nothing here describes a real product or a real company.
 */

export type Category =
  | 'Skincare'
  | 'Makeup'
  | 'Fragrance'
  | 'Lip Care'
  | 'Eye Makeup'
  | 'Face'
  | 'Brushes'
  | 'Gift Sets';

export const CATEGORIES: Category[] = [
  'Skincare',
  'Makeup',
  'Fragrance',
  'Lip Care',
  'Eye Makeup',
  'Face',
  'Brushes',
  'Gift Sets',
];

/** Which generated 3D vessel a product is presented in. */
export type Vessel =
  | 'flacon'
  | 'lipstick'
  | 'dropper'
  | 'jar'
  | 'palette'
  | 'brush'
  | 'tube'
  | 'compact'
  | 'coffret';

export interface Variant {
  name: string;
  hex: string;
}

export interface Review {
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  collection: string;
  /** Generated painting this product's presentation is keyed to. */
  painting: string;
  vessel: Vessel;
  /** Two-tone base for the generated vessel. */
  hue: [string, string];
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  size: string;
  description: string;
  story: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  variants: Variant[];
  reviews: Review[];
  tags: string[];
  featured?: boolean;
}

const rv = (author: string, city: string, rating: number, date: string, title: string, body: string): Review => ({
  author,
  city,
  rating,
  date,
  title,
  body,
});

export const PRODUCTS: Product[] = [
  {
    id: 'nocturne-elixir',
    name: 'Nocturne Élixir',
    subtitle: 'Midnight Restorative Serum',
    category: 'Skincare',
    collection: 'Nocturne',
    painting: 'starry-night',
    vessel: 'dropper',
    hue: ['#1b3a8c', '#0b1026'],
    price: 168,
    originalPrice: 210,
    rating: 4.9,
    reviewCount: 1284,
    stock: 23,
    size: '30 ml',
    description:
      'A weightless night serum the colour of a cobalt sky. Applied last in the evening, it works while the rest of you does nothing at all.',
    story:
      'Our formulator spent a winter trying to bottle the particular blue of a sky painted at two in the morning. The eleventh attempt held — a cobalt so deep it reads almost black until light catches the flacon.',
    benefits: [
      'Visibly smoother texture by the fourth morning',
      'Restores overnight moisture reservoir',
      'Softens the look of fine lines around the eye',
      'Absorbs in under forty seconds — no pilling under cream',
    ],
    ingredients: [
      'Aqua / Water',
      'Glycerin',
      'Bakuchiol (0.5%)',
      'Sodium Hyaluronate (3 weights)',
      'Blue Tansy Flower Oil',
      'Niacinamide',
      'Squalane (olive-derived)',
      'Tocopherol',
    ],
    usage: 'Four drops to a clean, slightly damp face each evening. Press, do not rub. Follow with a cream if your skin asks for one.',
    variants: [
      { name: 'Original Cobalt', hex: '#1b3a8c' },
      { name: 'Étoile Gold Edition', hex: '#e3b23c' },
    ],
    reviews: [
      rv('Camille R.', 'Lyon', 5, '2026-08-02', 'The fourth morning is real', 'I did not expect a serum to make me look rested. It did, and it kept doing it.'),
      rv('Yuki T.', 'Kyoto', 5, '2026-07-21', 'Bottle belongs on the shelf', 'The glass is absurdly beautiful. The formula earns its place next to it.'),
      rv('Noor A.', 'Amsterdam', 4, '2026-06-30', 'Lovely, slow', 'Takes a few weeks. Worth the patience, though I wish the dropper were longer.'),
    ],
    tags: ['bestseller', 'night'],
    featured: true,
  },
  {
    id: 'solaire-palette',
    name: 'Solaire',
    subtitle: 'Twelve-Pan Eyeshadow Atelier',
    category: 'Eye Makeup',
    collection: 'Solaire',
    painting: 'sunflowers',
    vessel: 'palette',
    hue: ['#e3b23c', '#8c6b31'],
    price: 96,
    originalPrice: 128,
    rating: 4.8,
    reviewCount: 2140,
    stock: 41,
    size: '12 × 1.1 g',
    description:
      'Twelve golds, no two the same temperature — from raw seed-brown to full noon. Pressed with silk powder so they blend with a fingertip.',
    story:
      'Sampled stroke by stroke from a generated sunflower canvas: every pan corresponds to one region of the painting, ordered from the shadowed centre of the flower outward to the brightest petal tip.',
    benefits: [
      'Buildable from a whisper to full pigment',
      'Silk-powder base — blends without brushes',
      'Six mattes, four satins, two foils',
      'Magnetic pans, refillable individually',
    ],
    ingredients: ['Mica', 'Talc-free Silica Base', 'Boron Nitride', 'Silk Powder', 'Jojoba Esters', 'Iron Oxides', 'Titanium Dioxide'],
    usage: 'Work from the outer pans inward. The two foils are for the inner corner only — a little goes an unreasonably long way.',
    variants: [
      { name: 'Champ d’Or', hex: '#e3b23c' },
      { name: 'Terre Brûlée', hex: '#8c6b31' },
      { name: 'Ochre Pâle', hex: '#d9c07a' },
    ],
    reviews: [
      rv('Priya S.', 'Mumbai', 5, '2026-08-14', 'Twelve genuinely different golds', 'I own four gold palettes. This is the only one where I use every pan.'),
      rv('Elena M.', 'Milan', 5, '2026-07-02', 'The foils', 'The two foils alone justify the price. Unreal shine, zero fallout.'),
      rv('Grace O.', 'Lagos', 4, '2026-05-19', 'Beautiful, heavy', 'Gorgeous object. Too heavy for travel, which is my only complaint.'),
    ],
    tags: ['bestseller', 'refillable'],
    featured: true,
  },
  {
    id: 'iris-nuit',
    name: 'Iris Nuit',
    subtitle: 'Eau de Parfum',
    category: 'Fragrance',
    collection: 'Nocturne',
    painting: 'irises',
    vessel: 'flacon',
    hue: ['#6c5cc0', '#241a2e'],
    price: 245,
    originalPrice: 245,
    rating: 4.7,
    reviewCount: 863,
    stock: 12,
    size: '75 ml',
    description:
      'Orris root, violet leaf and a long, dry cedar drydown. A violet that refuses to be sweet.',
    story:
      'Built around the single white bloom that breaks the violet field. The fragrance does the same thing: forty minutes in, one bright green note steps out of an otherwise powdery composition.',
    benefits: ['Eight to ten hours on skin', 'Orris butter at 4% — unusually high', 'No synthetic musk fixative', 'Refillable flacon'],
    ingredients: ['Alcohol Denat.', 'Parfum (Orris Butter, Violet Leaf Absolute, Iris Pallida)', 'Virginia Cedarwood', 'Ambrette Seed', 'Aqua'],
    usage: 'One press at the base of the throat, one on the inner wrist. Do not rub the wrists together — it bruises the top notes.',
    variants: [
      { name: '50 ml', hex: '#6c5cc0' },
      { name: '75 ml', hex: '#4c3f8f' },
      { name: '100 ml Coffret', hex: '#241a2e' },
    ],
    reviews: [
      rv('Sofia L.', 'Lisbon', 5, '2026-08-09', 'Finally a dry violet', 'Every other iris I own turns to candy by hour two. Not this one.'),
      rv('Thomas B.', 'Copenhagen', 4, '2026-06-11', 'Excellent, quiet', 'Closer to a skin scent than the notes suggest. I like that; some will not.'),
    ],
    tags: ['limited'],
    featured: true,
  },
  {
    id: 'terrasse-lip',
    name: 'Terrasse',
    subtitle: 'Satin Lip Colour',
    category: 'Lip Care',
    collection: 'Lamplight',
    painting: 'cafe-terrace',
    vessel: 'lipstick',
    hue: ['#c94f3a', '#e8b53e'],
    price: 58,
    originalPrice: 74,
    rating: 4.8,
    reviewCount: 3106,
    stock: 87,
    size: '3.4 g',
    description:
      'A warm, lamplit red in a brushed-brass bullet. Satin, not matte — it keeps lips looking like lips.',
    story:
      'Matched to the pool of gaslight on a café terrace at 2400 Kelvin. The shade shifts slightly warmer under candlelight, which was the entire point.',
    benefits: ['Eight-hour satin wear', 'Castor-free, so no sting', 'Refillable brass bullet', 'Six shades, one finish'],
    ingredients: ['Hydrogenated Polyisobutene', 'Candelilla Wax', 'Shea Butter', 'Squalane', 'Iron Oxides', 'Carmine-free Red 7 Lake', 'Tocopherol'],
    usage: 'Straight from the bullet for full colour, or tapped on with a fingertip for a stain. Blot once, reapply — it sets better in two layers.',
    variants: [
      { name: 'Gaslight', hex: '#c94f3a' },
      { name: 'Awning', hex: '#e8b53e' },
      { name: 'Cobblestone', hex: '#9c6a4e' },
      { name: 'Terrace Rose', hex: '#c9737b' },
      { name: 'Midnight Plum', hex: '#6b3450' },
      { name: 'Café Noir', hex: '#5a2f28' },
    ],
    reviews: [
      rv('Ama D.', 'Accra', 5, '2026-08-22', 'Gaslight is perfect', 'Warm red that does not go orange on me. Rare.'),
      rv('Julia W.', 'Berlin', 5, '2026-07-28', 'No sting', 'Castor oil wrecks my lips. This is the first red I can wear all day.'),
      rv('Meera K.', 'Toronto', 4, '2026-07-04', 'Wish it were matte', 'Colour is gorgeous. I just prefer a flatter finish.'),
    ],
    tags: ['bestseller', 'refillable'],
    featured: true,
  },
  {
    id: 'mistral-highlighter',
    name: 'Mistral',
    subtitle: 'Liquid Light Highlighter',
    category: 'Face',
    collection: 'Champ',
    painting: 'wheatfield',
    vessel: 'dropper',
    hue: ['#f2c14e', '#c0902a'],
    price: 72,
    originalPrice: 88,
    rating: 4.6,
    reviewCount: 1519,
    stock: 54,
    size: '20 ml',
    description: 'A liquid highlight with the restless shimmer of wind across a wheatfield. No glitter, no grit — only movement.',
    story:
      'The shimmer comes from a very fine mica suspended in a fluid base, so it catches light differently as you turn. Under a still camera it is subtle; in a room, it moves.',
    benefits: ['Mixes into foundation for an all-over glow', 'Fine mica — never glittery', 'Buildable without patchiness', 'Works on bare skin'],
    ingredients: ['Aqua', 'Glycerin', 'Synthetic Fluorphlogopite', 'Dimethicone', 'Mica', 'Sodium Hyaluronate', 'Pentylene Glycol'],
    usage: 'Two drops on the high points of the cheek, or one drop mixed into foundation for the whole face.',
    variants: [
      { name: 'Champ d’Or', hex: '#f2c14e' },
      { name: 'Cypress Silver', hex: '#c8cfd4' },
      { name: 'Terre Rose', hex: '#e0a58e' },
    ],
    reviews: [
      rv('Lina H.', 'Stockholm', 5, '2026-08-01', 'Moves in the light', 'It genuinely changes as you turn your head. Nothing else I own does this.'),
      rv('Rosa P.', 'Mexico City', 4, '2026-06-15', 'Small bottle', 'Love it, but 20ml disappears fast when you mix it into foundation.'),
    ],
    tags: ['new'],
  },
  {
    id: 'amande-cream',
    name: 'Amande',
    subtitle: 'Barrier Repair Cream',
    category: 'Skincare',
    collection: 'Amande',
    painting: 'almond-blossom',
    vessel: 'jar',
    hue: ['#7ecfda', '#f4ead7'],
    price: 118,
    originalPrice: 118,
    rating: 4.9,
    reviewCount: 2477,
    stock: 66,
    size: '50 ml',
    description: 'A quiet, thick cream for skin that has had enough. Almond, ceramides, and nothing that stings.',
    story:
      'Made originally as a gift — a small batch for the atelier team through a hard winter. It was never meant to be sold. Enough people asked.',
    benefits: ['Rebuilds a compromised barrier in ~7 nights', 'Fragrance-free, entirely', 'Safe over retinoid nights', 'Non-comedogenic'],
    ingredients: ['Aqua', 'Sweet Almond Oil', 'Ceramide NP / AP / EOP', 'Cholesterol', 'Glycerin', 'Panthenol', 'Colloidal Oatmeal', 'Allantoin'],
    usage: 'A pearl-sized amount, morning or night. On very reactive days, use it alone and skip everything else.',
    variants: [
      { name: '50 ml', hex: '#7ecfda' },
      { name: '100 ml Atelier', hex: '#4ba3b4' },
    ],
    reviews: [
      rv('Hannah G.', 'Dublin', 5, '2026-08-18', 'Rescued my face', 'Overdid tretinoin. Seven nights of this and I was human again.'),
      rv('Wei L.', 'Singapore', 5, '2026-07-12', 'Fragrance-free and means it', 'No hidden "natural fragrance". Thank you.'),
      rv('Farah N.', 'Dubai', 5, '2026-05-30', 'Heavy but worth it', 'Too rich for my summer, perfect for my winter.'),
    ],
    tags: ['bestseller', 'fragrance-free'],
    featured: true,
  },
  {
    id: 'terre-foundation',
    name: 'Terre',
    subtitle: 'Skin-Weight Foundation · 24 Shades',
    category: 'Face',
    collection: 'Portrait',
    painting: 'self-portrait',
    vessel: 'flacon',
    hue: ['#b57c48', '#2f5f68'],
    price: 86,
    originalPrice: 104,
    rating: 4.7,
    reviewCount: 4318,
    stock: 120,
    size: '30 ml',
    description: 'Twenty-four shades built from a portrait study, not a shade wheel. Medium coverage that still looks like skin.',
    story:
      'Instead of starting from a standard shade ladder, our team sampled complexion tones directly from a generated self-portrait — including its greens and violets. Those undertones are why the deeper shades do not go grey.',
    benefits: ['24 shades across 4 undertone families', 'Twelve-hour wear without powder', 'Contains SPF 20', 'Does not oxidise'],
    ingredients: ['Aqua', 'Isododecane', 'Zinc Oxide', 'Glycerin', 'Silica', 'Iron Oxides', 'Squalane', 'Tocopheryl Acetate'],
    usage: 'One pump, pressed in with a damp sponge. Build a second layer only where you want it.',
    variants: [
      { name: '04 Toile', hex: '#f0d4b6' },
      { name: '09 Ocre', hex: '#d9ab7c' },
      { name: '14 Sienne', hex: '#b07f52' },
      { name: '18 Umbre', hex: '#8a5c37' },
      { name: '22 Basalte', hex: '#5d3b23' },
    ],
    reviews: [
      rv('Adaeze U.', 'Abuja', 5, '2026-08-25', '22 Basalte is correct', 'Deep shades with actual warmth in them. It does not turn ashy at hour six.'),
      rv('Claire F.', 'Paris', 4, '2026-07-19', 'Great, slightly dewy', 'Beautiful finish. Oily skin will want powder anyway.'),
    ],
    tags: ['bestseller', 'spf'],
  },
  {
    id: 'maison-brush-set',
    name: 'Maison No. 7',
    subtitle: 'Seven-Brush Atelier Roll',
    category: 'Brushes',
    collection: 'Maison',
    painting: 'bedroom',
    vessel: 'brush',
    hue: ['#c8a22f', '#6b4423'],
    price: 210,
    originalPrice: 265,
    rating: 4.9,
    reviewCount: 742,
    stock: 18,
    size: '7 pieces + linen roll',
    description: 'Seven brushes with pear-wood handles and synthetic fibre cut at a taper, in a hand-stitched linen roll.',
    story:
      'The handles are turned from the same pear wood used for the chairs in a small yellow room we keep a print of above the workshop bench. Each one is finished by hand and slightly different.',
    benefits: ['Vegan taklon fibre, densely packed', 'Pear-wood handles, hand-finished', 'Washable linen roll included', 'Ten-year replacement on the ferrule'],
    ingredients: ['Taklon Fibre', 'Pear Wood', 'Brass Ferrule', 'Linen (Belgian)'],
    usage: 'Wash weekly in lukewarm water with a drop of mild soap, reshape, and dry bristles-down. Never stand them wet in a jar.',
    variants: [
      { name: 'Natural Pear', hex: '#c8a22f' },
      { name: 'Ebonised', hex: '#2c2118' },
    ],
    reviews: [
      rv('Isabelle D.', 'Montréal', 5, '2026-08-05', 'The roll alone', 'Gorgeous set. The linen roll is the nicest I have owned.'),
      rv('Kenji M.', 'Osaka', 5, '2026-06-22', 'Dense and soft', 'No shedding after four months of weekly washing.'),
    ],
    tags: ['limited'],
  },
  {
    id: 'voile-powder',
    name: 'Voile',
    subtitle: 'Sfumato Finishing Powder',
    category: 'Face',
    collection: 'Portrait',
    painting: 'mona-lisa',
    vessel: 'compact',
    hue: ['#c9aa6c', '#2b2416'],
    price: 64,
    originalPrice: 64,
    rating: 4.5,
    reviewCount: 1893,
    stock: 73,
    size: '8 g',
    description: 'A translucent powder ground so fine it blurs an edge rather than covering it. Named for the technique that means "vanished like smoke".',
    story:
      'The benchmark was a five-hundred-year-old transition between cheek and shadow with no visible line anywhere in it. We got within about ninety percent, which we consider a good outcome.',
    benefits: ['Blurs pores without flashback', 'Photographs invisibly, including with flash', 'Not drying — 12% squalane-coated', 'One universal shade'],
    ingredients: ['Silica', 'Boron Nitride', 'Squalane', 'Mica', 'Zinc Stearate', 'Lauroyl Lysine'],
    usage: 'Press — never sweep — into the T-zone with the puff. Sweeping is what makes powder look like powder.',
    variants: [{ name: 'Universal Translucent', hex: '#e8dcc4' }],
    reviews: [
      rv('Tess V.', 'Rotterdam', 5, '2026-08-11', 'No flashback at all', 'Tested it under direct flash. Nothing. Genuinely translucent.'),
      rv('Bea C.', 'Manila', 4, '2026-06-08', 'Small pan', '8g goes quickly if you set your whole face.'),
    ],
    tags: ['new'],
  },
  {
    id: 'naissance-blush',
    name: 'Naissance',
    subtitle: 'Cream Blush',
    category: 'Makeup',
    collection: 'Naissance',
    painting: 'venus',
    vessel: 'compact',
    hue: ['#e8b7b0', '#c98d86'],
    price: 52,
    originalPrice: 68,
    rating: 4.8,
    reviewCount: 2655,
    stock: 91,
    size: '5 g',
    description: 'A cream blush the exact flush of a shell at dawn. Sheer, warm, and impossible to over-apply.',
    story: 'Sampled from the inner curve of a generated scallop shell, where the pink is at its most uncertain — neither coral nor rose.',
    benefits: ['Melts into skin, no edges', 'Works over powder without patching', 'Buildable to a full stain', 'Doubles as a lip tint'],
    ingredients: ['Caprylic/Capric Triglyceride', 'Ozokerite', 'Shea Butter', 'Mica', 'Iron Oxides', 'Vitamin E'],
    usage: 'Two taps with a warm fingertip, high on the cheek. Blend with the heel of your palm, not a brush.',
    variants: [
      { name: 'Aube', hex: '#e8b7b0' },
      { name: 'Coquille', hex: '#dd9e94' },
      { name: 'Zéphyr', hex: '#c9737b' },
      { name: 'Vénus', hex: '#b5606b' },
    ],
    reviews: [
      rv('Marta K.', 'Kraków', 5, '2026-08-20', 'Aube is my skin, better', 'The "your skin but you slept" blush people talk about. This is it.'),
      rv('Nina J.', 'Cape Town', 5, '2026-07-09', 'Over powder, fine', 'Most cream blushes drag over powder. This one does not.'),
    ],
    tags: ['bestseller'],
    featured: true,
  },
  {
    id: 'perle-illuminator',
    name: 'Perle',
    subtitle: 'Single-Point Illuminator',
    category: 'Face',
    collection: 'Vermeer',
    painting: 'pearl-earring',
    vessel: 'tube',
    hue: ['#d8dfe4', '#59636b'],
    price: 68,
    originalPrice: 82,
    rating: 4.7,
    reviewCount: 1176,
    stock: 38,
    size: '15 ml',
    description: 'One highlight, placed correctly, is worth six. A cool pearl cream in a slim brushed tube.',
    story:
      'Two strokes of lead white make an entire pearl convincing in a painting we all know. The formula is built on the same restraint — a single point of light, not an all-over sheen.',
    benefits: ['Cool pearl, no gold shift', 'Cream-to-skin, never sits on top', 'One dot is genuinely enough', 'Layers under or over foundation'],
    ingredients: ['Aqua', 'Dimethicone', 'Mica', 'Glycerin', 'Boron Nitride', 'Pentylene Glycol', 'Sodium Hyaluronate'],
    usage: 'One dot at the highest point of the cheekbone and one on the cupid’s bow. Stop there.',
    variants: [
      { name: 'Perle Froide', hex: '#d8dfe4' },
      { name: 'Perle Chaude', hex: '#e8d6b4' },
    ],
    reviews: [
      rv('Ines B.', 'Barcelona', 5, '2026-08-07', 'Cool-toned and it stays cool', 'Most "pearl" highlighters go yellow on me. Not this.'),
    ],
    tags: ['new'],
  },
  {
    id: 'clair-obscur-liner',
    name: 'Clair-Obscur',
    subtitle: 'Precision Gel Liner',
    category: 'Eye Makeup',
    collection: 'Rembrandt',
    painting: 'night-watch',
    vessel: 'tube',
    hue: ['#120c05', '#f2d493'],
    price: 44,
    originalPrice: 44,
    rating: 4.9,
    reviewCount: 3872,
    stock: 140,
    size: '1.2 ml',
    description: 'The blackest black in the house, in a 0.4 mm brush tip. Waterproof, and it does not transfer to the lid.',
    story:
      'Chiaroscuro works by withholding: most of the canvas stays dark so a little of it can blaze. This liner exists so the rest of an eye look has something to be measured against.',
    benefits: ['0.4 mm tip — hairline to full wing', 'Waterproof, transfer-proof for 14 hours', 'Removes with warm water and oil', 'Genuinely opaque in one pass'],
    ingredients: ['Aqua', 'Acrylates Copolymer', 'Carbon Black (CI 77266)', 'Butylene Glycol', 'Panthenol'],
    usage: 'Short connected dashes along the lash line, then one continuous pass to join them. A wing needs a flat surface — rest your elbow.',
    variants: [
      { name: 'Noir Absolu', hex: '#0a0a0c' },
      { name: 'Umbre', hex: '#4a3418' },
      { name: 'Cobalt Profond', hex: '#1b3a8c' },
    ],
    reviews: [
      rv('Sara E.', 'Istanbul', 5, '2026-08-27', 'Genuinely does not budge', 'Fourteen hours, a gym session, still perfect.'),
      rv('Lucía A.', 'Bogotá', 5, '2026-07-16', 'The tip', 'Thinnest tip I have used that still delivers full black in one pass.'),
    ],
    tags: ['bestseller'],
  },
  {
    id: 'nymphea-gel',
    name: 'Nymphéa',
    subtitle: 'Weightless Gel-Cream',
    category: 'Skincare',
    collection: 'Monet',
    painting: 'water-lilies',
    vessel: 'jar',
    hue: ['#8fc7bf', '#274b5a'],
    price: 94,
    originalPrice: 112,
    rating: 4.6,
    reviewCount: 1602,
    stock: 58,
    size: '50 ml',
    description: 'A gel-cream with no visible edge — it disappears into skin the way a lily pond has no horizon.',
    story: 'A painting made entirely of surface, with no sky and no ground to orient you. The formula behaves the same way: you cannot feel where it ends.',
    benefits: ['Oil-free, gel-to-water finish', 'Holds hydration 12 hours', 'Sits invisibly under makeup', 'Good in humidity'],
    ingredients: ['Aqua', 'Glycerin', 'Sodium Hyaluronate', 'Beta-Glucan', 'Nymphaea Alba Flower Extract', 'Allantoin', 'Panthenol'],
    usage: 'Morning, on damp skin, before SPF. Half a fingertip is plenty.',
    variants: [{ name: '50 ml', hex: '#8fc7bf' }],
    reviews: [
      rv('Mei C.', 'Taipei', 5, '2026-08-03', 'Survives humidity', 'Only moisturiser I can wear here in August.'),
      rv('Otto R.', 'Vienna', 4, '2026-06-27', 'Too light for winter', 'Perfect June through September. I switch to Amande after that.'),
    ],
    tags: ['fragrance-free'],
  },
  {
    id: 'aurore-lip-oil',
    name: 'Aurore',
    subtitle: 'Glazed Lip Oil',
    category: 'Lip Care',
    collection: 'Monet',
    painting: 'sunrise',
    vessel: 'lipstick',
    hue: ['#ff8f2e', '#6b7b92'],
    price: 38,
    originalPrice: 48,
    rating: 4.7,
    reviewCount: 4507,
    stock: 160,
    size: '6 ml',
    description: 'A sheer, warm lip oil that reads brighter than it is — because everything around it is grey.',
    story:
      'The sun in a certain harbour painting is not actually a brilliant colour; it only appears brilliant because the mist around it is so desaturated. This oil uses the same trick on a face.',
    benefits: ['Non-sticky, genuinely', 'Plumps slightly without tingle', 'Sheer wash of warm colour', 'Doubles as an overnight mask'],
    ingredients: ['Hydrogenated Polyisobutene', 'Jojoba Oil', 'Sea Buckthorn Oil', 'Vitamin E', 'Iron Oxides', 'Peppermint-free'],
    usage: 'Wherever, whenever. Reapply as often as you like — it is a treatment first.',
    variants: [
      { name: 'Aurore', hex: '#ff8f2e' },
      { name: 'Brume', hex: '#d9a9a0' },
      { name: 'Claire', hex: '#f0d0c0' },
      { name: 'Havre', hex: '#c2705a' },
    ],
    reviews: [
      rv('Zoe P.', 'Auckland', 5, '2026-08-29', 'Not sticky. At all.', 'I have tried every lip oil. This is the only non-sticky one.'),
      rv('Dani R.', 'Tel Aviv', 5, '2026-07-25', 'Overnight use', 'Wake up with soft lips. Also the applicator is nice and flat.'),
    ],
    tags: ['bestseller', 'new'],
  },
  {
    id: 'byzance-foil',
    name: 'Byzance',
    subtitle: 'Gold Leaf Eye Foil',
    category: 'Eye Makeup',
    collection: 'Klimt',
    painting: 'the-kiss',
    vessel: 'tube',
    hue: ['#f2c14e', '#8a6520'],
    price: 56,
    originalPrice: 70,
    rating: 4.8,
    reviewCount: 934,
    stock: 27,
    size: '4 ml',
    description: 'A mica-and-silk suspension that dries to the slightly granular shine of real gold leaf.',
    story:
      'Gold leaf laid over oil paint has a specific quality: not smooth, not glittery — faintly textured, the way beaten metal is. Reproducing that took the formulation team eleven months.',
    benefits: ['Real leaf texture, no fallout', 'Dries in 20 seconds, stays put', 'Layers over any shadow', 'Removes with micellar water'],
    ingredients: ['Aqua', 'Synthetic Fluorphlogopite', 'Silk Amino Acids', 'Acrylates Copolymer', 'Glycerin', 'Mica'],
    usage: 'Pat on with a flat fingertip over the centre of the lid. Do not blend — the whole point is the edge.',
    variants: [
      { name: 'Feuille d’Or', hex: '#f2c14e' },
      { name: 'Bronze Ancien', hex: '#8a6520' },
      { name: 'Argent', hex: '#c8cfd4' },
    ],
    reviews: [
      rv('Ruth A.', 'Nairobi', 5, '2026-08-16', 'Actual leaf texture', 'It looks like foil, not glitter. Enormous difference.'),
    ],
    tags: ['limited', 'new'],
  },
  {
    id: 'fresque-primer',
    name: 'Fresque',
    subtitle: 'Wet-Plaster Grip Primer',
    category: 'Face',
    collection: 'Fresque',
    painting: 'creation',
    vessel: 'tube',
    hue: ['#e8d6b4', '#9c8c6d'],
    price: 54,
    originalPrice: 54,
    rating: 4.4,
    reviewCount: 1088,
    stock: 64,
    size: '30 ml',
    description: 'A grip primer that makes foundation set the way pigment sets into wet plaster — permanently, and immediately.',
    story:
      'Fresco allows no corrections: the pigment binds as the plaster cures, and that is the end of it. We took that as a design brief rather than a warning.',
    benefits: ['Doubles foundation wear time', 'Blurs texture without silicone slip', 'No pilling under or over', 'Matte-leaning, not flat'],
    ingredients: ['Aqua', 'Silica', 'Glycerin', 'Acrylates Copolymer', 'Calcium Hydroxide (trace)', 'Panthenol', 'Zinc PCA'],
    usage: 'A thin layer where you need grip — usually just the T-zone. Wait thirty seconds before foundation.',
    variants: [{ name: 'Universal', hex: '#e8d6b4' }],
    reviews: [
      rv('Ayla K.', 'Ankara', 4, '2026-07-31', 'Works, slightly drying', 'Wear time genuinely doubled. I use it only on the T-zone now.'),
    ],
    tags: [],
  },
  {
    id: 'regard-mascara',
    name: 'Regard',
    subtitle: 'Direct-Gaze Volume Mascara',
    category: 'Eye Makeup',
    collection: 'Manet',
    painting: 'olympia',
    vessel: 'tube',
    hue: ['#0a0a0c', '#efe7d6'],
    price: 46,
    originalPrice: 58,
    rating: 4.6,
    reviewCount: 5241,
    stock: 210,
    size: '10 ml',
    description: 'Volume without clumps, in a tapered hourglass brush. Holds a curl for fourteen hours.',
    story:
      'Named for a painting that scandalised a salon simply by looking straight back at the viewer. Every campaign we shoot is framed the same way: eyes level with the lens.',
    benefits: ['Fourteen-hour curl hold', 'Buildable to four coats, no clumps', 'Tubing formula — slides off with warm water', 'Ophthalmologist-tested'],
    ingredients: ['Aqua', 'Acrylates Copolymer', 'Beeswax-free Synthetic Wax', 'Carbon Black', 'Panthenol', 'Glycerin'],
    usage: 'Wiggle at the root, then pull through. A second coat while the first is still tacky is the whole technique.',
    variants: [
      { name: 'Noir', hex: '#0a0a0c' },
      { name: 'Brun Profond', hex: '#3a2415' },
    ],
    reviews: [
      rv('Kara N.', 'Chicago', 5, '2026-08-19', 'Tubing done right', 'Comes off in tidy tubes with warm water. No raccoon eyes, ever.'),
      rv('Pilar S.', 'Seville', 4, '2026-06-02', 'Great, not waterproof', 'It is tubing, so rain is fine but swimming is not. Worth knowing.'),
    ],
    tags: ['bestseller'],
  },
  {
    id: 'refectoire-coffret',
    name: 'Réfectoire',
    subtitle: 'The Long Table Coffret',
    category: 'Gift Sets',
    collection: 'Maison',
    painting: 'last-supper',
    vessel: 'coffret',
    hue: ['#b3c6d4', '#2a251c'],
    price: 320,
    originalPrice: 448,
    rating: 4.9,
    reviewCount: 411,
    stock: 9,
    size: '6 pieces',
    description: 'Six pieces laid out in a linen-lined case like places at a long table. Our most complete introduction to the house.',
    story:
      'Composition as argument: one vanishing point, and everything in the room pointing at it. The coffret is arranged the same way, with the Nocturne Élixir at the centre.',
    benefits: ['Save 29% against buying separately', 'Linen-lined keepsake case', 'Includes two full sizes', 'Hand-numbered, 900 made'],
    ingredients: ['See individual products'],
    usage: 'Open at the centre and work outward. There is no wrong order, but that one is nicest.',
    variants: [
      { name: 'Linen', hex: '#e8dcae' },
      { name: 'Midnight', hex: '#0b1026' },
    ],
    reviews: [
      rv('Beatrix H.', 'Zürich', 5, '2026-08-12', 'Gave one, kept one', 'Bought it as a gift and immediately ordered a second for myself.'),
      rv('Omar F.', 'Casablanca', 5, '2026-07-06', 'The case', 'The linen case is genuinely keepsake quality. Not filler packaging.'),
    ],
    tags: ['limited', 'value'],
    featured: true,
  },
  {
    id: 'cypres-mask',
    name: 'Cyprès',
    subtitle: 'Green Clay Resurfacing Mask',
    category: 'Skincare',
    collection: 'Champ',
    painting: 'wheatfield',
    vessel: 'jar',
    hue: ['#6b7a4b', '#2f5623'],
    price: 78,
    originalPrice: 92,
    rating: 4.5,
    reviewCount: 1327,
    stock: 45,
    size: '75 ml',
    description: 'A green clay mask with 5% lactic acid. Ten minutes, once a week, and skin looks redrawn.',
    story: 'Named for the dark flame-shaped trees that hold the edge of a wheatfield together — the structural element in an otherwise restless composition.',
    benefits: ['5% lactic acid, pH 3.8', 'Does not set hard or crack', 'Visible smoothing after one use', 'Draws out congestion without stripping'],
    ingredients: ['Kaolin', 'French Green Clay', 'Lactic Acid (5%)', 'Glycerin', 'Cypress Leaf Extract', 'Allantoin', 'Squalane'],
    usage: 'A thin, even layer for ten minutes — not until it cracks. Rinse with lukewarm water. Once weekly, at most twice.',
    variants: [{ name: '75 ml', hex: '#6b7a4b' }],
    reviews: [
      rv('Ingrid L.', 'Oslo', 5, '2026-08-08', 'Does not crack', 'Stays creamy the whole ten minutes, which is why it does not strip.'),
      rv('Talia M.', 'Melbourne', 4, '2026-05-14', 'Strong', 'Once a week is genuinely the limit for me. Powerful stuff.'),
    ],
    tags: [],
  },
  {
    id: 'chambre-balm',
    name: 'Chambre',
    subtitle: 'Overnight Sleeping Balm',
    category: 'Skincare',
    collection: 'Maison',
    painting: 'bedroom',
    vessel: 'jar',
    hue: ['#e3b23c', '#8fb0bf'],
    price: 102,
    originalPrice: 102,
    rating: 4.8,
    reviewCount: 1755,
    stock: 52,
    size: '60 ml',
    description: 'A balm that melts to an oil on contact and re-sets as a breathable film. The last step of a slow evening.',
    story: 'Made for the hour after the lamp goes out in a small yellow room with crooked walls. Everything about it is designed to be applied in low light, half asleep.',
    benefits: ['Melts on contact, never greasy', 'Breathable occlusive film', 'Pillow-safe in 90 seconds', 'Softens texture overnight'],
    ingredients: ['Squalane', 'Shea Butter', 'Rosehip Oil', 'Ceramide NP', 'Beeswax', 'Bisabolol', 'Tocopherol'],
    usage: 'Warm a small amount between the palms, then press over the whole face as the last step. Ninety seconds before your pillow.',
    variants: [{ name: '60 ml', hex: '#e3b23c' }],
    reviews: [
      rv('Sanne V.', 'Utrecht', 5, '2026-08-24', 'Pillow-safe, true', 'Genuinely sinks in. My linens are fine.'),
    ],
    tags: ['night'],
  },
  {
    id: 'etoile-flacon-rechargeable',
    name: 'Étoile',
    subtitle: 'Refillable Crystal Flacon',
    category: 'Fragrance',
    collection: 'Nocturne',
    painting: 'starry-night',
    vessel: 'flacon',
    hue: ['#2a5fd7', '#e3b23c'],
    price: 180,
    originalPrice: 180,
    rating: 4.9,
    reviewCount: 388,
    stock: 15,
    size: '100 ml, empty',
    description: 'A hand-blown crystal flacon with a gilded collar, made to be filled and refilled for the rest of your life.',
    story:
      'Each flacon is blown with a slight internal swirl, so the fragrance inside appears to move even when it is still. No two are identical, and the imperfections are the point.',
    benefits: ['Hand-blown, each one unique', 'Gilded brass collar and pump', 'Refill with any Étoile eau de parfum', 'Engraving available at the atelier'],
    ingredients: ['Lead-free Crystal', 'Gilded Brass', 'Recyclable Pump Assembly'],
    usage: 'Unscrew the collar, decant, replace. Rinse with warm water between fragrances and dry fully before refilling.',
    variants: [
      { name: 'Cobalt Swirl', hex: '#2a5fd7' },
      { name: 'Clear with Gold', hex: '#e3b23c' },
      { name: 'Smoked Midnight', hex: '#0b1026' },
    ],
    reviews: [
      rv('Vera T.', 'Prague', 5, '2026-08-13', 'An object', 'Beautiful. I bought it as a decanter and now it lives on my desk.'),
    ],
    tags: ['limited', 'refillable'],
  },
  {
    id: 'salon-gift-set',
    name: 'Le Petit Salon',
    subtitle: 'Discovery Coffret',
    category: 'Gift Sets',
    collection: 'Naissance',
    painting: 'venus',
    vessel: 'coffret',
    hue: ['#e8c9a0', '#6f96a0'],
    price: 145,
    originalPrice: 196,
    rating: 4.7,
    reviewCount: 967,
    stock: 34,
    size: '4 pieces',
    description: 'Four travel sizes in a shell-pink case — the shortest honest route into the house.',
    story: 'Arrival, at a smaller scale. Built for someone who has not met the brand yet and would rather not commit to a full-size anything.',
    benefits: ['Save 26%', 'All four in cabin-legal sizes', 'Redeemable against a full size', 'Ships in recycled moulded pulp'],
    ingredients: ['See individual products'],
    usage: 'Start with the serum, end with the lip oil. Two weeks is enough to know.',
    variants: [{ name: 'Coquille', hex: '#e8c9a0' }],
    reviews: [
      rv('Jonah W.', 'Bristol', 5, '2026-08-06', 'Perfect gift', 'Bought three of these at Christmas. All three landed.'),
    ],
    tags: ['value'],
  },
  {
    id: 'pigment-brush-duo',
    name: 'Pinceau Duo',
    subtitle: 'Foil & Blend Brush Pair',
    category: 'Brushes',
    collection: 'Klimt',
    painting: 'the-kiss',
    vessel: 'brush',
    hue: ['#f2c14e', '#3d2c0c'],
    price: 74,
    originalPrice: 88,
    rating: 4.6,
    reviewCount: 523,
    stock: 48,
    size: '2 pieces',
    description: 'One flat paddle for laying foil, one tapered dome for erasing the edge. The only two eye brushes most people need.',
    story: 'Gold leaf is applied with a flat, dry, slightly stiff tool — pressed, never dragged. The paddle in this pair is cut to the same specification.',
    benefits: ['Flat paddle presses foil without scattering', 'Dome blends in eight strokes or fewer', 'Vegan fibre, no shedding', 'Gilded ferrules'],
    ingredients: ['Taklon Fibre', 'Birch Handle', 'Gilded Aluminium Ferrule'],
    usage: 'Paddle first, dome second, and never the other way around.',
    variants: [{ name: 'Gilded', hex: '#f2c14e' }],
    reviews: [
      rv('Hyun J.', 'Seoul', 5, '2026-07-22', 'The paddle is the thing', 'Made Byzance twice as easy to apply. Should be sold together.'),
    ],
    tags: [],
  },
  {
    id: 'compagnie-bronzer',
    name: 'Compagnie',
    subtitle: 'Sculpting Cream Bronzer',
    category: 'Makeup',
    collection: 'Rembrandt',
    painting: 'night-watch',
    vessel: 'compact',
    hue: ['#8c6b31', '#241a0c'],
    price: 62,
    originalPrice: 78,
    rating: 4.7,
    reviewCount: 1412,
    stock: 71,
    size: '9 g',
    description: 'A cream bronzer with a true cool-neutral base — for shadow, not for tan.',
    story: 'Most of a Rembrandt canvas is withheld so that a small part of it can blaze. A bronzer works the same way: it is the darkness that makes a highlight legible.',
    benefits: ['Cool-neutral, reads as shadow', 'Cream-to-powder, no muddiness', 'Four depths', 'Blends with fingers or a dome brush'],
    ingredients: ['Caprylic/Capric Triglyceride', 'Ozokerite', 'Mica', 'Iron Oxides', 'Squalane', 'Vitamin E'],
    usage: 'A light pass under the cheekbone and along the hairline. Build in the same place rather than extending outward.',
    variants: [
      { name: 'Clair', hex: '#c49a6c' },
      { name: 'Moyen', hex: '#a07545' },
      { name: 'Profond', hex: '#7a5230' },
      { name: 'Très Profond', hex: '#57371e' },
    ],
    reviews: [
      rv('Dalia S.', 'Beirut', 5, '2026-08-21', 'Finally cool-toned', 'Every other bronzer turns me orange. This reads like actual shadow.'),
      rv('Kim E.', 'Vancouver', 4, '2026-06-18', 'Small pan again', 'Great formula, wish it were 12g.'),
    ],
    tags: [],
  },
];

export const COLLECTIONS = Array.from(new Set(PRODUCTS.map((p) => p.collection)));

/** Headline figures, derived rather than written down, so copy cannot drift. */
export const CATALOGUE_SIZE = PRODUCTS.length;
export const AVERAGE_RATING = PRODUCTS.reduce((s, p) => s + p.rating, 0) / PRODUCTS.length;
export const TOTAL_REVIEWS = PRODUCTS.reduce((s, p) => s + p.reviewCount, 0);

export const PRICE_BOUNDS: [number, number] = [
  Math.floor(Math.min(...PRODUCTS.map((p) => p.price)) / 10) * 10,
  Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 10) * 10,
];

export const discountOf = (p: Product) =>
  p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

export const stockLabel = (p: Product) =>
  p.stock === 0 ? 'Sold out' : p.stock < 20 ? `Only ${p.stock} left` : 'In stock';

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const relatedTo = (p: Product, n = 4) =>
  PRODUCTS.filter((x) => x.id !== p.id)
    .map((x) => ({
      x,
      score: (x.collection === p.collection ? 3 : 0) + (x.category === p.category ? 2 : 0) + (x.painting === p.painting ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.x.rating - a.x.rating)
    .slice(0, n)
    .map((s) => s.x);
