import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EASE, Reveal } from '../components/motion'
import { Icon, LogoMark } from '../components/ui'

export const STUDIO_URL = 'https://knitwright.com'

const HERE = ['Our jersey styles', 'Colours, stripes and lettering', 'Your logo on the chest', 'Names and numbers'] as const

const STUDIO = [
  'Any style: polo, raglan, henley, base layers, run tops…',
  'Start from a sketch, photo, reference product or moodboard',
  'Logos anywhere, in any technique (sleeves, back, embroidery, patches)',
  'Ask for changes in plain language',
  'Factory-ready tech pack in under 10 minutes',
] as const

const PROMPTS = [
  { ask: 'Make it a raglan', reply: 'Switched to a raglan sleeve. The flat, pattern pieces and graded table all moved with it.' },
  { ask: 'Polo collar, crest on left sleeve', reply: 'Added a two-button polo collar and placed your crest 8 cm below the left shoulder seam.' },
  { ask: 'Long sleeves, cobalt body', reply: 'Lengthened the sleeves and set the body to cobalt. Graded XS to 3XL.' },
] as const

/** Hands shoppers who need more than the quick customiser over to the full Knitwright design tool. */
export function StudioCta() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => (s + 1) % PROMPTS.length), 4200)
    return () => window.clearInterval(t)
  }, [])

  const prompt = PROMPTS[step]

  return (
    <Reveal className="studio" y={60}>
      <span id="studio" className="studio__anchor" />
      <div className="studio__copy">
        <p className="studio__eyebrow mono">Need more than colours?</p>
        <h3 className="studio__title">
          Want a different style, or something completely new?
          <span> Design it on knitwright.com.</span>
        </h3>
        <p className="studio__lede">
          The customiser above is the quick way to kit out a team in our ready styles. For anything else, use the full Knitwright design tool: describe it or upload a sketch, and it drafts a spec our factory builds from.
        </p>

        <div className="studio__compare">
          <div className="studio__col">
            <p className="mono">Here, in the store</p>
            <ul>
              {HERE.map((item) => (
                <li key={item}>
                  <Icon name="check" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="studio__col studio__col--accent">
            <p className="mono">On knitwright.com</p>
            <ul>
              {STUDIO.map((item) => (
                <li key={item}>
                  <Icon name="check" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="studio__actions">
          <a className="btn btn--light" href={STUDIO_URL} target="_blank" rel="noopener noreferrer">
            <span className="btn__label">Open the design tool</span>
            <span className="btn__chip">
              <Icon name="arrowUp" />
            </span>
          </a>
          <p className="studio__note">Opens knitwright.com in a new tab · early access, join the waitlist there</p>
        </div>
      </div>

      <div className="studio__demo" aria-hidden>
        <div className="studio__phone">
          <div className="studio__bar mono">
            <span>9:41</span>
            <span className="studio__island" />
            <span>●●</span>
          </div>
          <div className="studio__orb">
            <LogoMark />
          </div>
          <p className="studio__ask">What are we making?</p>
          <p className="studio__hint">Describe a change in plain language.</p>

          <div className="studio__chat">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
                <p className="studio__msg studio__msg--me">{prompt.ask}</p>
                <motion.p className="studio__msg studio__msg--bot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45, ease: EASE }}>
                  <span className="studio__dot" />
                  {prompt.reply}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="studio__chips">
            {PROMPTS.map((p, i) => (
              <span key={p.ask} className={i === step ? 'is-active' : ''}>
                {p.ask}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
