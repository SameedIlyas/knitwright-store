import type { CSSProperties } from 'react'

export function photoUrl(id: string): string {
  return `/photos/${id}.webp`
}

interface TintedPhotoProps {
  /** Cutout id in public/photos — a white garment on a transparent background. */
  photo: string
  color: string
  alt: string
  className?: string
  /** Load eagerly for above-the-fold images. */
  eager?: boolean
}

/**
 * Recolours a white product cutout to any colour while keeping the photo's real
 * folds and shading: a colour layer masked to the garment, multiplied by the photo.
 */
export function TintedPhoto({ photo, color, alt, className, eager }: TintedPhotoProps) {
  const url = photoUrl(photo)
  const mask: CSSProperties = { WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, background: color }
  return (
    <span className={`tinted ${className ?? ''}`}>
      <span className="tinted__colour" style={mask} aria-hidden />
      <img className="tinted__shade" src={url} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
    </span>
  )
}

interface ScenePhotoProps {
  id: string
  alt: string
  className?: string
  eager?: boolean
}

export function ScenePhoto({ id, alt, className, eager }: ScenePhotoProps) {
  return <img className={`scene ${className ?? ''}`} src={photoUrl(id)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
}
