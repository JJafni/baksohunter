import { useEffect, useState } from 'react'
import type { CrateEntry } from '../data/types'
import { getMonsterGalleryImageUrl, MONSTER_GALLERY_SOURCE_URL } from '../lib/monsterGalleryImages'

type MonsterGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
}

function MonsterGalleryImage({ result, visible }: MonsterGalleryImageProps) {
  const [useIconFallback, setUseIconFallback] = useState(false)

  useEffect(() => {
    setUseIconFallback(false)
  }, [result?.slug])

  if (!visible || !result) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20"
        aria-hidden="true"
      />
    )
  }

  const galleryUrl = getMonsterGalleryImageUrl(result.slug)
  const showHd = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showHd ? galleryUrl! : result.icon

  return (
    <figure className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
      <img
        key={`${result.slug}-${showHd ? 'hd' : 'icon'}`}
        src={imageUrl}
        alt={`${result.name} ${showHd ? 'render' : 'icon'}`}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (showHd) setUseIconFallback(true)
        }}
        className={`relative z-10 mx-auto w-full object-contain p-3 sm:p-4 ${
          showHd ? 'max-h-[min(42vh,360px)]' : 'max-h-[min(32vh,280px)] opacity-90'
        }`}
      />
      <figcaption className="border-t border-white/5 px-3 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-slate-600 sm:text-[10px]">
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
