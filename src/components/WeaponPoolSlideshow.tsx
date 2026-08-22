import type { CrateEntry } from '../data/types'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { buildWeaponSlideshowDeck } from '../lib/weaponPoolSlideshow'
import { getWeaponGalleryImageUrl } from '../lib/weaponGalleryImages'
import PoolSlideshow from './PoolSlideshow'

type WeaponPoolSlideshowProps = {
  pool: CrateEntry[]
  className?: string
}

function WeaponPoolSlideshow({ pool, className = '' }: WeaponPoolSlideshowProps) {
  const isMobile = useIsMobileLayout()

  return (
    <PoolSlideshow
      pool={pool}
      buildDeck={buildWeaponSlideshowDeck}
      resolveImageUrl={(entry) =>
        isMobile ? undefined : getWeaponGalleryImageUrl(entry.slug)
      }
      className={className}
    />
  )
}

export default WeaponPoolSlideshow
