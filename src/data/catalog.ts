
export type CategoryId = 'hockey' | 'baseball' | 'apparel' | 'bags' | 'accessories'

export interface Swatch {
  name: string
  color: string
  accent: string
  trim: string
}

export interface Product {
  id: string
  name: string
  category: CategoryId
  /** Base name of the white cutout in public/photos (tinted per swatch at runtime). */
  photo: string
  /** Indicative per-unit price in CAD at 50+ pieces. PLACEHOLDER — confirm with production before launch. */
  price: number
  badge?: string
  blurb: string
  sizes: readonly string[]
  swatches: readonly Swatch[]
  personalise: boolean
}

export const CATEGORIES: readonly { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hockey', label: 'Hockey' },
  { id: 'baseball', label: 'Baseball' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'bags', label: 'Bags' },
  { id: 'accessories', label: 'Accessories' },
]

const ADULT = ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const
const ONE = ['One size'] as const
const SOCK = ['Youth', 'Junior', 'Senior'] as const
const GLOVE = ['12"', '13"', '14"', '15"'] as const

const COBALT: Swatch = { name: 'Cobalt', color: '#2b46f0', accent: '#ffffff', trim: '#0f1012' }
const INK: Swatch = { name: 'Ink', color: '#17181b', accent: '#8296ff', trim: '#2b46f0' }
const CHALK: Swatch = { name: 'Chalk', color: '#e9eaee', accent: '#2b46f0', trim: '#0f1012' }
const RED: Swatch = { name: 'Red', color: '#c2362b', accent: '#ffffff', trim: '#0f1012' }
const FOREST: Swatch = { name: 'Forest', color: '#0f7b59', accent: '#fff1c2', trim: '#0f1012' }
const GOLD: Swatch = { name: 'Gold', color: '#f2b833', accent: '#0f1012', trim: '#17181b' }
const NAVY: Swatch = { name: 'Navy', color: '#1c2a8f', accent: '#fff1c2', trim: '#c2362b' }

