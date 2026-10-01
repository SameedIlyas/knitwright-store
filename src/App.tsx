import Lenis from 'lenis'
import { MotionConfig } from 'motion/react'
import { Component, useEffect, type ReactNode } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Customiser } from './customiser/Customiser'
import { Header } from './components/Header'
import { QuickView } from './components/QuickView'
import { Toasts } from './components/Toasts'
import { Closing, Faq } from './sections/Closing'
import { Customise } from './sections/Customise'
import { Decoration, Range, Reasons } from './sections/Details'
import { Delivery } from './sections/Delivery'
import { Hero } from './sections/Hero'
import { Pricing, Programmes } from './sections/Pricing'
import { Process } from './sections/Process'
import { Shop } from './sections/Shop'
import { StoreProvider, useStore } from './store/cart'

function useSmoothScroll(paused: boolean) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -90 } })
    let frame = requestAnimationFrame(function raf(t) {
      lenis.raf(t)
      frame = requestAnimationFrame(raf)
    })
    ;(window as Window & { __lenis?: Lenis }).__lenis = lenis
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis
    document.documentElement.style.overflow = paused ? 'hidden' : ''
    // Make the page behind an open dialog unreachable for keyboard and screen readers.
    document.querySelectorAll('header.header, main, .closing').forEach((el) => el.toggleAttribute('inert', paused))
    if (paused) lenis?.stop()
    else lenis?.start()
  }, [paused])
}

function Page() {
  const { drawerOpen, quickView } = useStore()
  useSmoothScroll(drawerOpen || quickView !== null)

  return (
    <>
      <BlobDefs />
      <Header />
      <main>
        <Hero />
        <Customise />
        <Delivery />
        <Shop />
        <Decoration />
        <Reasons />
        <Range />
        <Process />
        <Pricing />
        <Customiser />
        <Programmes />
        <Faq />
      </main>
      <Closing />
      <CartDrawer />
      <QuickView />
      <Toasts />
    </>
  )
}

/** Organic "bitten" shapes used to mask large artwork, after cartflami's hero cut-outs. */
function BlobDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <clipPath id="blob-hero" clipPathUnits="objectBoundingBox">
          <path d="M0.07,0 H0.93 C0.97,0 1,0.03 1,0.075 V0.925 C1,0.97 0.97,1 0.93,1 H0.25 C0.21,1 0.18,0.97 0.18,0.925 V0.66 C0.18,0.59 0.14,0.55 0.08,0.55 C0.03,0.55 0,0.52 0,0.47 V0.075 C0,0.03 0.03,0 0.07,0 Z" />
        </clipPath>
        <clipPath id="blob-left" clipPathUnits="objectBoundingBox">
          <path d="M0.06,0 H0.8 C0.85,0 0.88,0.03 0.88,0.08 V0.26 C0.88,0.33 0.91,0.37 0.95,0.38 C0.98,0.39 1,0.42 1,0.47 V0.925 C1,0.97 0.97,1 0.93,1 H0.06 C0.025,1 0,0.97 0,0.925 V0.075 C0,0.03 0.025,0 0.06,0 Z" />
        </clipPath>
        <clipPath id="blob-right" clipPathUnits="objectBoundingBox">
          <path d="M0.08,0 H0.94 C0.975,0 1,0.03 1,0.075 V0.925 C1,0.97 0.975,1 0.94,1 H0.2 C0.16,1 0.13,0.97 0.13,0.925 V0.56 C0.13,0.49 0.1,0.45 0.05,0.43 C0.02,0.41 0,0.38 0,0.33 V0.075 C0,0.03 0.03,0 0.08,0 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    // A corrupt saved cart is the likeliest cause; clear it so a reload recovers.
    try {
      window.localStorage.removeItem('knitwright.cart.v1')
    } catch {
      // Storage unavailable: nothing to clear.
    }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="crash">
        <h2>Something went wrong.</h2>
        <p>We've reset your saved order. Reload the page to keep shopping.</p>
        <button className="btn btn--primary" onClick={() => window.location.reload()}>
          <span className="btn__label">Reload</span>
        </button>
      </div>
    )
  }
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <StoreProvider>
          <Page />
        </StoreProvider>
      </ErrorBoundary>
    </MotionConfig>
  )
}
