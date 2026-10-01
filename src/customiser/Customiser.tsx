import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Button, Icon, SectionTag } from '../components/ui'
import { findProduct } from '../data/catalog'
import { useStore } from '../store/cart'
import { formatCAD, sanitiseName, sanitiseNumber } from '../store/cartLogic'
import { clampLogo, DEFAULT_DESIGN, describeDesign, FONTS, PATTERNS, validateLogoFile, type Design, type LogoPlacement } from './design'
import { JerseyPreview } from './JerseyPreview'
import { STUDIO_URL, StudioCta } from './StudioCta'
import { TEMPLATES, findTemplate, type Template } from './templates'

const PALETTE = ['#17181b', '#2b46f0', '#1c2a8f', '#c2362b', '#0f7b59', '#f2b833', '#ffffff', '#e9eaee', '#7a1f3d', '#ff7a1a'] as const
const SIZES = ['YM', 'YL', 'S', 'M', 'L', 'XL', '2XL'] as const
const TABS = ['Colours', 'Stripes', 'Logo', 'Name & No.'] as const
const tabId = (t: string) => `cz-tab-${t.toLowerCase().replace(/[^a-z]+/g, '-')}`
type Tab = (typeof TABS)[number]
type ViewName = 'front' | 'back'

interface ColourRowProps {
  label: string
  value: string
  onChange: (c: string) => void
}

