/**
 * Zone geometry for each customisable photo, in the 900×900 space of the cutouts in
 * public/photos. Zones are generous polygons; the garment's own alpha clips them.
 */

export interface StripeSlot {
  /** Centre of the stripe band. */
  cx: number
  cy: number
  /** Band direction in degrees (0 = horizontal). */
  angle: number
  length: number
  /** Restrict the band to one zone so it doesn't spill onto the body. */
  clip: 'sleeveL' | 'sleeveR' | 'body'
}

export interface ViewDef {
  photo: string
  sleeveL: string
  sleeveR: string
  body: string
  yoke?: string
  collar?: string
  stripes: readonly StripeSlot[]
  logo?: { x: number; y: number; size: number }
  name?: { x: number; y: number; size: number; arc: boolean }
  number?: { x: number; y: number; size: number }
}

export interface Template {
  id: 'hockey' | 'baseball'
  label: string
  productId: string
  views: { front: ViewDef; back?: ViewDef }
}

export const TEMPLATES: readonly Template[] = [
  {
    id: 'hockey',
    label: 'Hockey jersey',
    productId: 'hockey-pro-jersey',
    views: {
      front: {
        photo: 'hockey-front',
        sleeveL: 'M0 100 L240 195 L240 262 L228 420 L214 470 L214 720 L0 720 Z',
        sleeveR: 'M900 100 L656 195 L656 262 L668 410 L688 470 L688 720 L900 720 Z',
        body: 'M214 120 H688 V800 H214 Z',
        yoke: 'M222 190 L380 140 L520 140 L680 200 L664 262 L540 236 L360 236 L238 264 Z',
        collar: 'M342 138 L556 128 L548 176 L470 268 L430 268 L352 182 Z',
        stripes: [
          { cx: 450, cy: 700, angle: 0, length: 520, clip: 'body' },
          { cx: 112, cy: 520, angle: 22, length: 320, clip: 'sleeveL' },
          { cx: 790, cy: 520, angle: -22, length: 320, clip: 'sleeveR' },
        ],
        logo: { x: 450, y: 440, size: 230 },
      },
      back: {
        photo: 'hockey-back',
        sleeveL: 'M0 0 L332 0 L332 104 L292 180 L256 262 L212 400 L206 720 L0 720 Z',
        sleeveR: 'M900 0 L560 0 L560 96 L610 200 L660 300 L694 410 L696 720 L900 720 Z',
        body: 'M206 90 H696 V820 H206 Z',
        yoke: 'M290 96 H610 V206 H290 Z',
        collar: 'M332 92 Q450 176 552 90 L548 128 Q450 196 340 126 Z',
        stripes: [
          { cx: 455, cy: 735, angle: 0, length: 540, clip: 'body' },
          { cx: 128, cy: 470, angle: 18, length: 300, clip: 'sleeveL' },
          { cx: 772, cy: 470, angle: -18, length: 300, clip: 'sleeveR' },
        ],
        name: { x: 452, y: 268, size: 52, arc: true },
        number: { x: 452, y: 560, size: 250 },
      },
    },
  },
  {
    id: 'baseball',
    label: 'Baseball jersey',
    productId: 'baseball-pro-jersey',
    views: {
      front: {
        photo: 'baseball-front',
        sleeveL: 'M0 40 L200 84 L206 180 L196 330 L186 430 L0 430 Z',
        sleeveR: 'M900 40 L690 84 L694 180 L706 320 L722 430 L900 430 Z',
        body: 'M186 20 H722 V890 H186 Z',
        stripes: [
          { cx: 92, cy: 318, angle: 50, length: 260, clip: 'sleeveL' },
          { cx: 808, cy: 312, angle: -51, length: 260, clip: 'sleeveR' },
        ],
        logo: { x: 300, y: 270, size: 120 },
        name: { x: 450, y: 395, size: 78, arc: false },
        number: { x: 610, y: 560, size: 130 },
      },
    },
  },
]

export function findTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}

/** The customiser template that renders a given product photo, if any. */
export function templateForPhoto(photo: string): Template | undefined {
  return TEMPLATES.find((t) => t.views.front.photo === photo)
}
