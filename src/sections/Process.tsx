import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ScenePhoto } from '../components/Photo'
import { ProductVisual } from '../components/ProductVisual'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Button, Icon, LogoMark, type IconName } from '../components/ui'
import { SOLUTIONS, STEPS } from '../data/content'

const SOLUTION_ICONS: readonly IconName[] = ['shield', 'layers', 'shirt', 'bag']

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="dark-wrap" id="process">
      <div className="dark">
        <div className="dark__ridge" aria-hidden>
          <ScenePhoto id="scene-factory" className="fill" alt="" />
        </div>
        <div className="dark__top">
          <div className="dark__copy">
            <SplitHeadline text={'From sketch\nto shipped,\nin one place.'} tone="dark" />
            <Reveal as="p" className="lede lede--dark">
              Track every order from tech pack to delivery, and make decisions with real data.
            </Reveal>
            <Reveal delay={0.1}>
              <Button href="#builder" variant="light">
                Start a design
              </Button>
            </Reveal>
          </div>

          <Reveal className="dash" y={80}>
            <aside className="dash__side">
              <p className="dash__brand">
                <LogoMark className="dash__mark" /> Knitwright
              </p>
              {(['Overview', 'Orders', 'Tech packs', 'Roster', 'Reorders'] as const).map((l, i) => (
                <span key={l} className={i === 1 ? 'is-active' : ''}>
                  {l}
                </span>
              ))}
            </aside>
            <div className="dash__main">
              <div className="dash__head">
                <strong>Order #4821 · Home kit</strong>
                <span className="tag-ok">On schedule</span>
              </div>
              <div className="dash__stats">
                {[
                  ['Minimum', '50 pcs'],
                  ['Sample', '10 days'],
                  ['Bulk', '4–5 wks'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div className="steps" ref={ref}>
                <div className="steps__rail">
                  <motion.i style={{ height: fill }} />
                </div>
                {STEPS.map((s, i) => (
                  <motion.div key={s.n} className="step" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
                    <span className="step__n mono">{s.n}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="dash__flat">
                <ProductVisual photo="hockey-front" swatch={{ color: '#2b46f0', accent: '#ffffff', trim: '#0f1012' }} alt="Approved jersey sample" />
                <span className="mono">Tech pack · v3 · signed</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="solutions" y={60}>
          <SplitHeadline className="solutions__title" text={'Solutions for\nevery organisation.'} tone="dark" />
          <div className="solutions__grid">
            {SOLUTIONS.map((s, i) => (
              <div key={s.title} className="solution">
                <span className="solution__icon">
                  <Icon name={SOLUTION_ICONS[i]} />
                </span>
                <h5>{s.title}</h5>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
