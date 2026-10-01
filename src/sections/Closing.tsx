import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ScenePhoto } from '../components/Photo'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Button, Frame, Icon, Logo, LogoMark, SectionTag } from '../components/ui'
import { FAQ, FOOTER } from '../data/content'

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function Faq() {
  // Closed by default. On devices with a mouse, an answer opens while its question is hovered;
  // click/tap and keyboard (Enter/Space on the focused question) still toggle it.
  const [open, setOpen] = useState<number | null>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const cols = [FAQ.filter((_, i) => i % 2 === 0), FAQ.filter((_, i) => i % 2 === 1)]

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const hoverOpen = (i: number) => {
    if (!canHover()) return
    window.clearTimeout(closeTimer.current)
    setOpen(i)
  }
  // A short delay stops answers flickering shut while the cursor crosses the gap between items.
  const hoverClose = () => {
    if (!canHover()) return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(null), 160)
  }

  return (
    <section className="section" id="faq">
      <SectionTag>FAQ</SectionTag>
      <div className="section__head section__head--center">
        <SplitHeadline text="Frequently asked questions" />
      </div>
      <div className="faq">
        {cols.map((col, c) => (
          <div key={c} className="faq__col">
            {col.map((item, j) => {
              const i = j * 2 + c
              const isOpen = open === i
              return (
                <Reveal key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`} delay={j * 0.06} y={24}>
                  <div onMouseEnter={() => hoverOpen(i)} onMouseLeave={hoverClose}>
                    <button className="faq__q" aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                      <span>{item.q}</span>
                      <span className="faq__toggle" aria-hidden>
                        <Icon name="plus" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div id={`faq-a-${i}`} className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                          <p>{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

const NOTIFS = [
  { title: 'Sample approved', body: '24 home jerseys · ready for bulk', cls: 'cta__notif--a' },
  { title: 'Order shipped', body: '60 pieces · arriving Thursday', cls: 'cta__notif--b' },
] as const

export function Closing() {
  const [subscribed, setSubscribed] = useState(false)
  return (
    <div className="closing" id="contact">
      <div className="closing__panel">
        <Frame className="cta-frame">
          <div className="cta">
            <div className="cta__copy">
              <SplitHeadline text={"Start your team's\nkit with Knitwright."} />
              <Reveal as="p" className="lede">
                Send us your logo or an idea. Get mockups and a quote within 24 hours.
              </Reveal>
              <Reveal delay={0.1}>
                <Button href="#shop">Start your order</Button>
              </Reveal>
            </div>
            <div className="cta__art">
              <motion.div className="fill" initial={{ scale: 1.2 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }}>
                <ScenePhoto id="scene-team" className="fill" alt="Youth hockey team celebrating on the ice in matching jerseys" />
              </motion.div>
              {NOTIFS.map((n, i) => (
                <motion.div
                  key={n.title}
                  className={`notif cta__notif ${n.cls}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.5 + i * 0.35 }}
                >
                  <span className="notif__icon">
                    <LogoMark />
                  </span>
                  <span>
                    <strong>{n.title}</strong>
                    <small>{n.body}</small>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Frame>

        <footer className="footer">
          <div className="footer__brand">
            <Logo />
            <p>Custom team sportswear, from design to delivery. Made in Sialkot.</p>
            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault()
                setSubscribed(true)
                e.currentTarget.reset()
              }}
            >
              <label htmlFor="nl" className="mono">
                {subscribed ? "You're in. Check your inbox." : 'Get 15% off your first order'}
              </label>
              <div>
                <input id="nl" type="email" placeholder="you@club.ca" maxLength={120} required />
                <button type="submit" aria-label="Subscribe">
                  <Icon name="arrow" />
                </button>
              </div>
            </form>
          </div>
          <FooterCol title="Shop" items={FOOTER.shop} />
          <FooterCol title="Company" items={FOOTER.company} />
          <FooterCol title="Policies" items={FOOTER.policies} />
        </footer>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} Knitwright. All rights reserved.</span>
          <span className="mono">Sialkot · Toronto</span>
        </div>
      </div>
    </div>
  )
}

function FooterCol({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="footer__col">
      <p className="mono">{title}</p>
      {items.map((i) =>
        i.endsWith('↗') ? (
          <a key={i} href="https://knitwright.com" target="_blank" rel="noopener noreferrer">
            {i}
          </a>
        ) : (
          <a key={i} href="#top">
            {i}
          </a>
        ),
      )}
    </div>
  )
}
