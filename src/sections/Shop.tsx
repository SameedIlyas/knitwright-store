import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ProductVisual } from '../components/ProductVisual'
import { EASE, Marquee, Reveal, SplitHeadline } from '../components/motion'
import { Icon, SectionTag } from '../components/ui'
import { CATEGORIES, filterProducts, type CategoryId, type Product } from '../data/catalog'
import { SPORTS } from '../data/content'
import { useStore } from '../store/cart'
import { formatCAD } from '../store/cartLogic'

export function Shop() {
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const products = filterProducts(category)

  return (
    <section className="section" id="shop">
      <SectionTag>Shop</SectionTag>

      <div className="shop__intro">
        <div className="shop__copy">
          <SplitHeadline text={'Explore our\nproducts.'} />
          <Reveal as="p" className="lede">
            Custom uniforms, apparel and accessories for hockey, baseball and every other sport. Every piece is made to order in your colours.
          </Reveal>
        </div>
        <div className="shop__rails" aria-hidden>
          <Marquee speed={38}>
            {SPORTS.slice(0, 6).map((s, i) => (
              <span key={s} className="sport-pill">
                {s} <i style={{ background: PILL_COLOURS[i % PILL_COLOURS.length] }} />
              </span>
            ))}
          </Marquee>
          <Marquee speed={44} reverse>
            {SPORTS.slice(6).map((s, i) => (
              <span key={s} className="sport-pill">
                {s} <i style={{ background: PILL_COLOURS[(i + 3) % PILL_COLOURS.length] }} />
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      <Reveal className="filters" y={20}>
        <div role="group" aria-label="Filter by category" className="filters__tabs">
          {CATEGORIES.map((c) => (
            <button key={c.id} aria-pressed={category === c.id} className={`filters__tab ${category === c.id ? 'is-active' : ''}`} onClick={() => setCategory(c.id)}>
              {category === c.id && <motion.span layoutId="tab-bg" className="filters__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <span className="mono filters__count" aria-live="polite">{products.length} products</span>
      </Reveal>

      <motion.div className="grid" layout>
        <AnimatePresence mode="popLayout">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

const PILL_COLOURS = ['#2b46f0', '#c2362b', '#0f7b59', '#f2b833', '#8296ff', '#0f1012'] as const

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { setQuickView } = useStore()
  const [active, setActive] = useState(0)
  const swatch = product.swatches[active]

  return (
    <motion.article
      className="card"
      layout
      initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 4) * 0.06 }}
    >
      <button className="card__art" onClick={() => setQuickView(product.id)} aria-label={`Quick view ${product.name}`}>
        <span className="card__grid" aria-hidden />
        {product.badge && <span className="card__badge">{product.badge}</span>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={swatch.name} className="card__garment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <ProductVisual photo={product.photo} swatch={swatch} alt={`${product.name} in ${swatch.name}`} eager={index < 4} />
          </motion.span>
        </AnimatePresence>
        <span className="card__quick">
          Customise <Icon name="arrowUp" />
        </span>
      </button>
      <div className="card__body">
        <div>
          <h3>{product.name}</h3>
          <p className="card__price">
            from <strong>{formatCAD(product.price)}</strong>
          </p>
        </div>
        <button className="card__add" onClick={() => setQuickView(product.id)} aria-label={`Add ${product.name}`}>
          <Icon name="plus" />
        </button>
      </div>
      <div className="card__swatches">
        {product.swatches.map((s, i) => (
          <button
            key={s.name}
            className={i === active ? 'is-active' : ''}
            style={{ background: s.color }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={`${s.name} colourway`}
          />
        ))}
      </div>
    </motion.article>
  )
}
