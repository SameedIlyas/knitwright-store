export type StripePattern = 'none' | 'classic' | 'bold' | 'triple' | 'split'
export type NumberFont = 'block' | 'athletic' | 'condensed'

/** The colour/stripe/font choices that travel with an order line (the logo image itself does not). */
export interface Design {
  body: string
  sleeves: string
  yoke: string
  trim: string
  stripeA: string
  stripeB: string
  pattern: StripePattern
  font: NumberFont
  textColor: string
  hasLogo: boolean
}

export interface LogoPlacement {
  x: number
  y: number
  size: number
}

export interface Band {
  offset: number
  height: number
  color: string
}

export const PATTERNS: readonly { id: StripePattern; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'classic', label: 'Classic' },
  { id: 'bold', label: 'Bold' },
  { id: 'triple', label: 'Triple' },
  { id: 'split', label: 'Split' },
]

export const FONTS: readonly { id: NumberFont; label: string; family: string; weight: number }[] = [
  { id: 'block', label: 'Block', family: 'Geist, sans-serif', weight: 800 },
  { id: 'athletic', label: 'Athletic', family: 'Graduate, serif', weight: 400 },
  { id: 'condensed', label: 'Condensed', family: 'Oswald, sans-serif', weight: 600 },
]

export const DEFAULT_DESIGN: Design = {
  body: '#17181b',
  sleeves: '#2b46f0',
  yoke: '#17181b',
  trim: '#ffffff',
  stripeA: '#ffffff',
  stripeB: '#2b46f0',
  pattern: 'classic',
  font: 'block',
  textColor: '#ffffff',
  hasLogo: false,
}

/** Stripe stacks, top to bottom, as [height, colour slot, gap-after]. */
const STACKS: Record<Exclude<StripePattern, 'none'>, readonly (readonly [number, 'A' | 'B', number])[]> = {
  classic: [
    [14, 'B', 0],
    [34, 'A', 0],
    [14, 'B', 0],
  ],
  bold: [[64, 'A', 0]],
  triple: [
    [14, 'A', 12],
    [14, 'A', 12],
    [14, 'A', 0],
  ],
  split: [
    [30, 'A', 0],
    [30, 'B', 0],
  ],
}

/** Horizontal bands centred on 0, ready to be placed and rotated onto a stripe slot. */
export function stripeBands(pattern: StripePattern, stripeA: string, stripeB: string): Band[] {
  if (pattern === 'none') return []
  const stack = STACKS[pattern]
  const total = stack.reduce((sum, [h, , gap]) => sum + h + gap, 0)
  let cursor = -total / 2
  return stack.map(([height, slot, gap]) => {
    const band = { offset: cursor, height, color: slot === 'A' ? stripeA : stripeB }
    cursor += height + gap
    return band
  })
}

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
const LOGO_MAX_BYTES = 5 * 1024 * 1024

export function validateLogoFile(file: { type: string; size: number }): string | null {
  if (!LOGO_TYPES.includes(file.type)) return 'Please upload a PNG, JPG, SVG or WebP logo.'
  if (file.size > LOGO_MAX_BYTES) return 'Logos must be under 5 MB.'
  return null
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Keeps the logo on the printable area of the 900×900 canvas. */
export function clampLogo(p: LogoPlacement): LogoPlacement {
  return { x: clamp(p.x, 120, 780), y: clamp(p.y, 120, 780), size: clamp(p.size, 60, 360) }
}

const HEX = /^#[0-9a-f]{6}$/i
const COLOUR_KEYS = ['body', 'sleeves', 'yoke', 'trim', 'stripeA', 'stripeB', 'textColor'] as const

export function isDesign(value: unknown): value is Design {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    COLOUR_KEYS.every((k) => typeof v[k] === 'string' && HEX.test(v[k] as string)) &&
    PATTERNS.some((p) => p.id === v.pattern) &&
    FONTS.some((f) => f.id === v.font) &&
    typeof v.hasLogo === 'boolean'
  )
}

export function describeDesign(d: Design): string {
  const stripes = d.pattern === 'none' ? 'No stripes' : `${PATTERNS.find((p) => p.id === d.pattern)?.label} stripes`
  return d.hasLogo ? `${stripes} · logo` : stripes
}

/** Turns a catalog colourway into a full jersey design (body, matching sleeves, classic stripes). */
export function designFromSwatch(s: { color: string; accent: string; trim: string }): Design {
  return {
    body: s.color,
    sleeves: s.color,
    yoke: s.color,
    trim: s.trim,
    stripeA: s.accent,
    stripeB: s.trim,
    pattern: 'classic',
    font: 'block',
    textColor: s.accent,
    hasLogo: false,
  }
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Returns `text` if it stands out on `fabric`, otherwise ink or white, whichever reads better. */
export function readableOn(text: string, fabric: string): string {
  const [a, b] = [luminance(text), luminance(fabric)]
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  if (ratio >= 1.8) return text
  return luminance(fabric) > 0.35 ? '#0f1012' : '#ffffff'
}
