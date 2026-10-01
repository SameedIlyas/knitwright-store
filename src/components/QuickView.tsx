import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { findProduct, type Product } from '../data/catalog'
import { useStore } from '../store/cart'
import { formatCAD, sanitiseName, sanitiseNumber } from '../store/cartLogic'
import { ProductVisual } from './ProductVisual'
import { EASE } from './motion'
import { Button, Icon } from './ui'
import { useDialog } from './useDialog'

export function QuickView() {
  const { quickView, setQuickView } = useStore()
  const product = quickView ? findProduct(quickView) : undefined
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setQuickView(null), [setQuickView])
  useDialog(ref, Boolean(product), close)

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div className="scrim" onClick={() => setQuickView(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <div className="modal-wrap">
            <motion.div
              ref={ref}
              className="modal"
              data-lenis-prevent
              role="dialog"
              aria-modal="true"
              aria-label={product.name}
              initial={{ opacity: 0, y: 60, scale: 0.96, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <ProductForm key={product.id} product={product} onDone={() => setQuickView(null)} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function ProductForm({ product, onDone }: { product: Product; onDone: () => void }) {
  const { addToCart, setDrawerOpen } = useStore()
  const [swatchName, setSwatchName] = useState(product.swatches[0].name)
  const [size, setSize] = useState(product.sizes[Math.min(4, product.sizes.length - 1)])
  const [qty, setQty] = useState(product.personalise ? 1 : 12)
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const swatch = product.swatches.find((s) => s.name === swatchName) ?? product.swatches[0]

  const add = (openCart: boolean) => {
    addToCart(
      {
        productId: product.id,
        swatch: swatch.name,
        size,
        qty,
        unitPrice: product.price,
        name: sanitiseName(name) || undefined,
        number: number || undefined,
      },
      product.name,
    )
    onDone()
    if (openCart) setDrawerOpen(true)
  }

  return (
    <div className="qv">
      <button className="icon-btn qv__close" onClick={onDone} aria-label="Close">
        <Icon name="close" />
      </button>
      <div className="qv__art">
        <div className="qv__grid" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={`${swatch.name}-${name || number ? 'back' : 'front'}`}
            initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 6, scale: 0.9 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <ProductVisual photo={product.photo} swatch={swatch} alt={`${product.name} in ${swatch.name}`} name={name || undefined} number={number || undefined} back={Boolean(name || number)} className="qv__garment" eager />
          </motion.div>
        </AnimatePresence>
        <span className="qv__spec mono">SPEC · {product.id.toUpperCase()}</span>
      </div>
      <div className="qv__info">
        <p className="mono qv__cat">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="qv__price">
          {formatCAD(product.price)} <span>/ unit at 50+</span>
        </p>
        <p className="qv__blurb">{product.blurb}</p>

        <fieldset className="opt">
          <legend>
            Colourway <span>{swatch.name}</span>
          </legend>
          <div className="swatches">
            {product.swatches.map((s) => (
              <button
                key={s.name}
                className={`swatch ${s.name === swatch.name ? 'is-active' : ''}`}
                style={{ background: `linear-gradient(135deg, ${s.color} 60%, ${s.accent} 60% 75%, ${s.trim} 75%)` }}
                onClick={() => setSwatchName(s.name)}
                aria-label={s.name}
                aria-pressed={s.name === swatch.name}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="opt">
          <legend>Size</legend>
          <div className="chips">
            {product.sizes.map((s) => (
              <button key={s} className={`chip ${s === size ? 'is-active' : ''}`} onClick={() => setSize(s)} aria-pressed={s === size}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        {product.personalise && (
          <div className="opt opt--row">
            <label className="field">
              <span>Player name</span>
              <input value={name} placeholder="e.g. TREMBLAY" onChange={(e) => setName(sanitiseName(e.target.value, { live: true }))} />
            </label>
            <label className="field field--sm">
              <span>No.</span>
              <input value={number} inputMode="numeric" placeholder="19" onChange={(e) => setNumber(sanitiseNumber(e.target.value))} />
            </label>
          </div>
        )}

        <div className="qv__buy">
          <div className="qty qty--lg">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              <Icon name="minus" />
            </button>
            <input value={qty} inputMode="numeric" aria-label="Quantity" onChange={(e) => setQty(Math.min(999, Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1)))} />
            <button onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Increase quantity">
              <Icon name="plus" />
            </button>
          </div>
          <Button onClick={() => add(true)} className="btn--grow">
            Add to order · {formatCAD(product.price * qty)}
          </Button>
        </div>
        <button className="link" onClick={() => add(false)}>
          Add and keep browsing
        </button>
      </div>
    </div>
  )
}
