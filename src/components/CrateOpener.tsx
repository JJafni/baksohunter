import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt from './CrateHunt'
import HuntStarFilter from './HuntStarFilter'
import MonsterExcludeModal from './MonsterExcludeModal'
import MonsterRarityFilter from './MonsterRarityFilter'
import MonstersPickerButton from './MonstersPickerButton'
import { pickQuestTypeForMonster } from '../data/questTypes'
import { MONSTER_POOL } from '../data/monsters'
import type { CrateEntry, Rarity } from '../data/types'
import { SPIN_LABELS } from '../lib/spinLabels'
import {
  filterPoolByExcluded,
  uniqueMonsterSpecies,
  type MonsterExcludeState,
} from '../lib/monsterExcludeFilter'
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
  onFilteredPoolChange?: (pool: CrateEntry[]) => void
}

function CrateOpener({ onHuntChange, onFilteredPoolChange }: CrateOpenerProps) {
  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)
  const [starFilter, setStarFilter] = useState<HuntStarFilterState>(DEFAULT_HUNT_STAR_FILTER)
  const [questTypeEnabled, setQuestTypeEnabled] = useState(true)
  const [excludedMonsters, setExcludedMonsters] = useState<MonsterExcludeState>(() => new Set())
  const [monsterModalOpen, setMonsterModalOpen] = useState(false)

  const monsterSpecies = useMemo(() => uniqueMonsterSpecies(MONSTER_POOL), [])

  const filteredPool = useMemo(() => {
    const byRarity = filterMonsterPool(MONSTER_POOL, poolFilter)
    const byExclusion = filterPoolByExcluded(byRarity, excludedMonsters)
    return filterPoolByStars(byExclusion, starFilter)
  }, [poolFilter, starFilter, excludedMonsters])

  useEffect(() => {
    onFilteredPoolChange?.(filteredPool)
  }, [filteredPool, onFilteredPoolChange])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const pickHuntStar = useCallback(
    (entry: (typeof MONSTER_POOL)[number]) => pickStarForMonsterWithFilter(entry, starFilter),
    [starFilter],
  )

  const poolCountLabel = formatPoolCountLabel(filteredPool.length)
  const overlayMode = Boolean(onHuntChange)

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
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
          companionButton={({ disabled }) => (
            <MonstersPickerButton
              excludedCount={excludedMonsters.size}
              disabled={disabled}
              onClick={() => setMonsterModalOpen(true)}
            />
          )}
          filters={({ disabled, layout }) => (
            <MonsterRarityFilter
              value={poolFilter}
              onChange={setPoolFilter}
              questTypeEnabled={questTypeEnabled}
              onQuestTypeChange={setQuestTypeEnabled}
              disabled={disabled}
              variant={layout}
              starFilter={starFilter}
              onStarFilterChange={setStarFilter}
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
        />
      </div>

      <MonsterExcludeModal
        open={monsterModalOpen}
        onClose={() => setMonsterModalOpen(false)}
        species={monsterSpecies}
        excluded={excludedMonsters}
        onChange={setExcludedMonsters}
      />
    </>
  )
}

export default CrateOpener
