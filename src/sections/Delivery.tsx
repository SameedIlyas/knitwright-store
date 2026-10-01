import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ScenePhoto } from '../components/Photo'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Button, Icon } from '../components/ui'

export function Delivery() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1])

  return (
    <section className="split" ref={ref}>
      <Reveal className="split__art blob-left" y={60}>
        <motion.div className="fill" style={{ scale }}>
          <ScenePhoto id="scene-shipping" className="fill" alt="Folded black and cobalt team shirts packed in shipping boxes" />
        </motion.div>
        <motion.div className="float-card split__ticket" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}>
          <span className="float-card__icon">
            <Icon name="truck" />
          </span>
          <span>
            <strong>Shipped early · 3 days ahead</strong>
            <small>Sialkot → Toronto, 120 pieces</small>
          </span>
        </motion.div>
      </Reveal>

      <div className="split__copy">
        <SplitHeadline text={'Fast, on-time\ndeliveries. No\nbackorders.'} />
        <Reveal as="p" className="lede" delay={0.1}>
          We deliver on time, often early, and we've never had a backorder or a short shipment. Need kit for an emergency? We handle that too, and we manage your stock.
        </Reveal>
        <Reveal delay={0.2}>
          <ul className="ticks">
            <li>
              <Icon name="check" /> Samples in 10 working days
            </li>
            <li>
              <Icon name="check" /> Bulk production in 4–5 weeks
            </li>
            <li>
              <Icon name="check" /> Tracked shipping to your door
            </li>
          </ul>
          <Button href="#process">See how it works</Button>
        </Reveal>
      </div>
    </section>
  )
}
