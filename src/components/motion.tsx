import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ElementType, type ReactNode } from 'react'

/** Framer easing used across cartflami's appear effects. */
export const EASE = [0.25, 0.01, 0, 1] as const

type Tone = 'light' | 'dark'

const INK: Record<Tone, [string, string]> = {
  light: ['rgba(15,16,18,0.22)', 'rgba(15,16,18,1)'],
  dark: ['rgba(255,255,255,0.28)', 'rgba(255,255,255,1)'],
}

interface SplitHeadlineProps {
  text: string
  as?: ElementType
  className?: string
  tone?: Tone
  /** When false, words are inked immediately instead of by scroll position. */
  scrub?: boolean
  delay?: number
}

/**
 * Headline that types in letter by letter (opacity + x + blur, staggered) and then
 * "inks" word by word as it scrolls through the viewport. Use `\n` for line breaks.
 */
export function SplitHeadline({ text, as: Tag = 'h2', className, tone = 'light', scrub = true, delay = 0 }: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.4'] })
  const lines = text.split('\n').map((l) => l.split(' ').filter(Boolean))
  const total = lines.reduce((n, l) => n + l.length, 0)
  let wordIndex = 0
  let letterIndex = 0

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        style={{ display: 'block' }}
      >
        {lines.map((words, li) => (
          <span key={li} style={{ display: 'block' }}>
            {words.map((word, wi) => {
              const i = wordIndex++
              const start = letterIndex
              letterIndex += word.length
              return (
                <Word key={wi} progress={scrollYProgress} index={i} total={total} tone={tone} scrub={scrub}>
                  {Array.from(word).map((ch, ci) => (
                    <motion.span
                      key={ci}
                      style={{ display: 'inline-block' }}
                      variants={{
                        hidden: { opacity: 0.001, x: 20, filter: 'blur(6px)' },
                        show: {
                          opacity: 1,
                          x: 0,
                          filter: 'blur(0px)',
                          transition: { duration: 0.9, ease: EASE, delay: delay + (start + ci) * 0.018 },
                        },
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  {wi < words.length - 1 ? ' ' : null}
                </Word>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

interface WordProps {
  progress: MotionValue<number>
  index: number
  total: number
  tone: Tone
  scrub: boolean
  children: ReactNode
}

function Word({ progress, index, total, tone, scrub, children }: WordProps) {
  const [from, to] = INK[tone]
  const start = index / total
  const end = Math.min(1, start + 1.5 / total)
  const color = useTransform(progress, [start, end], [from, to])
  return (
    <motion.span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: scrub ? color : undefined }}>{children}</motion.span>
  )
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'article' | 'p' | 'section'
}

/** Fade + rise + de-blur on enter, matching the reference's appear effect. */
export function Reveal({ children, className, delay = 0, y = 40, as = 'div' }: RevealProps) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

interface ParallaxProps {
  children: ReactNode
  className?: string
  distance?: number
}

export function Parallax({ children, className, distance = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  speed?: number
  className?: string
}

export function Marquee({ children, reverse, speed = 40, className }: MarqueeProps) {
  return (
    <div className={`marquee ${className ?? ''}`}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
