import { motion } from 'motion/react'
import { TintedPhoto } from '../components/Photo'
import { EASE, Reveal, SplitHeadline } from '../components/motion'
import { Button, Frame, Icon, SectionTag } from '../components/ui'
import { PROGRAMMES, TIERS } from '../data/content'

const TIER_ART = [
  { photo: 'tee', color: '#e9eaee' },
  { photo: 'hockey-front', color: '#2b46f0' },
  { photo: 'track-jacket', color: '#17181b' },
] as const

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <SectionTag>Ways to order</SectionTag>
      <div className="section__head section__head--center">
        <SplitHeadline text={'An order size for\nevery stage of your team.'} />
        <Reveal as="p" className="lede">
          Start with one sample, then scale to a full league programme.
        </Reveal>
      </div>

      <Frame className="tiers-frame">
        <div className="tiers">
          {TIERS.map((t, i) => (
            <motion.article
              key={t.name}
              className={`tier ${t.featured ? 'tier--featured' : ''}`}
              initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
            >
              {t.featured && (
                <div className="tier__ridge" aria-hidden />
              )}
              <div className="tier__inner">
                <div className="tier__top">
                  <span className="tier__avatar">
                    <TintedPhoto photo={TIER_ART[i].photo} color={TIER_ART[i].color} alt="" />
                  </span>
                  {t.featured && (
                    <span className="tier__tag">
                      {t.note} <Icon name="star" />
                    </span>
                  )}
                </div>
                <h4>{t.name}</h4>
                <p className="tier__tagline">{t.tagline}</p>
                <hr />
                <p className="tier__price">
                  <strong>{t.price}</strong> <span>{t.unit}</span>
                </p>
                <p className="tier__note">{t.featured ? 'Names & numbers included' : t.note}</p>
                <hr />
                <p className="tier__inc">What's included:</p>
                <ul>
                  {t.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" /> {f}
                    </li>
                  ))}
                </ul>
                <Button href="#shop" variant={t.featured ? 'primary' : 'ghost'} className="btn--block">
                  {i === 0 ? 'Order a sample' : 'Build your order'}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </Frame>
    </section>
  )
}

export function Programmes() {
  return (
    <section className="section">
      <SectionTag>Programmes</SectionTag>
      <div className="section__head">
        <SplitHeadline text={'Programmes for\nschools, camps & goalies.'} />
      </div>
      <div className="programmes">
        {PROGRAMMES.map((p, i) => (
          <Reveal key={p.title} className="programme" delay={i * 0.1}>
            <span className="programme__icon">
              <Icon name={p.icon} />
            </span>
            <h5>{p.title}</h5>
            <p>{p.body}</p>
            <a href="#contact" className="pill-link">
              Apply <Icon name="arrow" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
