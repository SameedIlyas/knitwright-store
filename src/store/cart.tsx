import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { PRODUCTS, findProduct } from '../data/catalog'
import { cartReducer, countItems, emptyCart, subtotal, type CartAction, type CartLine, type CartState } from './cartLogic'

const STORAGE_KEY = 'knitwright.cart.v1'

export interface Toast {
  id: number
  title: string
  body: string
}

interface StoreValue {
  cart: CartState
  dispatch: (a: CartAction) => void
  count: number
  total: number
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  quickView: string | null
  setQuickView: (id: string | null) => void
  addToCart: (line: Omit<CartLine, 'key'>, label: string) => void
  toasts: readonly Toast[]
}

const StoreContext = createContext<StoreValue | null>(null)

function readStored(): readonly unknown[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const KNOWN_IDS = PRODUCTS.map((p) => p.id)

/** Restores the stored cart, dropping anything invalid and re-pricing from the catalog. */
function hydrate(initial: CartState): CartState {
  const restored = cartReducer(initial, { type: 'hydrate', lines: readStored(), knownIds: KNOWN_IDS })
  return { lines: restored.lines.map((l) => ({ ...l, unitPrice: findProduct(l.productId)?.price ?? l.unitPrice })) }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, emptyCart, hydrate)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [quickView, setQuickView] = useState<string | null>(null)
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.lines))
    } catch {
      // Storage can be unavailable (private mode); the cart still works in memory.
    }
  }, [cart])

  const addToCart = useCallback((line: Omit<CartLine, 'key'>, label: string) => {
    dispatch({ type: 'add', line })
    const id = ++toastId.current
    setToasts((t) => [...t, { id, title: 'Added to order', body: `${line.qty} × ${label}` }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      dispatch,
      count: countItems(cart),
      total: subtotal(cart),
      drawerOpen,
      setDrawerOpen,
      quickView,
      setQuickView,
      addToCart,
      toasts,
    }),
    [cart, drawerOpen, quickView, addToCart, toasts],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
