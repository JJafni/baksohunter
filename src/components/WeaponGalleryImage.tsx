import { useEffect, useState } from 'react'
import type { CrateEntry } from '../data/types'
import { getWeaponGalleryImageUrl, WEAPON_GALLERY_SOURCE_URL } from '../lib/weaponGalleryImages'

type WeaponGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
  variant?: 'inline' | 'hero' | 'backdrop'
}

function WeaponGalleryImage({ result, visible, variant = 'inline' }: WeaponGalleryImageProps) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const isHero = variant === 'hero'
  const isBackdrop = variant === 'backdrop'

  useEffect(() => {
    setUseIconFallback(false)
  }, [result?.slug])

  if (isBackdrop) {
    const galleryUrl = result ? getWeaponGalleryImageUrl(result.slug) : undefined
    const showHd = Boolean(galleryUrl) && !useIconFallback
    const imageUrl = result && showHd ? galleryUrl! : result?.icon

    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden={!visible || !result}>
        {visible && result && imageUrl ? (
          <img
            key={`${result.slug}-${showHd ? 'hd' : 'icon'}`}
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => {
              if (showHd) setUseIconFallback(true)
            }}
            className="h-full w-full scale-105 object-contain object-center opacity-95"
          />
        ) : (
          <div className="h-full w-full bg-slate-950/80" />
        )}
      </div>
    )
  }

  if (!visible || !result) {
    if (isHero) {
      return (
        <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 lg:min-h-0">
          <p className="px-6 text-center text-xs uppercase tracking-[0.2em] text-slate-600">
            Draw a weapon to reveal its showcase
          </p>
        </div>
      )
    }
    return null
  }

  const galleryUrl = getWeaponGalleryImageUrl(result.slug)
  const showHd = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showHd ? galleryUrl! : result.icon

  return (
    <figure
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${
        isHero ? 'h-full min-h-[280px] lg:min-h-0' : ''
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
      <div className={`relative flex flex-1 items-center justify-center ${isHero ? 'min-h-0 p-4 lg:p-6' : ''}`}>
        <img
          key={`${result.slug}-${showHd ? 'hd' : 'icon'}`}
          src={imageUrl}
          alt={`${result.name} ${showHd ? 'showcase' : 'icon'}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (showHd) setUseIconFallback(true)
          }}
          className={`relative z-10 object-contain ${
            isHero
              ? 'max-h-full max-w-full'
              : showHd
                ? 'mx-auto w-full max-h-[min(42vh,360px)] p-2 sm:p-3'
                : 'mx-auto w-full max-h-[min(32vh,280px)] p-2 opacity-90 sm:p-3'
          }`}
        />
      </div>
      <figcaption className="shrink-0 border-t border-white/5 px-3 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-slate-600 sm:text-[10px]">
        {showHd ? (
          <>
            Showcase via{' '}
            <a
              href={WEAPON_GALLERY_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 underline-offset-2 hover:text-slate-400 hover:underline"
            >
              IGN Nordic Weapons Gallery
            </a>
          </>
        ) : (
          <span className="text-slate-500">Showcase not available — showing weapon icon</span>
        )}
      </figcaption>
    </figure>
  )
}

export default WeaponGalleryImage
