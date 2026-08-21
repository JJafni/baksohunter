import type { CrateEntry } from '../data/types'
import { buildWeaponSlideshowDeck } from '../lib/weaponPoolSlideshow'
import { getWeaponGalleryImageUrl } from '../lib/weaponGalleryImages'
import PoolSlideshow from './PoolSlideshow'

type WeaponPoolSlideshowProps = {
  pool: CrateEntry[]
  className?: string
}

function WeaponPoolSlideshow({ pool, className = '' }: WeaponPoolSlideshowProps) {
  return (
    <PoolSlideshow
      pool={pool}
      buildDeck={buildWeaponSlideshowDeck}
      resolveImageUrl={(entry) => getWeaponGalleryImageUrl(entry.slug)}
      className={className}
    />
  )
}

export default WeaponPoolSlideshow
