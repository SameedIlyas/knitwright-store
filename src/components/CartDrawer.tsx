import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { findProduct } from '../data/catalog'
import { useStore } from '../store/cart'
import { BULK_MIN, formatCAD, validateOrderForm, type CartLine, type OrderErrors, type OrderForm } from '../store/cartLogic'
import { describeDesign } from '../customiser/design'
import { buildQuote, sendQuote } from '../lib/quote'
import { TintedPhoto } from './Photo'
import { ProductVisual } from './ProductVisual'
import { EASE } from './motion'
import { Button, Icon } from './ui'
import { useDialog } from './useDialog'

type Step = 'cart' | 'details' | 'sent'

const EMPTY_FORM: OrderForm = { name: '', email: '', team: '' }
const FIELDS = [
  { id: 'name', label: 'Your name', type: 'text', auto: 'name' },
  { id: 'email', label: 'Email', type: 'email', auto: 'email' },
  { id: 'team', label: 'Team or organisation (optional)', type: 'text', auto: 'organization' },
] as const

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen } = useStore()
  const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen])

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div className="scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <DrawerPanel onClose={close} />
        </>
      )}
    </AnimatePresence>
  )
}

/** Mounted only while open, so its step state starts fresh on every open. */
function DrawerPanel({ onClose }: { onClose: () => void }) {
  const { cart, dispatch, total, count } = useStore()
  const [step, setStep] = useState<Step>('cart')
  const ref = useRef<HTMLElement>(null)
  useDialog(ref, true, onClose)

  const title = step === 'details' ? 'Request a quote' : step === 'sent' ? 'Request sent' : `${count} ${count === 1 ? 'item' : 'items'}`

  return (
    <motion.aside
      ref={ref}
      className="drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      initial={{ x: '105%' }}
      animate={{ x: 0 }}
      exit={{ x: '105%' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <header className="drawer__head">
        <div>
          <p className="mono">Your order</p>
          <h3 id="drawer-title">{title}</h3>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close order">
          <Icon name="close" />
        </button>
      </header>

      {step === 'cart' && (
        <>
          <div className="drawer__body" data-lenis-prevent>
            {cart.lines.length === 0 && (
              <div className="drawer__empty">
                <TintedPhoto photo="hockey-front" color="#e9eaee" alt="" className="drawer__empty-art" />
                <p>Your order is empty. Add a few pieces to start.</p>
                <Button href="#shop" onClick={onClose} variant="ghost">
                  Browse the shop
                </Button>
              </div>
            )}
            <AnimatePresence initial={false}>
              {cart.lines.map((line) => (
                <LineRow key={line.key} line={line} />
              ))}
            </AnimatePresence>
          </div>
          {cart.lines.length > 0 && (
            <footer className="drawer__foot">
              <BulkMeter count={count} />
              <div className="drawer__total">
                <span>Estimated subtotal</span>
                <strong>{formatCAD(total)}</strong>
              </div>
              <p className="drawer__fine">Final pricing is confirmed on your quote. Taxes and shipping are calculated at approval.</p>
              <Button onClick={() => setStep('details')} className="btn--block">
                Request quote
              </Button>
            </footer>
          )}
        </>
      )}

      {step === 'details' && (
        <QuoteForm
          lines={cart.lines}
          count={count}
          total={total}
          onBack={() => setStep('cart')}
          onSent={() => {
            dispatch({ type: 'clear' })
            setStep('sent')
          }}
        />
      )}

      {step === 'sent' && <Sent onClose={onClose} />}
    </motion.aside>
  )
}

function LineRow({ line }: { line: CartLine }) {
  const { dispatch } = useStore()
  const [draft, setDraft] = useState<string | null>(null)
  const product = findProduct(line.productId)
  const swatch = product?.swatches.find((s) => s.name === line.swatch) ?? product?.swatches[0]
  if (!product || !swatch) return null

  const commit = () => {
    if (draft === null) return
    dispatch({ type: 'setQty', key: line.key, qty: draft === '' ? line.qty : Number(draft) })
    setDraft(null)
  }

  return (
    <motion.div
      className="line"
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="line__art">
        <ProductVisual photo={product.photo} swatch={swatch} design={line.custom} name={line.name} number={line.number} back={Boolean(line.name || line.number)} alt={product.name} />
      </div>
      <div className="line__info">
        <p className="line__name">{product.name}</p>
        <p className="line__meta">
          {line.custom ? describeDesign(line.custom) : line.swatch} · {line.size}
          {line.name ? ` · ${line.name}` : ''}
          {line.number ? ` #${line.number}` : ''}
        </p>
        <div className="qty">
          <button onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty - 1 })} aria-label="Decrease quantity">
            <Icon name="minus" />
          </button>
          <input
            value={draft ?? String(line.qty)}
            inputMode="numeric"
            aria-label={`Quantity of ${product.name}`}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 3))}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
          />
          <button onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty + 1 })} aria-label="Increase quantity">
            <Icon name="plus" />
          </button>
        </div>
      </div>
      <div className="line__right">
        <p>{formatCAD(line.unitPrice * line.qty)}</p>
        <button className="link" onClick={() => dispatch({ type: 'remove', key: line.key })}>
          Remove
        </button>
      </div>
    </motion.div>
  )
}

