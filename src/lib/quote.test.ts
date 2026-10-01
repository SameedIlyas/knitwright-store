import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_DESIGN } from '../customiser/design'
import type { CartLine } from '../store/cartLogic'
import { buildQuote, sendQuote } from './quote'

const lines: CartLine[] = [
  { key: 'a', productId: 'hockey-pro-jersey', swatch: 'Cobalt', size: 'M', qty: 30, unitPrice: 64, name: 'TREMBLAY', number: '19' },
  { key: 'b', productId: 'baseball-pro-jersey', swatch: 'Custom', size: 'L', qty: 2, unitPrice: 58, custom: { ...DEFAULT_DESIGN, pattern: 'bold', hasLogo: true } },
]

const form = { name: 'Sam Coach', email: 'sam@club.ca', team: 'Komoka Kings' }

describe('buildQuote', () => {
  it('builds a subject, reply-to and a readable itemised message', () => {
    const q = buildQuote(form, lines)
    expect(q.subject).toBe('Quote request: Komoka Kings (32 pieces, $2,036)')
    expect(q.replyto).toBe('sam@club.ca')
    expect(q.message).toContain('30 × Pro Hockey Jersey')
    expect(q.message).toContain('Colourway: Cobalt · Size: M · Name: TREMBLAY · No. 19')
    expect(q.message).toContain('Custom design: Bold stripes · logo')
    expect(q.message).toContain(`Body ${DEFAULT_DESIGN.body}`)
    expect(q.message).toContain('Logo uploaded in the customiser')
    expect(q.message).toContain('Estimated subtotal: $2,036')
  })

  it('falls back to the contact name when no team is given', () => {
    expect(buildQuote({ ...form, team: '  ' }, lines).subject).toMatch(/^Quote request: Sam Coach/)
  })

  it('skips lines for unknown products', () => {
    const q = buildQuote(form, [{ ...lines[0], productId: 'ghost' }])
    expect(q.message).not.toContain('ghost')
  })
})

describe('sendQuote', () => {
  it('posts to Web3Forms with the access key and a honeypot', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    const res = await sendQuote(buildQuote(form, lines), 'test-key', fetcher)
    expect(res).toEqual({ ok: true })
    const [url, init] = fetcher.mock.calls[0]
    expect(url).toBe('https://api.web3forms.com/submit')
    const body = JSON.parse(init.body)
    expect(body.access_key).toBe('test-key')
    expect(body.botcheck).toBe(false)
  })

  it('reports a missing key without calling the network', async () => {
    const fetcher = vi.fn()
    expect(await sendQuote(buildQuote(form, lines), undefined, fetcher)).toEqual({ ok: false, error: expect.stringMatching(/aren't set up/) })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('turns service and network failures into friendly errors', async () => {
    const rejected = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ success: false, message: 'Invalid key' }) })
    expect((await sendQuote(buildQuote(form, lines), 'k', rejected)).ok).toBe(false)
    const offline = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    expect(await sendQuote(buildQuote(form, lines), 'k', offline)).toEqual({ ok: false, error: expect.stringMatching(/connection/) })
  })
})
