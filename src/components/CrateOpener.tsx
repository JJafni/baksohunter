import { useCallback, useMemo, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt from './CrateHunt'
import MonsterGalleryImage from './MonsterGalleryImage'
import MonsterRarityFilter from './MonsterRarityFilter'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
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

type CrateOpenerProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
}

function CrateOpener({ onHuntChange }: CrateOpenerProps) {
  const isMobile = useIsMobileLayout()
  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)

  const filteredPool = useMemo(() => filterMonsterPool(MONSTER_POOL, poolFilter), [poolFilter])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const poolCountLabel = formatPoolCountLabel(filteredPool.length)
  const overlayMode = !isMobile && Boolean(onHuntChange)

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
      externalGallery={overlayMode}
      overlayMode={overlayMode}
      onHuntChange={onHuntChange}
      filters={({ disabled, layout }) => (
        <MonsterRarityFilter
          value={poolFilter}
          onChange={setPoolFilter}
          disabled={disabled}
          variant={layout}
        />
      )}
      belowReel={
        isMobile
          ? ({ result, phase, spinnerUiVisible }) => (
              <MonsterGalleryImage
                result={result}
                visible={phase === 'revealed'}
                emphasized={phase === 'revealed' && spinnerUiVisible}
              />
            )
          : undefined
      }
    />
  )
}

export default CrateOpener
