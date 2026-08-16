import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { CrateEntry } from '../data/types'
import { useGalleryDisplayResult } from '../hooks/useGalleryDisplayResult'
import { getWeaponGalleryImageUrl, WEAPON_GALLERY_SOURCE_URL } from '../lib/weaponGalleryImages'

const GALLERY_FADE = { duration: 0.7, ease: 'easeInOut' as const }

type WeaponGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
  /** Darker overlay while the spinner is still on screen after reveal. */
  emphasized?: boolean
  variant?: 'inline' | 'hero' | 'backdrop'
}

function WeaponGalleryImage({
  result,
  visible,
  emphasized = true,
  variant = 'inline',
}: WeaponGalleryImageProps) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const displayedResult = useGalleryDisplayResult(result, visible)
  const isHero = variant === 'hero'
  const isBackdrop = variant === 'backdrop'

  useEffect(() => {
    setUseIconFallback(false)
  }, [displayedResult?.slug])

  if (isBackdrop) {
    const galleryUrl = displayedResult ? getWeaponGalleryImageUrl(displayedResult.slug) : undefined
    const showHd = Boolean(galleryUrl) && !useIconFallback
    const imageUrl = displayedResult && showHd ? galleryUrl! : displayedResult?.icon

    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden={!visible || !result}>
        {displayedResult && imageUrl ? (
          <motion.img
            key={`${displayedResult.slug}-${showHd ? 'hd' : 'icon'}`}
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{
              opacity: visible ? 0.95 : 0,
            }}
            transition={GALLERY_FADE}
            onError={() => {
              if (showHd) setUseIconFallback(true)
            }}
            className="h-full w-full scale-105 object-contain object-center"
          />
        ) : (
          <div className="h-full w-full bg-slate-950/80" />
        )}
      </div>
    )
  }

  if (!displayedResult) {
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

  const galleryUrl = getWeaponGalleryImageUrl(displayedResult.slug)
  const showHd = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showHd ? galleryUrl! : displayedResult.icon

  return (
    <motion.figure
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={GALLERY_FADE}
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${
        isHero ? 'h-full min-h-[280px] lg:min-h-0' : ''
      }`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-slate-950/65"
        initial={false}
        animate={{ opacity: visible ? (emphasized ? 0.65 : 0.3) : 0 }}
        transition={GALLERY_FADE}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
      <div className={`relative flex flex-1 items-center justify-center ${isHero ? 'min-h-0 p-4 lg:p-6' : ''}`}>
        <img
          key={`${displayedResult.slug}-${showHd ? 'hd' : 'icon'}`}
          src={imageUrl}
          alt={`${displayedResult.name} ${showHd ? 'showcase' : 'icon'}`}
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
    </motion.figure>
  )
}

export default WeaponGalleryImage
