import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from './motion'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 183 163" className={className} fill="currentColor" aria-hidden>
      <path d="M0 0H183L155 37ZM106 46H147L57 163Z" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={`logo ${className ?? ''}`} aria-label="Knitwright store, home">
      <LogoMark className="logo__mark" />
      <span>Knitwright</span>
      <span className="logo__store">Store</span>
    </a>
  )
}

const ICONS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M7 17 17 7M8 7h9v9',
  cart: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M10 21h.01M17 21h.01',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z',
  shirt: 'M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0Z',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z',
  needle: 'M4 20 20 4M15 4h5v5M7 13l4 4',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  layers: 'm12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  palette: 'M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.3-1-1.6-1-2.8 0-.9.7-1.7 1.7-1.7H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8ZM7.5 11h.01M10 7h.01M15 7h.01',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
  pin: 'M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12ZM12 11a2 2 0 1 0 0-.01',
  bag: 'M5 8h14l-1 13H6ZM9 8V6a3 3 0 0 1 6 0v2',
  menu: 'M4 7h16M4 12h16M4 17h16',
} as const

export type IconName = keyof typeof ICONS

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className ?? ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  )
}

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'light'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

/** Pill button with an arrow chip, cartflami's CTA shape in Knitwright cobalt. */
export function Button({ children, href, onClick, variant = 'primary', className, type = 'button', disabled }: ButtonProps) {
  const cls = `btn btn--${variant} ${className ?? ''}`
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      <span className="btn__chip">
        <Icon name="arrow" />
      </span>
    </>
  )
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick}>
        {inner}
      </a>
    )
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}

/** Dashed full-width divider with dot terminals and a corner-bracketed label. */
export function SectionTag({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <div className={`section-tag section-tag--${tone}`}>
      <motion.span
        className="section-tag__line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <span className="section-tag__dot section-tag__dot--l" />
      <span className="section-tag__dot section-tag__dot--r" />
      <motion.span
        className="section-tag__label"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
      >
        <i className="corner corner--tl" />
        <i className="corner corner--tr" />
        <i className="corner corner--bl" />
        <i className="corner corner--br" />
        {children}
      </motion.span>
    </div>
  )
}

/** Grey frame with triangular corner marks, wrapping bento cards. */
export function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`frame ${className ?? ''}`}>
      <i className="frame__c frame__c--tl" />
      <i className="frame__c frame__c--tr" />
      <i className="frame__c frame__c--bl" />
      <i className="frame__c frame__c--br" />
      {children}
    </div>
  )
}
