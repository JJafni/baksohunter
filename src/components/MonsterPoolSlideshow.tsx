import type { CrateEntry } from '../data/types'
import { getMonsterGalleryImageUrl } from '../lib/monsterGalleryImages'
import { buildMonsterSlideshowDeck } from '../lib/monsterPoolSlideshow'
import PoolSlideshow from './PoolSlideshow'

type MonsterPoolSlideshowProps = {
  pool: CrateEntry[]
  className?: string
}

function MonsterPoolSlideshow({ pool, className = '' }: MonsterPoolSlideshowProps) {
  return (
    <PoolSlideshow
      pool={pool}
      buildDeck={buildMonsterSlideshowDeck}
      resolveImageUrl={(entry) => getMonsterGalleryImageUrl(entry.slug)}
      className={className}
    />
  )
}

export default MonsterPoolSlideshow
