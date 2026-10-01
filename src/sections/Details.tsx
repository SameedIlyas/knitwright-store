import { motion } from 'motion/react'
import { ScenePhoto, TintedPhoto } from '../components/Photo'
import { EASE, Marquee, Reveal, SplitHeadline } from '../components/motion'
import { Frame, SectionTag } from '../components/ui'
import { DECORATION, REASONS } from '../data/content'

const DECO_PHOTOS = [
  { id: 'scene-crest', alt: 'Embroidered crest patch close-up' },
  { id: 'scene-fabric', alt: 'Mesh, air-knit and fleece fabric swatches' },
  { id: 'scene-names', alt: 'Twill name letters being stitched onto a jersey back' },
  { id: 'scene-numbers', alt: 'Black jersey with a white stitched number 19 in a locker' },
] as const

const REASON_PHOTOS = [
  { id: 'scene-locker', alt: 'Matching black and cobalt jerseys hanging in a locker room' },
  { id: 'scene-dugout', alt: 'Youth baseball team cheering in matching jerseys' },
  { id: 'scene-shipping', alt: 'Team shirts packed in boxes ready to ship' },
  { id: 'scene-sewing', alt: 'Hands guiding jersey fabric through a sewing machine' },
] as const

export function Decoration() {
  return (
    <section className="section">
      <SectionTag>Decoration</SectionTag>
      <div className="section__head section__head--center">
        <SplitHeadline text={'Every detail, the way\nyour team wants it.'} />
      </div>
      <div className="deco">
        {DECORATION.map((d, i) => (
          <Reveal key={d.title} className="deco__card" delay={i * 0.08}>
            <h4>{d.title}</h4>
            <hr />
            <p>{d.body}</p>
            <div className="deco__media">
              <motion.div className="fill" initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }}>
                <ScenePhoto id={DECO_PHOTOS[i].id} className="fill" alt={DECO_PHOTOS[i].alt} />
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Reasons() {
  return (
    <section className="section">
      <SectionTag>Why Knitwright</SectionTag>
      <div className="section__head">
        <SplitHeadline text={'Four reasons teams\nchoose Knitwright.'} />
      </div>
      <Frame className="reasons-frame">
        <div className="reasons">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <Frame className="frame--card">
                <article className="reason">
                  <h4>{r.title}</h4>
                  <div className="reason__media">
                    <ScenePhoto id={REASON_PHOTOS[i].id} className="fill" alt={REASON_PHOTOS[i].alt} />
                    <span className="reason__shade" aria-hidden />
                    <motion.strong initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }} whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE, delay: 0.2 }}>
                      {r.stat}
                    </motion.strong>
                    <span className="mono">{r.statLabel}</span>
                  </div>
                  <p>{r.body}</p>
                </article>
              </Frame>
            </Reveal>
          ))}
        </div>
      </Frame>
    </section>
  )
}

const RANGE: readonly { photo: string; color: string }[] = [
  { photo: 'hockey-front', color: '#2b46f0' },
  { photo: 'cap', color: '#17181b' },
  { photo: 'socks', color: '#c2362b' },
  { photo: 'hoodie', color: '#e9eaee' },
  { photo: 'duffel', color: '#17181b' },
  { photo: 'baseball-front', color: '#ffffff' },
  { photo: 'toque', color: '#0f7b59' },
  { photo: 'gloves', color: '#f2b833' },
  { photo: 'track-jacket', color: '#1c2a8f' },
  { photo: 'bottle', color: '#2b46f0' },
  { photo: 'backpack', color: '#2a2c31' },
  { photo: 'winter-jacket', color: '#7a1f3d' },
]

export function Range() {
  const rotated = [...RANGE.slice(6), ...RANGE.slice(0, 6)]
  return (
    <section className="section range">
      <SectionTag>The range</SectionTag>
      <div className="section__head">
        <SplitHeadline text={'Twenty product lines.\nOne supplier.'} />
        <Reveal as="p" className="lede">
          Jerseys, pant shells, socks, gloves, bags, caps, toques, bottles and more, all managed in one place.
        </Reveal>
      </div>
      <div className="range__rails">
        <Marquee speed={50}>
          {RANGE.map((g, i) => (
            <span key={i} className="tile">
              <TintedPhoto photo={g.photo} color={g.color} alt="" />
            </span>
          ))}
        </Marquee>
        <Marquee speed={56} reverse>
          {rotated.map((g, i) => (
            <span key={i} className="tile">
              <TintedPhoto photo={g.photo} color={g.color} alt="" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
