import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import type { PlayerDraw } from './CoopPlayerSection'
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
import { StatefulButton } from './ui/stateful-button'

const MAX_PLAYERS = 4

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

const PLAYER_LABEL_COLORS = [
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
] as const

const PLAYER_LABEL_COLORS_ACTIVE = [
  'text-red-300',
  'text-blue-300',
  'text-yellow-300',
  'text-green-300',
] as const

type PlayerSlot = { id: number }

type MobileCoopHuntLayoutProps = {
  playerCount: number
  onPlayerCountChange: (count: number) => void
  onMonsterHuntChange?: (ctx: CrateHuntContext) => void
  onWeaponHuntChange?: (ctx: CrateHuntContext) => void
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
        disabled={playerCount >= MAX_PLAYERS}
        onClick={() => onChange(playerCount + 1)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-lg font-bold text-wilds-parchment transition enabled:cursor-pointer hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35"
      >
        +
      </button>
    </div>
  )
}

function MobileCoopHuntLayout({
  playerCount,
  onPlayerCountChange,
  onMonsterHuntChange,
  onWeaponHuntChange,
}: MobileCoopHuntLayoutProps) {
  const [players, setPlayers] = useState<PlayerSlot[]>(() =>
    Array.from({ length: Math.min(Math.max(playerCount, 1), MAX_PLAYERS) }, (_, index) => ({
      id: index + 1,
    })),
  )
  const nextIdRef = useRef(playerCount + 1)

  const [poolFilter, setPoolFilter] = useState<MonsterPoolFilterState>(DEFAULT_MONSTER_POOL_FILTER)
  const [starFilter, setStarFilter] = useState<HuntStarFilterState>(DEFAULT_HUNT_STAR_FILTER)
  const [questTypeEnabled, setQuestTypeEnabled] = useState(true)
  const [excludedMonsters, setExcludedMonsters] = useState<MonsterExcludeState>(() => new Set())
  const [monsterModalOpen, setMonsterModalOpen] = useState(false)
  const [monsterPreviewPool, setMonsterPreviewPool] = useState<CrateEntry[]>([])

  const [monsterPhase, setMonsterPhase] = useState<CrateHuntContext['phase']>('idle')
  const [monsterContext, setMonsterContext] = useState<CrateHuntContext | null>(null)
  const [weaponDraws, setWeaponDraws] = useState<Record<number, PlayerDraw>>({})
  const [weaponPhases, setWeaponPhases] = useState<Record<number, CrateHuntContext['phase']>>({})

  const monsterRef = useRef<CrateHuntHandle>(null)
  const weaponRefs = useRef<Record<number, CrateHuntHandle | null>>({})

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
  const monsterSpinning = monsterPhase === 'spinning'
  const filtersDisabled = monsterSpinning
  const drawButtonClass =
    players.length > 2 ? 'min-h-[3rem] py-2 text-sm' : 'min-h-[4rem] py-3 text-sm'

  const handlePlayerCountChange = useCallback(
    (count: number) => {
      onPlayerCountChange(count)
      setPlayers((current) => {
        if (count > current.length) {
          const added: PlayerSlot[] = []
          for (let i = current.length; i < count; i++) {
            added.push({ id: nextIdRef.current++ })
          }
          return [...current, ...added]
        }

        const remaining = current.slice(0, count)
        const keptIds = new Set(remaining.map((p) => p.id))
        setWeaponDraws((prev) =>
          Object.fromEntries(Object.entries(prev).filter(([id]) => keptIds.has(Number(id)))),
        )
        setWeaponPhases((prev) =>
          Object.fromEntries(Object.entries(prev).filter(([id]) => keptIds.has(Number(id)))),
        )
        return remaining
      })
    },
    [onPlayerCountChange],
  )

  const handleMonsterHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setMonsterPhase(ctx.phase)
      if (ctx.phase === 'revealed' && ctx.result) {
        setMonsterContext(ctx)
      }
      onMonsterHuntChange?.(ctx)
    },
    [onMonsterHuntChange],
  )

  const handleWeaponHuntChange = useCallback(
    (playerId: number, ctx: CrateHuntContext) => {
      setWeaponPhases((prev) => ({ ...prev, [playerId]: ctx.phase }))

      if (ctx.phase === 'revealed' && ctx.result) {
        setWeaponDraws((prev) => ({
          ...prev,
          [playerId]: {
            result: ctx.result!,
            spinnerUiVisible: ctx.spinnerUiVisible,
          },
        }))
      }

      if (playerId === players[0]?.id) {
        onWeaponHuntChange?.(ctx)
      }
    },
    [onWeaponHuntChange, players],
  )

  const allIdle =
    monsterPhase === 'idle' && players.every((p) => (weaponPhases[p.id] ?? 'idle') === 'idle')

  const monsterInitialContext: CrateHuntContext | null =
    monsterContext?.phase === 'revealed'
      ? { ...monsterContext, spinnerUiVisible: false }
      : null

  const showMonsterSlideshow = allIdle && monsterPreviewPool.length > 0
  const showWeaponSlideshow = allIdle && WEAPON_POOL.length > 0

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        <div className={`${PLAYER_TOOLBAR_SHELL_CLASS} bg-wilds-950/70 backdrop-blur-sm`}>
          <PlayerCountControls playerCount={players.length} onChange={handlePlayerCountChange} />
        </div>

        <div
          className="grid min-h-0 flex-1 grid-cols-2"
          style={{ gridTemplateRows: `repeat(${players.length}, minmax(0, 1fr))` }}
        >
          <section
            className={`relative flex min-h-0 flex-col border-r ${SECTION_BORDER}`}
            style={{ gridRow: `1 / span ${players.length}` }}
          >
            <div
              className={`pointer-events-none absolute inset-0 overflow-hidden ${
                showMonsterSlideshow || monsterPhase !== 'idle' ? '' : 'hidden'
              }`}
            >
              {showMonsterSlideshow ? (
                <MonsterPoolSlideshow pool={monsterPreviewPool} />
              ) : monsterPhase !== 'idle' ? (
                <div className="h-full w-full bg-wilds-950" aria-hidden="true" />
              ) : null}
            </div>
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <CrateHunt
                ref={monsterRef}
                poolCountLabel=""
                buttonLayoutId="coop-monster-crate-button"
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
                initialContext={monsterInitialContext}
                onHuntChange={handleMonsterHuntChange}
              />
            </div>
          </section>

          {players.map((player, rowIndex) => {
            const weaponPhase = weaponPhases[player.id] ?? 'idle'
            const weaponDraw = weaponDraws[player.id]
            const rowBorder = rowIndex < players.length - 1 ? `border-b ${SECTION_BORDER}` : ''
            const isActive = weaponPhase !== 'idle' || Boolean(weaponDraw)
            const labelColorClass = isActive
              ? (PLAYER_LABEL_COLORS_ACTIVE[rowIndex] ?? PLAYER_LABEL_COLORS_ACTIVE[0])
              : (PLAYER_LABEL_COLORS[rowIndex] ?? PLAYER_LABEL_COLORS[0])

            const weaponInitialContext: CrateHuntContext | null = weaponDraw
              ? {
                  result: weaponDraw.result,
                  questType: null,
                  huntStar: null,
                  phase: 'revealed',
                  spinnerUiVisible: false,
                }
              : null

            return (
              <section
                key={player.id}
                className={`relative flex min-h-0 flex-col ${rowBorder}`}
                style={{ gridColumn: 2, gridRow: rowIndex + 1 }}
              >
                <span
                  className={`wilds-legibility-text pointer-events-none absolute left-0 top-0 z-20 px-1.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${labelColorClass}`}
                >
                  P{rowIndex + 1}
                </span>
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {showWeaponSlideshow ? (
                    <WeaponPoolSlideshow pool={WEAPON_POOL} />
                  ) : (
                    <div className="h-full w-full bg-wilds-950" aria-hidden="true" />
                  )}
                </div>
                <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                  <CrateHunt
                    ref={(handle) => {
                      weaponRefs.current[player.id] = handle
                    }}
                    poolCountLabel=""
                    buttonLayoutId={`coop-p${player.id}-weapon`}
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
                    initialContext={weaponInitialContext}
                    onHuntChange={(ctx) => handleWeaponHuntChange(player.id, ctx)}
                  />
                </div>
              </section>
            )
          })}
        </div>

        <div className="mobile-hunt-controls shrink-0 border-t border-wilds-gold/10 bg-wilds-950/92 px-3 py-2 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-2">
            <div className="mobile-hunt-controls-stacked flex flex-col gap-2">
              <MonstersPickerButton
                excludedCount={excludedMonsters.size}
                disabled={filtersDisabled}
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

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: `repeat(${players.length}, minmax(0, auto))` }}
            >
              <StatefulButton
                layoutId="coop-monster-crate-button"
                loadingLabels={SPIN_LABELS}
                icon="sword"
                surface="matte"
                disabled={monsterSpinning || filteredPool.length === 0}
                onClick={() => monsterRef.current?.startSpin()}
                className="min-h-[6rem] py-4 text-base"
                style={{ gridRow: `1 / span ${players.length}`, gridColumn: 1 }}
              >
                Hunt
              </StatefulButton>

              {players.map((player, index) => {
                const weaponSpinning = weaponPhases[player.id] === 'spinning'

                return (
                  <StatefulButton
                    key={player.id}
                    layout={false}
                    loadingLabels={['Drawing']}
                    icon="shield"
                    surface="shiny"
                    disabled={weaponSpinning}
                    onClick={() => weaponRefs.current[player.id]?.startSpin()}
                    className={drawButtonClass}
                    style={{ gridColumn: 2, gridRow: index + 1 }}
                  >
                    P{index + 1} Draw
                  </StatefulButton>
                )
              })}
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

export default MobileCoopHuntLayout
