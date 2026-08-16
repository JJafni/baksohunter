import { useCallback, useMemo, useState } from 'react'
import CrateHunt from './CrateHunt'
import MonsterGalleryImage from './MonsterGalleryImage'
import MonsterRarityFilter from './MonsterRarityFilter'
import { MONSTER_POOL } from '../data/monsters'
import type { Rarity } from '../data/types'
import { SPIN_LABELS } from './ui/stateful-button'
import {
  DEFAULT_MONSTER_POOL_FILTER,
  filterMonsterPool,
  formatPoolCountLabel,
  pickRandomFromPool,
  type MonsterPoolFilterState,
} from '../lib/rarityFilter'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Large Monster',
  tempered: 'Tempered Large Monster',
  'arch-tempered': 'Arch-Tempered Large Monster',
}

function CrateOpener() {
  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)

  const filteredPool = useMemo(() => filterMonsterPool(MONSTER_POOL, poolFilter), [poolFilter])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const poolCountLabel = formatPoolCountLabel(filteredPool.length)

  return (
    <CrateHunt
      heading="Hunting"
      subtitle="Large Monsters"
      poolCountLabel={poolCountLabel}
      buttonLayoutId="monster-crate-button"
      buttonLabels={{ open: 'Hunt', again: 'Hunt' }}
      rarityLabels={RARITY_LABELS}
      pool={filteredPool}
      pickRandom={pickRandom}
      reelSide="left"
      spinLabels={SPIN_LABELS}
      filters={({ disabled, layout }) => (
        <MonsterRarityFilter
          value={poolFilter}
          onChange={setPoolFilter}
          disabled={disabled}
          variant={layout}
        />
      )}
      belowReel={({ result, phase }) => (
        <MonsterGalleryImage result={result} visible={phase === 'revealed'} />
      )}
    />
  )
}

export default CrateOpener
