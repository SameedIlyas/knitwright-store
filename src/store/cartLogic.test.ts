import { describe, expect, it } from 'vitest'
import { DEFAULT_DESIGN } from '../customiser/design'
import {
  BULK_MIN,
  cartReducer,
  countItems,
  emptyCart,
  lineKey,
  sanitiseName,
  sanitiseNumber,
  subtotal,
  validateOrderForm,
  type CartLine,
} from './cartLogic'

const base: Omit<CartLine, 'key'> = {
  productId: 'hockey-pro-jersey',
  swatch: 'Cobalt',
  size: 'M',
  qty: 2,
  unitPrice: 64,
}

describe('cartReducer', () => {
  it('adds a new line with a derived key', () => {
    const next = cartReducer(emptyCart, { type: 'add', line: base })
    expect(next.lines).toHaveLength(1)
    expect(next.lines[0].key).toBe(lineKey(base))
  })

  it('merges quantities when the same configuration is added twice', () => {
    const once = cartReducer(emptyCart, { type: 'add', line: base })
    const twice = cartReducer(once, { type: 'add', line: base })
    expect(twice.lines).toHaveLength(1)
    expect(twice.lines[0].qty).toBe(4)
  })

  it('keeps personalised lines separate', () => {
    const a = cartReducer(emptyCart, { type: 'add', line: { ...base, name: 'GRETZKY', number: '99' } })
    const b = cartReducer(a, { type: 'add', line: { ...base, name: 'ORR', number: '4' } })
    expect(b.lines).toHaveLength(2)
  })

  it('does not mutate the previous state', () => {
    const once = cartReducer(emptyCart, { type: 'add', line: base })
    const snapshot = JSON.stringify(once)
    cartReducer(once, { type: 'setQty', key: once.lines[0].key, qty: 10 })
    expect(JSON.stringify(once)).toBe(snapshot)
  })

  it('clamps quantity between 1 and 999 and removes on 0', () => {
    const once = cartReducer(emptyCart, { type: 'add', line: base })
    const key = once.lines[0].key
    expect(cartReducer(once, { type: 'setQty', key, qty: 5000 }).lines[0].qty).toBe(999)
    expect(cartReducer(once, { type: 'setQty', key, qty: 0 }).lines).toHaveLength(0)
    expect(cartReducer(once, { type: 'setQty', key, qty: Number.NaN }).lines[0].qty).toBe(1)
  })

  it('removes and clears', () => {
    const once = cartReducer(emptyCart, { type: 'add', line: base })
    expect(cartReducer(once, { type: 'remove', key: once.lines[0].key }).lines).toHaveLength(0)
    expect(cartReducer(once, { type: 'clear' }).lines).toHaveLength(0)
  })

  it('drops or repairs poisoned stored lines', () => {
    const next = cartReducer(emptyCart, {
      type: 'hydrate',
      lines: [
        { ...base, name: {} },
        { ...base, unitPrice: -5 },
        { ...base, productId: 'not-in-catalog' },
        { ...base, name: 'orr<x>', number: '4a4' },
        { ...base, name: 'ORRX', number: '44' },
      ] as unknown[],
      knownIds: ['hockey-pro-jersey'],
    })
    expect(next.lines).toHaveLength(1)
    expect(next.lines[0]).toMatchObject({ name: 'ORRX', number: '44', qty: 4 })
  })

  it('keeps custom colourways as separate lines', () => {
    const a = cartReducer(emptyCart, { type: 'add', line: { ...base, custom: { ...DEFAULT_DESIGN, body: '#c2362b' } } })
    const b = cartReducer(a, { type: 'add', line: { ...base, custom: { ...DEFAULT_DESIGN, body: '#2b46f0' } } })
    expect(b.lines).toHaveLength(2)
  })

  it('merges a restored design with the same fresh design regardless of key order', () => {
    const reordered = Object.fromEntries(Object.entries(DEFAULT_DESIGN).reverse())
    const restored = cartReducer(emptyCart, { type: 'hydrate', lines: [{ ...base, custom: reordered }] })
    const merged = cartReducer(restored, { type: 'add', line: { ...base, custom: DEFAULT_DESIGN } })
    expect(merged.lines).toHaveLength(1)
    expect(merged.lines[0].qty).toBe(4)
  })

  it('hydrates only valid lines', () => {
    const next = cartReducer(emptyCart, {
      type: 'hydrate',
      lines: [{ ...base, key: 'x' }, { bogus: true }, null] as unknown[],
    })
    expect(next.lines).toHaveLength(1)
  })
})

describe('totals', () => {
  it('sums subtotal and item count', () => {
    const s = cartReducer(
      cartReducer(emptyCart, { type: 'add', line: base }),
      { type: 'add', line: { ...base, productId: 'cap', unitPrice: 24, qty: 3 } },
    )
    expect(subtotal(s)).toBe(64 * 2 + 24 * 3)
    expect(countItems(s)).toBe(5)
    expect(BULK_MIN).toBe(50)
  })
})

describe('personalisation sanitising', () => {
  it('uppercases names, strips disallowed characters and caps length', () => {
    expect(sanitiseName("o'reilly-smith<script>")).toBe("O'REILLY-SMITHS")
    expect(sanitiseName('  ')).toBe('')
  })

  it('lets people type spaces while editing, and tidies them when finalised', () => {
    expect(sanitiseName('van ', { live: true })).toBe('VAN ')
    expect(sanitiseName('  van   der  berg ')).toBe('VAN DER BERG')
  })

  it('keeps numbers to two digits', () => {
    expect(sanitiseNumber('a9b9c9')).toBe('99')
    expect(sanitiseNumber('')).toBe('')
  })
})

describe('validateOrderForm', () => {
  it('flags missing and malformed fields', () => {
    expect(validateOrderForm({ name: '', email: 'nope', team: '' })).toEqual({
      name: 'Please enter your name',
      email: 'Please enter a valid email',
    })
  })

  it('passes a valid form', () => {
    expect(validateOrderForm({ name: 'Sam', email: 'sam@club.ca', team: 'Komoka Kings' })).toEqual({})
  })
})
