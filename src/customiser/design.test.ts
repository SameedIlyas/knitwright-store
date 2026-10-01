import { describe, expect, it } from 'vitest'
import { clampLogo, DEFAULT_DESIGN, describeDesign, isDesign, readableOn, stripeBands, validateLogoFile } from './design'

describe('stripeBands', () => {
  it('returns no bands for "none"', () => {
    expect(stripeBands('none', '#fff', '#000')).toEqual([])
  })

  it('centres bands around 0 and alternates colours', () => {
    const bands = stripeBands('classic', '#aaaaaa', '#bbbbbb')
    const top = bands[0].offset
    const last = bands[bands.length - 1]
    expect(top).toBeCloseTo(-(last.offset + last.height))
    expect(bands.map((b) => b.color)).toEqual(['#bbbbbb', '#aaaaaa', '#bbbbbb'])
  })

  it('triple stripes use only the primary stripe colour', () => {
    const bands = stripeBands('triple', '#aaaaaa', '#bbbbbb')
    expect(bands).toHaveLength(3)
    expect(new Set(bands.map((b) => b.color))).toEqual(new Set(['#aaaaaa']))
  })
})

describe('validateLogoFile', () => {
  it('accepts common image types under the size limit', () => {
    expect(validateLogoFile({ type: 'image/png', size: 200_000 })).toBeNull()
    expect(validateLogoFile({ type: 'image/svg+xml', size: 20_000 })).toBeNull()
  })

  it('rejects other types and oversized files', () => {
    expect(validateLogoFile({ type: 'application/pdf', size: 10 })).toMatch(/PNG, JPG, SVG or WebP/)
    expect(validateLogoFile({ type: 'image/png', size: 9_000_000 })).toMatch(/5 MB/)
  })
})

describe('clampLogo', () => {
  it('keeps the logo inside the print area and size bounds', () => {
    expect(clampLogo({ x: -50, y: 2000, size: 5 })).toEqual({ x: 120, y: 780, size: 60 })
    expect(clampLogo({ x: 450, y: 400, size: 999 })).toEqual({ x: 450, y: 400, size: 360 })
  })
})

describe('isDesign', () => {
  it('accepts the default design and rejects tampered values', () => {
    expect(isDesign(DEFAULT_DESIGN)).toBe(true)
    expect(isDesign({ ...DEFAULT_DESIGN, body: 'red; background:url(x)' })).toBe(false)
    expect(isDesign({ ...DEFAULT_DESIGN, pattern: 'zigzag' })).toBe(false)
    expect(isDesign({ ...DEFAULT_DESIGN, font: 'Comic Sans' })).toBe(false)
    expect(isDesign(null)).toBe(false)
  })
})

describe('describeDesign', () => {
  it('summarises the design for the order line', () => {
    expect(describeDesign({ ...DEFAULT_DESIGN, pattern: 'bold', hasLogo: true })).toBe('Bold stripes · logo')
    expect(describeDesign({ ...DEFAULT_DESIGN, pattern: 'none', hasLogo: false })).toBe('No stripes')
  })
})

describe('readableOn', () => {
  it('keeps the chosen colour when it contrasts with the fabric', () => {
    expect(readableOn('#ffffff', '#17181b')).toBe('#ffffff')
    expect(readableOn('#2b46f0', '#ffffff')).toBe('#2b46f0')
  })

  it('falls back to ink or white when lettering would disappear', () => {
    expect(readableOn('#ffffff', '#ffffff')).toBe('#0f1012')
    expect(readableOn('#e9eaee', '#ffffff')).toBe('#0f1012')
    expect(readableOn('#17181b', '#0f1012')).toBe('#ffffff')
  })
})
