import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ScenePhoto, TintedPhoto } from '../components/Photo'
import { ProductVisual } from '../components/ProductVisual'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Frame, Icon, SectionTag, type IconName } from '../components/ui'
import { CUSTOMISE } from '../data/content'

const ICON: Record<(typeof CUSTOMISE)[number]['id'], IconName> = {
  sublimation: 'drop',
  stitching: 'needle',
  fabric: 'palette',
  embroidery: 'layers',
  patch: 'shield',
}

function CardHead({ id }: { id: (typeof CUSTOMISE)[number]['id'] }) {
  const item = CUSTOMISE.find((c) => c.id === id)!
  return (
    <div className="bento__head">
      <span className="bento__icon">
        <Icon name={ICON[id]} />
      </span>
      <h4>{item.title}</h4>
      <p>{item.body}</p>
    </div>
  )
}

const COLOURS = ['#2b46f0', '#c2362b', '#0f7b59', '#f2b833', '#17181b'] as const

function useCycle(length: number, ms: number): number {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % length), ms)
    return () => window.clearInterval(t)
  }, [length, ms])
  return i
}

export function Customise() {
  const colour = useCycle(COLOURS.length, 1800)

  return (
    <section className="section" id="customise">
      <SectionTag>Customisation</SectionTag>
      <div className="section__head section__head--center">
        <SplitHeadline text={'Fully customise\nyour uniforms.'} />
        <Reveal as="p" className="lede">
          Team logos, player names and numbers, team colours, sponsor branding, plus matching accessories and outerwear.
        </Reveal>
      </div>

      <div className="bento">
        <Reveal className="bento__cell bento__cell--a">
          <Frame>
            <div className="bento__card bento__card--tall">
              <CardHead id="sublimation" />
              <div className="bento__media blob-sm">
                <ScenePhoto id="scene-sublimation" className="fill" alt="Sublimation press transferring a cobalt pattern onto jersey fabric" />
              </div>
            </div>
          </Frame>
        </Reveal>

        <Reveal className="bento__cell bento__cell--b" delay={0.1}>
          <Frame>
            <div className="bento__card bento__card--split">
              <CardHead id="stitching" />
              <div className="bump">
                <div className="bump__card">
                  <div className="bump__thumb">
                    <ProductVisual photo="hockey-front" swatch={{ color: '#17181b', accent: '#8296ff', trim: '#2b46f0' }} alt="Black hockey jersey" />
                  </div>
                  <p>Twill names & numbers</p>
                  <p className="bump__price">
                    <s>$12</s> <strong>Included</strong>
                  </p>
                  <div className="bump__check">
                    <span className="bump__box">
                      <Icon name="check" />
                    </span>
                    Add to every jersey
                  </div>
                </div>
                <span className="cursor cursor--bump" aria-hidden>
                  <CursorSvg />
                </span>
              </div>
            </div>
          </Frame>
        </Reveal>

        <Reveal className="bento__cell bento__cell--c" delay={0.15}>
          <Frame>
            <div className="bento__card bento__card--split">
              <CardHead id="fabric" />
              <div className="palette">
                <motion.div key={colour} initial={{ opacity: 0, scale: 0.92, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                  <TintedPhoto photo="hoodie" color={COLOURS[colour]} alt="Team hoodie in a rotating colourway" className="palette__art" />
                </motion.div>
                <div className="palette__dots">
                  {COLOURS.map((c, i) => (
                    <span key={c} className={i === colour ? 'is-active' : ''} style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </Frame>
        </Reveal>

        <Reveal className="bento__cell bento__cell--d" delay={0.1}>
          <Frame>
            <div className="bento__card bento__card--split">
              <CardHead id="embroidery" />
              <div className="coupon">
                <div className="coupon__field">
                  <span className="coupon__icon">
                    <Icon name="layers" />
                  </span>
                  <span className="coupon__typed mono">CREST-01 · 9,400 stitches</span>
                  <span className="cursor cursor--coupon" aria-hidden>
                    <CursorSvg />
                  </span>
                </div>
                <div className="stitch-grid" aria-hidden>
                  {Array.from({ length: 40 }, (_, i) => (
                    <i key={i} style={{ animationDelay: `${(i % 10) * 0.08 + Math.floor(i / 10) * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </Frame>
        </Reveal>

        <Reveal className="bento__cell bento__cell--e" delay={0.15}>
          <Frame>
            <div className="bento__card bento__card--split">
              <CardHead id="patch" />
              <div className="patch-stage blob-sm">
                <motion.div className="fill" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
                  <ScenePhoto id="scene-crest" className="fill" alt="Embroidered crest patch with dense satin stitching" />
                </motion.div>
              </div>
            </div>
          </Frame>
        </Reveal>
      </div>
    </section>
  )
}

export function CursorSvg() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path d="M4 3 20 11 12.5 13 9.5 20Z" fill="#0f1012" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