function ColourRow({ label, value, onChange }: ColourRowProps) {
  return (
    <fieldset className="opt cz-row">
      <legend>{label}</legend>
      <div className="swatches">
        {PALETTE.map((c) => (
          <button key={c} className={`swatch ${c === value ? 'is-active' : ''}`} style={{ background: c }} onClick={() => onChange(c)} aria-label={`${label} ${c}`} aria-pressed={c === value} />
        ))}
        <label className="swatch swatch--custom" title="Custom colour">
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} custom colour`} />
        </label>
      </div>
    </fieldset>
  )
}

export function Customiser() {
  const { addToCart, setDrawerOpen } = useStore()
  const [templateId, setTemplateId] = useState<Template['id']>('hockey')
  const [view, setView] = useState<ViewName>('back')
  const [tab, setTab] = useState<Tab>('Colours')
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN)
  const [name, setName] = useState('TREMBLAY')
  const [number, setNumber] = useState('19')
  const [size, setSize] = useState<string>('L')
  const [logo, setLogo] = useState<{ src: string; placement: LogoPlacement } | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadSeq = useRef(0)

  const template = findTemplate(templateId)
  const templateRef = useRef(template)
  templateRef.current = template
  const viewDef = (view === 'back' && template.views.back) || template.views.front
  const activeView: ViewName = viewDef === template.views.front ? 'front' : 'back'
  const product = findProduct(template.productId)
  const set = <K extends keyof Design>(key: K) => (value: Design[K]) => setDesign((d) => ({ ...d, [key]: value }))

  // Each jersey has its own chest spot; move the logo there when the style changes.
  useEffect(() => {
    const spot = template.views.front.logo
    if (spot) setLogo((l) => (l ? { ...l, placement: clampLogo(spot) } : l))
  }, [template])

  // Jump to the side of the jersey that shows what the user is editing.
  useEffect(() => {
    if (tab === 'Logo') setView('front')
    if (tab === 'Name & No.' && template.views.back) setView('back')
  }, [tab, template])

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const error = validateLogoFile(file)
    setLogoError(error)
    if (error) return
    const seq = ++uploadSeq.current
    const reader = new FileReader()
    reader.onload = () => {
      // Ignore a slower earlier upload that finishes after a newer one.
      if (seq !== uploadSeq.current || typeof reader.result !== 'string') return
      const src = reader.result
      const spot = templateRef.current.views.front.logo ?? { x: 450, y: 400, size: 200 }
      // Replacing keeps the user's placement; a first upload goes to the chest spot.
      setLogo((prev) => ({ src, placement: prev?.placement ?? clampLogo(spot) }))
      setDesign((d) => ({ ...d, hasLogo: true }))
      setView('front')
    }
    reader.onerror = () => setLogoError('That file could not be read. Try another image.')
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogo(null)
    setDesign((d) => ({ ...d, hasLogo: false }))
  }

  const add = () => {
    if (!product) return
    addToCart(
      {
        productId: product.id,
        swatch: 'Custom',
        size,
        qty: 1,
        unitPrice: product.price,
        name: sanitiseName(name) || undefined,
        number: number || undefined,
        custom: design,
      },
      `Custom ${template.label.toLowerCase()}`,
    )
    setDrawerOpen(true)
  }

  return (
    <section className="section customiser" id="builder">
      <SectionTag>Customiser</SectionTag>
      <div className="section__head section__head--center">
        <SplitHeadline text={'Design your kit,\nlive.'} />
        <Reveal as="p" className="lede">
          Colour every panel, add stripes, drop in your logo and set names and numbers. What you see is what we sample.
        </Reveal>
      </div>

      <div className="cz">
        <Reveal className="cz__stage" y={60}>
          <div className="cz__toolbar">
            <div className="seg" role="group" aria-label="Jersey style">
              {TEMPLATES.map((t) => (
                <button key={t.id} className={`seg__btn ${t.id === templateId ? 'is-active' : ''}`} aria-pressed={t.id === templateId} onClick={() => setTemplateId(t.id)}>
                  {t.id === templateId && <motion.span layoutId="cz-style" className="seg__bg" />}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            <div className="seg" role="group" aria-label="View">
              {(['front', 'back'] as const).map((v) => {
                const disabled = v === 'back' && !template.views.back
                return (
                  <button key={v} className={`seg__btn ${v === activeView ? 'is-active' : ''}`} aria-pressed={v === activeView} disabled={disabled} onClick={() => setView(v)}>
                    {v === activeView && <motion.span layoutId="cz-view" className="seg__bg" />}
                    <span>{v === 'front' ? 'Front' : 'Back'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="cz__canvas">
            <div className="qv__grid" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${templateId}-${activeView}`}
                className="cz__jersey"
                initial={{ opacity: 0, x: activeView === 'back' ? 60 : -60, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: activeView === 'back' ? -60 : 60, scale: 0.94 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <JerseyPreview
                  view={viewDef}
                  design={design}
                  name={name}
                  number={number}
                  logo={logo}
                  onLogoMove={(placement) => setLogo((l) => (l ? { ...l, placement } : l))}
                  title={`Your ${template.label.toLowerCase()}, ${activeView} view`}
                />
              </motion.div>
            </AnimatePresence>
            {logo && activeView === 'front' && <p className="cz__hint mono">Drag the logo to position it</p>}
          </div>
        </Reveal>

        <Reveal className="cz__panel" delay={0.1}>
          <div className="cz__tabs" role="tablist" aria-label="Customise">
            {TABS.map((t) => (
              <button key={t} role="tab" id={tabId(t)} aria-selected={t === tab} aria-controls="cz-panel" tabIndex={t === tab ? 0 : -1} className={`cz__tab ${t === tab ? 'is-active' : ''}`} onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  const i = TABS.indexOf(t)
                  const moves: Record<string, Tab> = {
                    ArrowRight: TABS[(i + 1) % TABS.length],
                    ArrowLeft: TABS[(i - 1 + TABS.length) % TABS.length],
                    Home: TABS[0],
                    End: TABS[TABS.length - 1],
                  }
                  const next = moves[e.key]
                  if (next) {
                    e.preventDefault()
                    setTab(next)
                    document.getElementById(tabId(next))?.focus()
                  }
                }}
              >
                {t === tab && <motion.span layoutId="cz-tab" className="cz__tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>

          <div className="cz__body" id="cz-panel" role="tabpanel" aria-labelledby={tabId(tab)}>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                {tab === 'Colours' && (
                  <>
                    <ColourRow label="Body" value={design.body} onChange={set('body')} />
                    <ColourRow label="Sleeves" value={design.sleeves} onChange={set('sleeves')} />
                    {templateId === 'hockey' && <ColourRow label="Shoulder yoke" value={design.yoke} onChange={set('yoke')} />}
                    {templateId === 'hockey' && <ColourRow label="Collar" value={design.trim} onChange={set('trim')} />}
                  </>
                )}

                {tab === 'Stripes' && (
                  <>
                    <fieldset className="opt">
                      <legend>Pattern</legend>
                      <div className="patterns">
                        {PATTERNS.map((p) => (
                          <button key={p.id} className={`pattern ${p.id === design.pattern ? 'is-active' : ''}`} onClick={() => set('pattern')(p.id)} aria-pressed={p.id === design.pattern}>
                            <PatternIcon id={p.id} a={design.stripeA} b={design.stripeB} base={design.sleeves} />
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <ColourRow label="Stripe colour" value={design.stripeA} onChange={set('stripeA')} />
                    <ColourRow label="Accent / outline" value={design.stripeB} onChange={set('stripeB')} />
                  </>
                )}

                {tab === 'Logo' && (
                  <div className="logo-tab">
                    <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden onChange={onFile} />
                    {!logo ? (
                      <button className="dropzone" onClick={() => fileRef.current?.click()}>
                        <Icon name="plus" />
                        <strong>Upload your logo</strong>
                        <small>PNG with transparency works best · SVG, JPG, WebP · up to 5 MB</small>
                      </button>
                    ) : (
                      <>
                        <div className="logo-card">
                          <img src={logo.src} alt="Your uploaded logo" />
                          <div>
                            <strong>Logo placed on chest</strong>
                            <small>Drag it on the jersey, or use arrow keys.</small>
                          </div>
                        </div>
                        <label className="range">
                          <span>Size</span>
                          <input type="range" min={60} max={360} value={logo.placement.size} onChange={(e) => setLogo({ ...logo, placement: clampLogo({ ...logo.placement, size: Number(e.target.value) }) })} />
                        </label>
                        <div className="logo-actions">
                          <button className="chip" onClick={() => fileRef.current?.click()}>
                            Replace
                          </button>
                          <button className="chip" onClick={() => setLogo({ ...logo, placement: clampLogo(template.views.front.logo ?? logo.placement) })}>
                            Reset position
                          </button>
                          <button className="chip" onClick={removeLogo}>
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                    {logoError && (
                      <p className="field__error" role="alert">
                        {logoError}
                      </p>
                    )}
                    <p className="drawer__fine">Your logo stays in your browser for this preview. We'll ask for a print-ready file with your quote.</p>
                    <p className="cz__more">
                      Logo on the sleeve or back, or embroidered or patched instead?{' '}
                      <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
                        Set it up on knitwright.com ↗
                      </a>
                    </p>
                  </div>
                )}

                {tab === 'Name & No.' && (
                  <>
                    <div className="opt opt--row">
                      <label className="field">
                        <span>{templateId === 'baseball' ? 'Team script' : 'Player name'}</span>
                        <input value={name} maxLength={15} onChange={(e) => setName(sanitiseName(e.target.value, { live: true }))} />
                      </label>
                      <label className="field field--sm">
                        <span>No.</span>
                        <input value={number} inputMode="numeric" onChange={(e) => setNumber(sanitiseNumber(e.target.value))} />
                      </label>
                    </div>
                    <fieldset className="opt">
                      <legend>Lettering</legend>
                      <div className="chips">
                        {FONTS.map((f) => (
                          <button key={f.id} className={`chip chip--font ${f.id === design.font ? 'is-active' : ''}`} style={{ fontFamily: f.family, fontWeight: f.weight }} onClick={() => set('font')(f.id)} aria-pressed={f.id === design.font}>
                            {f.label} 19
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <ColourRow label="Lettering colour" value={design.textColor} onChange={set('textColor')} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="cz__buy">
            <fieldset className="opt">
              <legend>Size</legend>
              <div className="chips">
                {SIZES.map((s) => (
                  <button key={s} className={`chip ${s === size ? 'is-active' : ''}`} onClick={() => setSize(s)} aria-pressed={s === size}>
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="cz__summary">
              <span>
                {template.label} · {describeDesign(design)}
              </span>
              <strong>{product ? formatCAD(product.price) : ''}</strong>
            </div>
            <Button onClick={add} className="btn--block">
              Add design to order
            </Button>
            <p className="cz__more">
              Need a different cut or a completely new garment?{' '}
              <a href="#studio">See the full design tool ↓</a>
            </p>
          </div>
        </Reveal>
      </div>

      <StudioCta />
    </section>
  )
}

function PatternIcon({ id, a, b, base }: { id: Design['pattern']; a: string; b: string; base: string }) {
  const rows: Record<Design['pattern'], [number, number, string][]> = {
    none: [],
    classic: [[16, 4, b], [20, 8, a], [28, 4, b]],
    bold: [[14, 16, a]],
    triple: [[13, 4, a], [20, 4, a], [27, 4, a]],
    split: [[14, 8, a], [22, 8, b]],
  }
  return (
    <svg viewBox="0 0 44 44" aria-hidden>
      <rect width="44" height="44" rx="10" fill={base} />
      {rows[id].map(([y, h, c], i) => (
        <rect key={i} x="0" y={y} width="44" height={h} fill={c} />
      ))}
      <rect width="44" height="44" rx="10" fill="none" stroke="rgba(15,16,18,.15)" />
    </svg>
  )
}
