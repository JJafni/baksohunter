import { useCallback, useMemo, useState } from 'react'
import CrateHunt from './CrateHunt'
import MonsterRarityFilter from './MonsterRarityFilter'
import { MONSTER_POOL } from '../data/monsters'
import type { Rarity } from '../data/types'
import {
  DEFAULT_RARITY_FILTER,
  filterPoolByRarity,
  formatPoolCountLabel,
  pickRandomFromPool,
  type RarityFilterState,
} from '../lib/rarityFilter'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Large Monster',
  tempered: 'Tempered Large Monster',
  'arch-tempered': 'Arch-Tempered Large Monster',
}

function CrateOpener() {
  const [rarityFilter, setRarityFilter] = useState<RarityFilterState>(DEFAULT_RARITY_FILTER)

  const filteredPool = useMemo(() => filterPoolByRarity(MONSTER_POOL, rarityFilter), [rarityFilter])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const poolCountLabel = formatPoolCountLabel(filteredPool.length, rarityFilter)

  return (
    <CrateHunt
      heading="Hunting"
      subtitle="Large Monsters"
      poolCountLabel={poolCountLabel}
      buttonLayoutId="monster-crate-button"
      buttonLabels={{ open: 'Open Crate', again: 'Hunt Again' }}
      rarityLabels={RARITY_LABELS}
      pool={filteredPool}
      pickRandom={pickRandom}
      reelSide="left"
      filters={({ disabled }) => (
        <MonsterRarityFilter value={rarityFilter} onChange={setRarityFilter} disabled={disabled} />
      )}
    />
  )
}

export default CrateOpener
