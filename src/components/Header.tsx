import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { NAV } from '../data/content'
import { useStore } from '../store/cart'
import { EASE } from './motion'
import { Icon, Logo } from './ui'
import { useDialog } from './useDialog'

export function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setDrawerOpen } = useStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useDialog(menuRef, menuOpen, closeMenu)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 140))

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'header--scrolled' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <svg className="header__shape" viewBox="0 0 1200 76" preserveAspectRatio="none" aria-hidden>
          <path d="M0 0H1200C1150 0 1132 76 1070 76H130C68 76 50 0 0 0Z" />
        </svg>
        <div className="header__inner">
          <Logo />
          <nav className="header__nav" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header__actions">
            <a className="header__login" href="#contact">
              Team account
            </a>
            <button className="header__cart" onClick={() => setDrawerOpen(true)} aria-label={`Open order, ${count} items`}>
              <span>Order</span>
              <motion.span key={count} className="header__count" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                {count}
              </motion.span>
            </button>
            <button className="header__burger" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu">
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <button className="mobile-menu__close" onClick={closeMenu} aria-label="Close menu">
              <Icon name="close" />
            </button>
            <nav aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
