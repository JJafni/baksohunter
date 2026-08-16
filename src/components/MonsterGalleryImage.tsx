import { useState } from 'react'
import type { CrateEntry } from '../data/types'
import { getMonsterGalleryImageUrl, MONSTER_GALLERY_SOURCE_URL } from '../lib/monsterGalleryImages'

type MonsterGalleryImageProps = {
  result: CrateEntry | null
  visible: boolean
}

function MonsterGalleryImage({ result, visible }: MonsterGalleryImageProps) {
  const [failed, setFailed] = useState(false)

  if (!visible || !result) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20"
        aria-hidden="true"
      />
    )
  }

  if (failed) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">HD render unavailable</p>
        <a
          href={MONSTER_GALLERY_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] uppercase tracking-[0.12em] text-slate-600 underline-offset-2 hover:text-slate-400 hover:underline"
        >
          MHWilds Image Gallery
        </a>
      </div>
    )
  }

  const imageUrl = getMonsterGalleryImageUrl(result.slug, result.name)

  return (
    <figure className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
      <img
        key={imageUrl}
        src={imageUrl}
        alt={`${result.name} render`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="relative z-10 mx-auto max-h-[min(42vh,360px)] w-full object-contain p-3 sm:p-4"
      />
      <figcaption className="border-t border-white/5 px-3 py-2 text-center text-[9px] uppercase tracking-[0.14em] text-slate-600 sm:text-[10px]">
        Render via{' '}
        <a
          href={MONSTER_GALLERY_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-slate-500 underline-offset-2 hover:text-slate-400 hover:underline"
        >
          Monster Hunter Wiki
        </a>
      </figcaption>
    </figure>
  )
}

export default MonsterGalleryImage
