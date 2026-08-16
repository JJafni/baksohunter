import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { CrateEntry } from '../data/types'
import { useGalleryDisplayResult } from '../hooks/useGalleryDisplayResult'
import { getMonsterGalleryImageUrl, MONSTER_GALLERY_SOURCE_URL } from '../lib/monsterGalleryImages'

const GALLERY_FADE = { duration: 0.7, ease: 'easeInOut' as const }

type MonsterGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
  /** Darker overlay while the spinner is still on screen after reveal. */
  emphasized?: boolean
  variant?: 'inline' | 'hero' | 'backdrop'
}

function MonsterGalleryImage({
  result,
  visible,
  emphasized = true,
  variant = 'inline',
}: MonsterGalleryImageProps) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const displayedResult = useGalleryDisplayResult(result, visible)
  const isHero = variant === 'hero'
  const isBackdrop = variant === 'backdrop'

  useEffect(() => {
    setUseIconFallback(false)
  }, [displayedResult?.slug])

  if (isBackdrop) {
    const galleryUrl = displayedResult ? getMonsterGalleryImageUrl(displayedResult.slug) : undefined
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
          <div className="h-full w-full bg-wilds-950/80" />
        )}
      </div>
    )
  }

  if (!displayedResult) {
    if (isHero) {
      return (
        <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl border border-dashed border-wilds-gold/20 bg-wilds-900/40 lg:min-h-0">
          <p className="px-6 text-center text-xs uppercase tracking-[0.2em] text-wilds-muted">
            Hunt a monster to reveal its render
          </p>
        </div>
      )
    }
    return null
  }

  const galleryUrl = getMonsterGalleryImageUrl(displayedResult.slug)
  const showHd = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showHd ? galleryUrl! : displayedResult.icon

  return (
    <figure
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-wilds-gold/20 bg-wilds-900/50 ${
        isHero ? 'h-full min-h-[280px] lg:min-h-0' : ''
      }`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-wilds-950/65"
        initial={false}
        animate={{ opacity: visible && emphasized ? 0.65 : 0 }}
        transition={GALLERY_FADE}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
      <div className={`relative flex flex-1 items-center justify-center ${isHero ? 'min-h-0 p-4 lg:p-6' : ''}`}>
        <motion.img
          key={`${displayedResult.slug}-${showHd ? 'hd' : 'icon'}`}
          src={imageUrl}
          alt={`${displayedResult.name} ${showHd ? 'render' : 'icon'}`}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={GALLERY_FADE}
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
      <figcaption className="shrink-0 border-t border-wilds-gold/10 px-3 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-wilds-muted sm:text-[10px]">
        {showHd ? (
          <>
            HD render via{' '}
            <a
              href={MONSTER_GALLERY_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-wilds-muted underline-offset-2 hover:text-wilds-gold-light hover:underline"
            >
              MHWilds Image Gallery
            </a>
          </>
        ) : (
          <span className="text-wilds-muted">HD render not available — showing hunt icon</span>
        )}
      </figcaption>
    </figure>
  )
}

export default MonsterGalleryImage