export const PRODUCTS: readonly Product[] = [
  {
    id: 'hockey-pro-jersey',
    photo: 'hockey-front',
    name: 'Pro Hockey Jersey',
    category: 'hockey',
    price: 64,
    badge: 'Best seller',
    blurb: 'Stitched twill numbers, lace-up collar and an elongated back with side slits for full mobility.',
    sizes: ADULT,
    swatches: [COBALT, RED, INK, FOREST],
    personalise: true,
  },
  {
    id: 'hockey-sublimated-jersey',
    photo: 'hockey-front',
    name: 'Sublimated Hockey Jersey',
    category: 'hockey',
    price: 52,
    blurb: 'Unlimited colours and full-coverage graphics dyed into the fabric. Never cracks or peels.',
    sizes: ADULT,
    swatches: [NAVY, GOLD, CHALK, COBALT],
    personalise: true,
  },
  {
    id: 'hockey-pant-shell',
    photo: 'pant-shell',
    name: 'Pro Pant Shell',
    category: 'hockey',
    price: 48,
    blurb: 'Durable shell with matching side stripes, built to slide over your existing hockey pants.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    swatches: [INK, COBALT, RED],
    personalise: false,
  },
  {
    id: 'hockey-pro-socks',
    photo: 'socks',
    name: 'Pro Hockey Socks',
    category: 'hockey',
    price: 18,
    blurb: 'Knit or sublimated socks striped to match your jersey, with a reinforced heel.',
    sizes: SOCK,
    swatches: [COBALT, RED, NAVY, FOREST],
    personalise: false,
  },
  {
    id: 'hockey-gloves',
    photo: 'gloves',
    name: 'Custom Hockey Gloves',
    category: 'hockey',
    price: 96,
    badge: 'New',
    blurb: 'Custom-coloured gloves that handle tough games and make your team stand out.',
    sizes: GLOVE,
    swatches: [COBALT, RED, GOLD],
    personalise: false,
  },
  {
    id: 'baseball-pro-jersey',
    photo: 'baseball-front',
    name: 'Pro Baseball Jersey',
    category: 'baseball',
    price: 58,
    badge: 'Best seller',
    blurb: 'Full-button jersey with tackle-twill script, piped sleeves and a breathable mesh body.',
    sizes: ADULT,
    swatches: [CHALK, NAVY, RED, INK],
    personalise: true,
  },
  {
    id: 'baseball-sublimated-jersey',
    photo: 'baseball-front',
    name: 'Sublimated Baseball Jersey',
    category: 'baseball',
    price: 46,
    blurb: 'Lightweight sublimated jersey with your art printed edge to edge.',
    sizes: ADULT,
    swatches: [COBALT, GOLD, FOREST],
    personalise: true,
  },
  {
    id: 'baseball-pro-pants',
    photo: 'baseball-pants',
    name: 'Pro Baseball Pants',
    category: 'baseball',
    price: 42,
    blurb: 'Double-knee pants with team-colour piping and a reinforced belt loop.',
    sizes: ADULT,
    swatches: [CHALK, INK],
    personalise: false,
  },
  {
    id: 'baseball-socks',
    photo: 'socks',
    name: 'Baseball Socks',
    category: 'baseball',
    price: 14,
    blurb: 'Over-the-calf socks in your team colours.',
    sizes: SOCK,
    swatches: [NAVY, RED, CHALK],
    personalise: false,
  },
  {
    id: 'hoodie-embroidered',
    photo: 'hoodie',
    name: 'Embroidered Team Hoodie',
    category: 'apparel',
    price: 54,
    blurb: 'Heavyweight fleece hoodie with an embroidered crest and contrast drawcords.',
    sizes: ADULT,
    swatches: [INK, COBALT, CHALK, FOREST],
    personalise: true,
  },
  {
    id: 'track-suit',
    photo: 'track-jacket',
    name: 'Track Suit Jacket',
    category: 'apparel',
    price: 68,
    blurb: 'Warm-up jacket with full zip and chest stripes that match your branding exactly.',
    sizes: ADULT,
    swatches: [COBALT, INK, NAVY],
    personalise: true,
  },
  {
    id: 'winter-jacket',
    photo: 'winter-jacket',
    name: 'Winter Team Jacket',
    category: 'apparel',
    price: 112,
    blurb: 'Insulated jacket with a water-resistant shell for cold rinks and early bus rides.',
    sizes: ADULT,
    swatches: [INK, RED, FOREST],
    personalise: true,
  },
  {
    id: 'team-tee',
    photo: 'tee',
    name: 'Performance T-Shirt',
    category: 'apparel',
    price: 22,
    blurb: 'Moisture-wicking training tee with a screen-printed or sublimated logo.',
    sizes: ADULT,
    swatches: [COBALT, CHALK, INK, GOLD],
    personalise: true,
  },
  {
    id: 'jogging-pants',
    photo: 'joggers',
    name: 'Jogging Pants',
    category: 'apparel',
    price: 38,
    blurb: 'Tapered fleece joggers with cuffed ankles and side stripes.',
    sizes: ADULT,
    swatches: [INK, NAVY],
    personalise: false,
  },
  {
    id: 'shorts',
    photo: 'shorts',
    name: 'Training Shorts',
    category: 'apparel',
    price: 26,
    blurb: 'Lightweight shorts for off-ice training and summer camps.',
    sizes: ADULT,
    swatches: [INK, COBALT, RED],
    personalise: false,
  },
  {
    id: 'cap',
    photo: 'cap',
    name: 'Structured Team Cap',
    category: 'apparel',
    price: 24,
    blurb: 'Six-panel cap with an embroidered front crest and curved brim.',
    sizes: ONE,
    swatches: [INK, COBALT, CHALK],
    personalise: false,
  },
  {
    id: 'toque',
    photo: 'toque',
    name: 'Knit Toque',
    category: 'apparel',
    price: 19,
    blurb: 'Jacquard-knit toque with a striped cuff and pom-pom in your colours.',
    sizes: ONE,
    swatches: [COBALT, RED, FOREST, NAVY],
    personalise: false,
  },
  {
    id: 'player-bag',
    photo: 'duffel',
    name: 'Player Bag',
    category: 'bags',
    price: 78,
    badge: 'Team pick',
    blurb: 'Oversized hockey bag with vented end pockets and an embroidered player name.',
    sizes: ['32"', '36"', '40"'],
    swatches: [INK, COBALT, RED],
    personalise: true,
  },
  {
    id: 'backpack',
    photo: 'backpack',
    name: 'Team Backpack',
    category: 'bags',
    price: 56,
    blurb: 'Padded backpack with a laptop sleeve and a stick-and-helmet strap.',
    sizes: ONE,
    swatches: [INK, NAVY, COBALT],
    personalise: true,
  },
  {
    id: 'bottle',
    photo: 'bottle',
    name: 'Squeeze Bottle',
    category: 'accessories',
    price: 9,
    blurb: 'BPA-free bench bottle printed with your crest.',
    sizes: ONE,
    swatches: [COBALT, CHALK, INK],
    personalise: false,
  },
]

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function filterProducts(category: CategoryId | 'all'): readonly Product[] {
  return category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)
}
