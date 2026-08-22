import type { CrateEntry } from '../data/types'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { getMonsterGalleryImageUrl } from '../lib/monsterGalleryImages'
import { buildMonsterSlideshowDeck } from '../lib/monsterPoolSlideshow'
import PoolSlideshow from './PoolSlideshow'

type MonsterPoolSlideshowProps = {
  pool: CrateEntry[]
  className?: string
}

function MonsterPoolSlideshow({ pool, className = '' }: MonsterPoolSlideshowProps) {
  const isMobile = useIsMobileLayout()

  return (
    <PoolSlideshow
      pool={pool}
      buildDeck={buildMonsterSlideshowDeck}
      resolveImageUrl={(entry) =>
        isMobile ? undefined : getMonsterGalleryImageUrl(entry.slug)
      }
      className={className}
    />
  )
}

export default MonsterPoolSlideshow
