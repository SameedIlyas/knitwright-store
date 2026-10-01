import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store/cart'
import { EASE } from './motion'
import { LogoMark } from './ui'

export function Toasts() {
  const { toasts, setDrawerOpen } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            className="notif"
            layout
            onClick={() => setDrawerOpen(true)}
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="notif__icon">
              <LogoMark />
            </span>
            <span>
              <strong>{t.title}</strong>
              <small>{t.body}</small>
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