interface QuoteFormProps {
  lines: readonly CartLine[]
  count: number
  total: number
  onBack: () => void
  onSent: () => void
}

function QuoteForm({ lines, count, total, onBack, onSent }: QuoteFormProps) {
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<OrderErrors>({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    const found = validateOrderForm(form)
    setErrors(found)
    const firstInvalid = FIELDS.find((f) => found[f.id])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`#order-${firstInvalid.id}`)?.focus()
      return
    }
    // Bots tick the hidden box; pretend it worked without sending anything.
    if (honeypot) return onSent()
    setSending(true)
    setSendError(null)
    const result = await sendQuote(buildQuote(form, lines), import.meta.env.VITE_WEB3FORMS_KEY)
    setSending(false)
    if (result.ok) onSent()
    else setSendError(result.error)
  }

  return (
    <form ref={formRef} className="drawer__body drawer__form" onSubmit={submit} noValidate data-lenis-prevent>
      <p className="drawer__fine">We reply with a tech pack, mockups and a confirmed quote within 24 hours.</p>
      {FIELDS.map((f) => (
        <label key={f.id} className="field" htmlFor={`order-${f.id}`}>
          <span>{f.label}</span>
          <input
            id={`order-${f.id}`}
            type={f.type}
            value={form[f.id]}
            maxLength={120}
            autoComplete={f.auto}
            aria-invalid={Boolean(errors[f.id])}
            aria-describedby={errors[f.id] ? `order-${f.id}-error` : undefined}
            onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
          />
          {errors[f.id] && (
            <em className="field__error" id={`order-${f.id}-error`} role="alert">
              {errors[f.id]}
            </em>
          )}
        </label>
      ))}
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden checked={honeypot} onChange={(e) => setHoneypot(e.target.checked)} />
      <div className="drawer__total">
        <span>
          {count} {count === 1 ? 'item' : 'items'}
        </span>
        <strong>{formatCAD(total)}</strong>
      </div>
      {sendError && (
        <p className="field__error" role="alert">
          {sendError}
        </p>
      )}
      <Button type="submit" className="btn--block" disabled={sending}>
        {sending ? 'Sending…' : 'Send request'}
      </Button>
      <button type="button" className="link" onClick={onBack}>
        Back to order
      </button>
    </form>
  )
}

function Sent({ onClose }: { onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])
  return (
    <motion.div className="drawer__body drawer__sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <span className="sent-badge">
        <Icon name="check" />
      </span>
      <h4 ref={headingRef} tabIndex={-1}>
        Thanks, we're on it.
      </h4>
      <p>A Knitwright specialist will send your tech pack and quote within 24 hours.</p>
      <Button onClick={onClose} variant="ghost">
        Keep browsing
      </Button>
    </motion.div>
  )
}

function BulkMeter({ count }: { count: number }) {
  const pct = Math.min(100, (count / BULK_MIN) * 100)
  const bulk = count >= BULK_MIN
  return (
    <div className="meter">
      <div className="meter__row">
        <span>{bulk ? 'Bulk pricing unlocked' : `${BULK_MIN - count} more pieces for bulk pricing`}</span>
        <span className="mono">
          {Math.min(count, BULK_MIN)}/{BULK_MIN}
        </span>
      </div>
      <div className="meter__track">
        <motion.div className="meter__fill" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: EASE }} />
      </div>
      {!bulk && <p className="drawer__fine">Orders under {BULK_MIN} pieces per style ship as samples.</p>}
    </div>
  )
}
