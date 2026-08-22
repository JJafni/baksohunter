import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import MonsterExcludeModal from './MonsterExcludeModal'
import MonsterRarityFilter from './MonsterRarityFilter'
import MonstersPickerButton from './MonstersPickerButton'
import MonsterPoolSlideshow from './MonsterPoolSlideshow'
import WeaponPoolSlideshow from './WeaponPoolSlideshow'
import { pickQuestTypeForMonster } from '../data/questTypes'
import { MONSTER_POOL } from '../data/monsters'
import type { CrateEntry, Rarity } from '../data/types'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
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
import MobileTapSpinSection from './MobileTapSpinSection'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Large Monster',
  tempered: 'Tempered Large Monster',
  'arch-tempered': 'Arch-Tempered Large Monster',
}

const WEAPON_RARITY_LABELS: Record<Rarity, string> = {
  normal: '',
  tempered: '',
  'arch-tempered': '',
}

const SECTION_BORDER = 'border-wilds-gold/15'
const PLAYER_TOOLBAR_SHELL_CLASS =
  'flex shrink-0 justify-center border-b border-wilds-gold/10 px-2 py-3'

type MobileSoloHuntLayoutProps = {
  onMonsterHuntChange?: (ctx: CrateHuntContext) => void
  onWeaponHuntChange?: (ctx: CrateHuntContext) => void
  playerCount: number
  onPlayerCountChange: (count: number) => void
}

