import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ScenePhoto } from '../components/Photo'
import { designFromSwatch } from '../customiser/design'
import { JerseyPreview } from '../customiser/JerseyPreview'
import { TEMPLATES } from '../customiser/templates'
import { EASE, SplitHeadline } from '../components/motion'
import { Button, Icon } from '../components/ui'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const jerseyRotate = useTransform(scrollYProgress, [0, 1], [-8, 10])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero__frame">
        <div className="hero__copy">
          <motion.div className="hero__eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.2 }}>
            <span>Made in Sialkot</span>
            <a href="#builder" className="pill-link">
              Design yours <Icon name="arrow" />
            </a>
          </motion.div>

          <SplitHeadline as="h1" className="hero__title" text={'Custom team\nsportswear,\nfrom design\nto delivery.'} scrub={false} delay={0.25} />

          <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, ease: EASE, delay: 0.9 }}>
            <Button href="#shop">Shop the collection</Button>
          </motion.div>

          <motion.p className="hero__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.1 }}>
            Hockey and baseball uniforms, apparel and bags, <span>fully custom in colour, fabric and design.</span> Sampled in 10 days, from 50 pieces.
          </motion.p>
        </div>

        <motion.div className="hero__art blob" style={{ y: artY }} initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}>
          <ScenePhoto id="scene-hero" className="fill" alt="Youth hockey player in a black and cobalt Knitwright jersey skating toward the arena lights" eager />
          <motion.div className="hero__phone" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}>
            <div className="phone">
              <div className="phone__bar">
                <span className="mono">9:41</span>
                <span className="phone__island" />
                <span className="mono">5G</span>
              </div>
              <p className="phone__store mono">KNITWRIGHT · ORDER #4821</p>
              <p className="phone__hi">Hi, Coach</p>
              <div className="phone__card">
                <div className="phone__row">
                  <span>Home jerseys</span>
                  <span className="tag-ok">Sample approved</span>
                </div>
                <strong>60 pieces</strong>
                <small>Bulk production · week 2 of 5</small>
                <div className="phone__bars">
                  {[30, 52, 44, 70, 62, 88, 76].map((h, i) => (
                    <motion.i key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.9, ease: EASE, delay: 1.1 + i * 0.07 }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div className="hero__jersey" style={{ rotate: jerseyRotate }}>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <JerseyPreview
                view={TEMPLATES[0].views.front}
                design={{ ...designFromSwatch({ color: '#2b46f0', accent: '#ffffff', trim: '#0f1012' }), sleeves: '#17181b', yoke: '#17181b' }}
                className="hero__jersey-svg"
                title="Cobalt and black custom hockey jersey"
              />
            </motion.div>
          </motion.div>
          <motion.div className="float-card hero__chip" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 1.4 }}>
            <span className="dot-ok" />
            <span>
              <strong>Verified for production</strong>
              <small>Seams, grading & fabric checked</small>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
