import { useEffect, useState } from 'react'
import type { CrateEntry } from '../data/types'
import { getMonsterGalleryImageUrl, MONSTER_GALLERY_SOURCE_URL } from '../lib/monsterGalleryImages'

type MonsterGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
  variant?: 'inline' | 'hero'
}

function MonsterGalleryImage({ result, visible, variant = 'inline' }: MonsterGalleryImageProps) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const isHero = variant === 'hero'

  useEffect(() => {
    setUseIconFallback(false)
  }, [result?.slug])

  if (!visible || !result) {
    if (isHero) {
      return (
        <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 lg:min-h-0">
          <p className="px-6 text-center text-xs uppercase tracking-[0.2em] text-slate-600">
            Hunt a monster to reveal its render
          </p>
        </div>
      )
    }
    return null
  }

  const galleryUrl = getMonsterGalleryImageUrl(result.slug)
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
          alt={`${result.name} ${showHd ? 'render' : 'icon'}`}
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
            HD render via{' '}
            <a
              href={MONSTER_GALLERY_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 underline-offset-2 hover:text-slate-400 hover:underline"
            >
              MHWilds Image Gallery
            </a>
          </>
        ) : (
          <span className="text-slate-500">HD render not available — showing hunt icon</span>
        )}
      </figcaption>
    </figure>
  )
}

export default MonsterGalleryImage