function PlayerCountControls({
  playerCount,
  onChange,
}: {
  playerCount: number
  onChange: (count: number) => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-4">
      <button
        type="button"
        aria-label="Remove player"
        disabled={playerCount <= 1}
        onClick={() => onChange(playerCount - 1)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-lg font-bold text-wilds-parchment transition enabled:cursor-pointer hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35"
      >
        −
      </button>
      <span className="min-w-[7rem] text-center text-xs font-bold uppercase tracking-[0.14em] text-wilds-muted">
        {playerCount} {playerCount === 1 ? 'Player' : 'Players'}
      </span>
      <button
        type="button"
        aria-label="Add player"
        disabled={playerCount >= 4}
        onClick={() => onChange(playerCount + 1)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-lg font-bold text-wilds-parchment transition enabled:cursor-pointer hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35"
      >
        +
      </button>
    </div>
  )
}

function MobileSoloHuntLayout({
  onMonsterHuntChange,
  onWeaponHuntChange,
  playerCount,
  onPlayerCountChange,
}: MobileSoloHuntLayoutProps) {
  const monsterRef = useRef<CrateHuntHandle>(null)
  const weaponRef = useRef<CrateHuntHandle>(null)

  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)
  const [starFilter, setStarFilter] = useState<HuntStarFilterState>(DEFAULT_HUNT_STAR_FILTER)
  const [questTypeEnabled, setQuestTypeEnabled] = useState(true)
  const [excludedMonsters, setExcludedMonsters] = useState<MonsterExcludeState>(() => new Set())
  const [monsterModalOpen, setMonsterModalOpen] = useState(false)
  const [monsterPhase, setMonsterPhase] = useState<CrateHuntContext['phase']>('idle')
  const [weaponPhase, setWeaponPhase] = useState<CrateHuntContext['phase']>('idle')
  const [monsterPreviewPool, setMonsterPreviewPool] = useState<CrateEntry[]>([])

  const monsterSpecies = useMemo(() => uniqueMonsterSpecies(MONSTER_POOL), [])

  const filteredPool = useMemo(() => {
    const byRarity = filterMonsterPool(MONSTER_POOL, poolFilter)
    const byExclusion = filterPoolByExcluded(byRarity, excludedMonsters)
    return filterPoolByStars(byExclusion, starFilter)
  }, [poolFilter, starFilter, excludedMonsters])

  useEffect(() => {
    setMonsterPreviewPool(filteredPool)
  }, [filteredPool])

  const pickRandom = useCallback(() => pickRandomFromPool(filteredPool), [filteredPool])

  const pickHuntStar = useCallback(
    (entry: (typeof MONSTER_POOL)[number]) => pickStarForMonsterWithFilter(entry, starFilter),
    [starFilter],
  )

  const poolCountLabel = formatPoolCountLabel(filteredPool.length)
  const filtersDisabled = monsterPhase === 'spinning'
  const monsterSpinning = monsterPhase === 'spinning'
  const weaponSpinning = weaponPhase === 'spinning'

  const handleMonsterHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setMonsterPhase(ctx.phase)
      onMonsterHuntChange?.(ctx)
    },
    [onMonsterHuntChange],
  )

  const handleWeaponHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setWeaponPhase(ctx.phase)
      onWeaponHuntChange?.(ctx)
    },
    [onWeaponHuntChange],
  )

  const showMonsterPreviewSlideshow = monsterPhase === 'idle' && monsterPreviewPool.length > 0
  const showWeaponPreviewSlideshow = weaponPhase === 'idle' && WEAPON_POOL.length > 0

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        <div className={`${PLAYER_TOOLBAR_SHELL_CLASS} bg-wilds-950/70 backdrop-blur-sm`}>
          <PlayerCountControls playerCount={playerCount} onChange={onPlayerCountChange} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2">
          <MobileTapSpinSection
            ariaLabel="Hunt for monster"
            disabled={monsterSpinning || filteredPool.length === 0}
            onSpin={() => monsterRef.current?.startSpin()}
            className={`relative flex min-h-0 flex-col border-r ${SECTION_BORDER}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 overflow-hidden ${showMonsterPreviewSlideshow || monsterPhase !== 'idle' ? '' : 'hidden'}`}
            >
              {showMonsterPreviewSlideshow ? (
                <MonsterPoolSlideshow pool={monsterPreviewPool} />
              ) : monsterPhase !== 'idle' ? (
                <div className="h-full w-full bg-wilds-950" aria-hidden="true" />
              ) : null}
            </div>
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <CrateHunt
                ref={monsterRef}
                poolCountLabel=""
                buttonLayoutId="monster-crate-button"
                buttonLabels={{ open: 'Hunt', again: 'Hunt' }}
                rarityLabels={RARITY_LABELS}
                pool={filteredPool}
                pickRandom={pickRandom}
                pickRandomQuestType={pickQuestTypeForMonster}
                pickRandomHuntStar={pickHuntStar}
                questTypeEnabled={questTypeEnabled}
                reelSide="left"
                reelOrientation="vertical"
                spinLabels={SPIN_LABELS}
                externalGallery
                overlayMode
                unifiedMobileColumn
                hidePrimaryButton
                hideMobileChrome
                showMonsterInfo
                onHuntChange={handleMonsterHuntChange}
              />
            </div>
          </MobileTapSpinSection>

          <MobileTapSpinSection
            ariaLabel="Draw weapon"
            disabled={weaponSpinning}
            onSpin={() => weaponRef.current?.startSpin()}
            className="relative flex min-h-0 flex-col"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {showWeaponPreviewSlideshow ? (
                <WeaponPoolSlideshow pool={WEAPON_POOL} />
              ) : (
                <div className="h-full w-full bg-wilds-950" aria-hidden="true" />
              )}
            </div>
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <CrateHunt
                ref={weaponRef}
                poolCountLabel=""
                buttonLayoutId="weapon-crate-button"
                buttonLabels={{ open: 'Draw', again: 'Draw' }}
                rarityLabels={WEAPON_RARITY_LABELS}
                pool={WEAPON_POOL}
                pickRandom={pickRandomWeapon}
                reelSide="right"
                reelOrientation="vertical"
                spinLabels={['Drawing']}
                buttonIcon="shield"
                buttonSurface="shiny"
                externalGallery
                overlayMode
                revealLayout="inline"
                unifiedMobileColumn
                hidePrimaryButton
                hideMobileChrome
                onHuntChange={handleWeaponHuntChange}
              />
            </div>
          </MobileTapSpinSection>
        </div>

        <div className="mobile-hunt-controls shrink-0 border-t border-wilds-gold/10 bg-wilds-950/92 px-3 py-2 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
            <div className="mobile-hunt-controls-stacked flex flex-col gap-2">
              <MonstersPickerButton
                excludedCount={excludedMonsters.size}
                disabled={filtersDisabled}
                large
                onClick={() => setMonsterModalOpen(true)}
              />
              <MonsterRarityFilter
                value={poolFilter}
                onChange={setPoolFilter}
                questTypeEnabled={questTypeEnabled}
                onQuestTypeChange={setQuestTypeEnabled}
                disabled={filtersDisabled}
                variant="bar"
                starFilter={starFilter}
                onStarFilterChange={setStarFilter}
              />
            </div>

            <p className="flex min-h-[1.75rem] items-center justify-center text-center text-[9px] uppercase tracking-[0.18em] text-wilds-muted">
              {poolCountLabel}
            </p>
          </div>
        </div>
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

export default MobileSoloHuntLayout
