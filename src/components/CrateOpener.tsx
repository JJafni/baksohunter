import { useCallback, useMemo, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt from './CrateHunt'
import MonsterGalleryImage from './MonsterGalleryImage'
import HuntStarFilter from './HuntStarFilter'
import MonsterRarityFilter from './MonsterRarityFilter'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { pickQuestTypeForMonster } from '../data/questTypes'
import { MONSTER_POOL } from '../data/monsters'
import type { Rarity } from '../data/types'
import { SPIN_LABELS } from '../lib/spinLabels'
import {
  DEFAULT_MONSTER_POOL_FILTER,
  filterMonsterPool,
  formatPoolCountLabel,
  pickRandomFromPool,
  type MonsterPoolFilterState,
} from '../lib/rarityFilter'
import {
  DEFAULT_HUNT_STAR_FILTER,
  filterPoolByStars,
  pickStarForMonsterWithFilter,
  type HuntStarFilterState,
} from '../lib/starFilter'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Large Monster',
  tempered: 'Tempered Large Monster',
  'arch-tempered': 'Arch-Tempered Large Monster',
}

type CrateOpenerProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
}

function CrateOpener({ onHuntChange }: CrateOpenerProps) {
  const isMobile = useIsMobileLayout()
  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)
  const [starFilter, setStarFilter] = useState<HuntStarFilterState>(DEFAULT_HUNT_STAR_FILTER)
  const [questTypeEnabled, setQuestTypeEnabled] = useState(true)

  const filteredPool = useMemo(() => {
    const byRarity = filterMonsterPool(MONSTER_POOL, poolFilter)
    return filterPoolByStars(byRarity, starFilter)
  }, [poolFilter, starFilter])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const pickHuntStar = useCallback(
    (entry: (typeof MONSTER_POOL)[number]) => pickStarForMonsterWithFilter(entry, starFilter),
    [starFilter],
  )

  const poolCountLabel = formatPoolCountLabel(filteredPool.length)
  const overlayMode = !isMobile && Boolean(onHuntChange)

  return (
    <CrateHunt
      poolCountLabel={poolCountLabel}
      buttonLayoutId="monster-crate-button"
      buttonLabels={{ open: 'Hunt', again: 'Hunt' }}
      rarityLabels={RARITY_LABELS}
      pool={filteredPool}
      pickRandom={pickRandom}
      pickRandomQuestType={pickQuestTypeForMonster}
      pickRandomHuntStar={pickHuntStar}
      questTypeEnabled={questTypeEnabled}
      reelSide="left"
      spinLabels={SPIN_LABELS}
      externalGallery={overlayMode}
      overlayMode={overlayMode}
      showMonsterInfo
      onHuntChange={onHuntChange}
      filters={({ disabled, layout }) => (
        <MonsterRarityFilter
          value={poolFilter}
          onChange={setPoolFilter}
          questTypeEnabled={questTypeEnabled}
          onQuestTypeChange={setQuestTypeEnabled}
          disabled={disabled}
          variant={layout}
          trailing={
            <HuntStarFilter
              value={starFilter}
              onChange={setStarFilter}
              disabled={disabled}
              variant={layout}
              embedded
            />
          }
        />
      )}
      belowReel={
        isMobile
          ? ({ result, phase }) => (
              <MonsterGalleryImage
                result={result}
                visible={phase === 'revealed'}
                emphasized={false}
              />
            )
          : undefined
      }
    />
  )
}

export default CrateOpener
