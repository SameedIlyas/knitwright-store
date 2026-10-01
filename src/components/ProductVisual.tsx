import type { Swatch } from '../data/catalog'
import { designFromSwatch, type Design } from '../customiser/design'
import { JerseyPreview } from '../customiser/JerseyPreview'
import { templateForPhoto } from '../customiser/templates'
import { TintedPhoto } from './Photo'

interface ProductVisualProps {
  photo: string
  swatch: Pick<Swatch, 'color' | 'accent' | 'trim'>
  alt: string
  design?: Design
  name?: string
  number?: string
  /** Show the back (name & number) when the template has one. */
  back?: boolean
  className?: string
  eager?: boolean
}

/**
 * Product image: jerseys render through the photoreal customiser (zones + stripes),
 * everything else is the white cutout tinted to the swatch colour.
 */
export function ProductVisual({ photo, swatch, alt, design, name, number, back, className, eager }: ProductVisualProps) {
  const template = templateForPhoto(photo)
  if (!template) return <TintedPhoto photo={photo} color={design?.body ?? swatch.color} alt={alt} className={className} eager={eager} />
  const view = (back && template.views.back) || template.views.front
  return <JerseyPreview view={view} design={design ?? designFromSwatch(swatch)} name={name} number={number} className={className} title={alt} />
}
