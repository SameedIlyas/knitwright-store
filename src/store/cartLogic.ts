import { isDesign, type Design } from '../customiser/design'

export const BULK_MIN = 50
const MAX_QTY = 999
const NAME_MAX = 15

export interface CartLine {
  key: string
  productId: string
  swatch: string
  size: string
  qty: number
  unitPrice: number
  name?: string
  number?: string
  /** Design from the live customiser, when the line isn't a plain catalog swatch. */
  custom?: Design
}

export interface CartState {
  readonly lines: readonly CartLine[]
}

export type CartAction =
  | { type: 'add'; line: Omit<CartLine, 'key'> }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'hydrate'; lines: readonly unknown[]; knownIds?: readonly string[] }

export const emptyCart: CartState = { lines: [] }

export function lineKey(line: Omit<CartLine, 'key'>): string {
  const c = line.custom
  // Explicit field order so a design restored from storage keys identically to a fresh one.
  const custom = c ? [c.body, c.sleeves, c.yoke, c.trim, c.stripeA, c.stripeB, c.pattern, c.font, c.textColor, c.hasLogo].join('/') : ''
  return [line.productId, line.swatch, line.size, line.name ?? '', line.number ?? '', custom].join('|')
}

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1
  return Math.min(MAX_QTY, Math.max(1, Math.round(qty)))
}

function optionalString(v: unknown): v is string | undefined {
  return v === undefined || typeof v === 'string'
}

/** Rebuilds a stored line from explicit, validated fields; returns null if it can't be trusted. */
function reviveLine(value: unknown, knownIds?: readonly string[]): Omit<CartLine, 'key'> | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  const valid =
    typeof v.productId === 'string' &&
    typeof v.swatch === 'string' &&
    typeof v.size === 'string' &&
    typeof v.qty === 'number' &&
    typeof v.unitPrice === 'number' &&
    Number.isFinite(v.unitPrice) &&
    v.unitPrice >= 0 &&
    v.unitPrice < 10_000 &&
    optionalString(v.name) &&
    optionalString(v.number)
  if (!valid) return null
  if (knownIds && !knownIds.includes(v.productId as string)) return null
  const custom = isDesign(v.custom) ? { ...v.custom } : undefined
  return {
    productId: v.productId as string,
    swatch: (v.swatch as string).slice(0, 40),
    size: (v.size as string).slice(0, 12),
    qty: clampQty(v.qty as number),
    unitPrice: v.unitPrice as number,
    name: sanitiseName((v.name as string | undefined) ?? '') || undefined,
    number: sanitiseNumber((v.number as string | undefined) ?? '') || undefined,
    custom,
  }
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line)
      const existing = state.lines.find((l) => l.key === key)
      if (existing) {
        return {
          lines: state.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + action.line.qty) } : l)),
        }
      }
      return { lines: [...state.lines, { ...action.line, qty: clampQty(action.line.qty), key }] }
    }
    case 'setQty': {
      if (action.qty === 0) return { lines: state.lines.filter((l) => l.key !== action.key) }
      return {
        lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty: clampQty(action.qty) } : l)),
      }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.key !== action.key) }
    case 'clear':
      return emptyCart
    case 'hydrate':
      return action.lines.reduce<CartState>((acc, raw) => {
        const line = reviveLine(raw, action.knownIds)
        return line ? cartReducer(acc, { type: 'add', line }) : acc
      }, emptyCart)
  }
}

export function subtotal(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0)
}

export function countItems(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.qty, 0)
}

/**
 * Keeps letters, spaces, apostrophes, dots and hyphens, uppercased and capped.
 * Pass `live` while the user is typing so spaces aren't eaten mid-word.
 */
export function sanitiseName(raw: string, opts: { live?: boolean } = {}): string {
  const cleaned = raw.replace(/[^a-zA-Z .'-]/g, '').toUpperCase()
  const tidy = opts.live ? cleaned.replace(/^ +/, '').replace(/ {2,}/g, ' ') : cleaned.trim().replace(/ +/g, ' ')
  return tidy.slice(0, NAME_MAX)
}

export function sanitiseNumber(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 2)
}

export interface OrderForm {
  name: string
  email: string
  team: string
}

export type OrderErrors = Partial<Record<keyof OrderForm, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateOrderForm(form: OrderForm): OrderErrors {
  const errors: OrderErrors = {}
  if (form.name.trim().length < 2) errors.name = 'Please enter your name'
  if (!EMAIL.test(form.email.trim())) errors.email = 'Please enter a valid email'
  return errors
}

export function formatCAD(value: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value)
}
