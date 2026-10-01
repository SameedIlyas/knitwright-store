import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { photoUrl } from '../components/Photo'
import { clampLogo, FONTS, readableOn, stripeBands, type Design, type LogoPlacement } from './design'
import type { ViewDef } from './templates'

interface JerseyPreviewProps {
  view: ViewDef
  design: Design
  name?: string
  number?: string
  logo?: { src: string; placement: LogoPlacement } | null
  onLogoMove?: (p: LogoPlacement) => void
  className?: string
  title?: string
}

const KEY_DELTAS: Record<string, readonly [number, number, number]> = {
  ArrowLeft: [-1, 0, 0],
  ArrowRight: [1, 0, 0],
  ArrowUp: [0, -1, 0],
  ArrowDown: [0, 1, 0],
  '+': [0, 0, 1.5],
  '=': [0, 0, 1.5],
  '-': [0, 0, -1.5],
}

/**
 * Photoreal jersey render. An SVG paints colour zones, stripes, lettering and the logo,
 * clipped to the garment photo's alpha; the white photo then sits on top as a plain
 * HTML <img> with CSS multiply (more reliable than blending inside SVG, notably in Safari),
 * so every fold, seam and shadow stays real.
 */
export function JerseyPreview({ view, design, name, number, logo, onLogoMove, className, title }: JerseyPreviewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const overlayRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ dx: number; dy: number } | null>(null)
  const url = photoUrl(view.photo)
  const font = FONTS.find((f) => f.id === design.font) ?? FONTS[0]
  const bands = stripeBands(design.pattern, design.stripeA, design.stripeB)
  const textFill = readableOn(design.textColor, design.body)
  const ids = { garment: `g${uid}`, sleeveL: `sl${uid}`, sleeveR: `sr${uid}`, body: `b${uid}`, arc: `a${uid}` }
  const editable = Boolean(logo && view.logo && onLogoMove)

  const toSvg = (e: PointerEvent) => {
    const ctm = overlayRef.current?.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    return { x: pt.x, y: pt.y }
  }

  const endDrag = (e: PointerEvent<SVGGElement>) => {
    drag.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onDown = (e: PointerEvent<SVGGElement>) => {
    if (!logo || !onLogoMove || !e.isPrimary || e.button !== 0) return
    const p = toSvg(e)
    if (!p) return
    e.preventDefault()
    drag.current = { dx: p.x - logo.placement.x, dy: p.y - logo.placement.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: PointerEvent<SVGGElement>) => {
    if (!drag.current || !logo || !onLogoMove) return
    const p = toSvg(e)
    if (p) onLogoMove(clampLogo({ ...logo.placement, x: p.x - drag.current.dx, y: p.y - drag.current.dy }))
  }

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const d = KEY_DELTAS[e.key]
    if (!logo || !onLogoMove || !d) return
    e.preventDefault()
    e.stopPropagation()
    const step = e.shiftKey ? 30 : 8
    const { x, y, size } = logo.placement
    onLogoMove(clampLogo({ x: x + d[0] * step, y: y + d[1] * step, size: size + d[2] * step }))
  }

  return (
    <div className={`jersey ${className ?? ''}`} role={editable ? 'group' : 'img'} aria-label={title ?? 'Jersey preview'}>
      <svg viewBox="0 0 900 900" className="jersey__paint" aria-hidden>
        <defs>
          <mask id={ids.garment} maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="900" {...{ 'mask-type': 'alpha' }} style={{ maskType: 'alpha' }}>
            <image href={url} width="900" height="900" />
          </mask>
          <clipPath id={ids.sleeveL}>
            <path d={view.sleeveL} />
          </clipPath>
          <clipPath id={ids.sleeveR}>
            <path d={view.sleeveR} />
          </clipPath>
          <clipPath id={ids.body}>
            <path d={view.body} />
          </clipPath>
          {view.name?.arc && <path id={ids.arc} d={`M${view.name.x - 260} ${view.name.y + 40} Q${view.name.x} ${view.name.y - 50} ${view.name.x + 260} ${view.name.y + 40}`} />}
        </defs>

        <g mask={`url(#${ids.garment})`}>
          <rect width="900" height="900" fill={design.body} />
          {view.yoke && <path d={view.yoke} fill={design.yoke} />}
          <path d={view.sleeveL} fill={design.sleeves} />
          <path d={view.sleeveR} fill={design.sleeves} />
          {view.collar && <path d={view.collar} fill={design.trim} />}

          {view.stripes.map((slot, i) => (
            <g key={i} clipPath={`url(#${ids[slot.clip]})`}>
              <g transform={`translate(${slot.cx} ${slot.cy}) rotate(${slot.angle})`}>
                {bands.map((b, j) => (
                  <rect key={j} x={-slot.length / 2} y={b.offset} width={slot.length} height={b.height} fill={b.color} />
                ))}
              </g>
            </g>
          ))}

          {view.name && name && (
            <text
              fontFamily={font.family}
              fontWeight={font.weight}
              fontSize={view.name.size}
              letterSpacing={view.name.arc ? 6 : 0}
              fill={textFill}
              stroke={design.stripeB}
              strokeWidth={view.name.arc ? 0 : 3}
              paintOrder="stroke"
              textAnchor="middle"
              fontStyle={view.name.arc ? 'normal' : 'italic'}
              {...(view.name.arc ? {} : { x: view.name.x, y: view.name.y, transform: `rotate(-6 ${view.name.x} ${view.name.y})` })}
            >
              {view.name.arc ? (
                <textPath href={`#${ids.arc}`} startOffset="50%">
                  {name}
                </textPath>
              ) : (
                name
              )}
            </text>
          )}

          {view.number && number && (
            <text
              x={view.number.x}
              y={view.number.y}
              fontFamily={font.family}
              fontWeight={font.weight}
              fontSize={view.number.size}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={textFill}
              stroke={design.stripeB}
              strokeWidth={view.number.size / 22}
              paintOrder="stroke"
              letterSpacing={-4}
            >
              {number}
            </text>
          )}

          {logo && view.logo && (
            <image
              href={logo.src}
              x={logo.placement.x - logo.placement.size / 2}
              y={logo.placement.y - logo.placement.size / 2}
              width={logo.placement.size}
              height={logo.placement.size}
              preserveAspectRatio="xMidYMid meet"
            />
          )}
        </g>
      </svg>

      <img className="jersey__shade" src={url} alt="" draggable={false} />

      {editable && logo && (
        <svg ref={overlayRef} viewBox="0 0 900 900" className="jersey__overlay">
          <g
            className="logo-handle"
            tabIndex={0}
            role="application"
            aria-roledescription="draggable logo"
            aria-label="Logo position. Drag it, or use the arrow keys to move it and the plus and minus keys to resize it."
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={() => (drag.current = null)}
            onKeyDown={onKey}
          >
            <rect
              x={logo.placement.x - logo.placement.size / 2 - 8}
              y={logo.placement.y - logo.placement.size / 2 - 8}
              width={logo.placement.size + 16}
              height={logo.placement.size + 16}
              rx="10"
            />
          </g>
        </svg>
      )}
    </div>
  )
}
