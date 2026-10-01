import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Modal dialog behaviour: moves focus inside on open, traps Tab, closes on Escape
 * and returns focus to whatever opened it.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void): void {
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const node = ref.current
    const current = document.activeElement as HTMLElement | null
    // Effects can re-run (StrictMode, new onClose); never record an element inside the dialog as the opener.
    if (current && !node?.contains(current)) openerRef.current = current
    const first = node?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const head = items[0]
      const tail = items[items.length - 1]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      // Wait a frame so the page behind is no longer inert before focusing back.
      const opener = openerRef.current
      requestAnimationFrame(() => {
        if (opener?.isConnected && !ref.current?.isConnected) opener.focus({ preventScroll: true })
      })
    }
  }, [active, ref, onClose])
}
