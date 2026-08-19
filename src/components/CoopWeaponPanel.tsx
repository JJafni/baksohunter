import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import CoopPlayerSection, { type PlayerDraw } from './CoopPlayerSection'
import WeaponCrateOpener from './WeaponCrateOpener'
import WeaponGalleryImage from './WeaponGalleryImage'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import type { Rarity } from '../data/types'

const MAX_PLAYERS = 4
const SECTION_BORDER = 'border-wilds-gold/15'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Weapon Type',
  tempered: 'Weapon Type',
  'arch-tempered': 'Weapon Type',
}

const IDLE_HUNT: CrateHuntContext = {
  result: null,
  questType: null,
  huntStar: null,
  phase: 'idle',
  spinnerUiVisible: true,
}

type PlayerSlot = { id: number }

type CoopWeaponPanelProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
  onCoopModeChange?: (coopMode: boolean) => void
}

function coopGridClass(count: number) {
  const base = 'grid h-full w-full grid-cols-1 gap-0 [&>*]:min-h-0'
  switch (count) {
    case 2:
      return `${base} lg:grid-cols-2 lg:grid-rows-1`
    case 3:
      return `${base} lg:grid-cols-2 lg:grid-rows-2 [&>*:last-child]:lg:col-span-2`
    default:
      return `${base} lg:grid-cols-2 lg:grid-rows-2`
  }
}

function sectionBorderClass(index: number, count: number): string {
  const isLast = index === count - 1

  if (count === 2) {
    return index === 0
      ? `border-b ${SECTION_BORDER} lg:border-b-0 lg:border-r`
      : ''
  }

  if (count === 3) {
    if (index === 0) return `border-b border-r ${SECTION_BORDER} lg:border-b`
    if (index === 1) return `border-b ${SECTION_BORDER} lg:border-b`
    return `border-t ${SECTION_BORDER} lg:border-t-0`
  }

  if (count === 4) {
    if (index === 0) return `border-b border-r ${SECTION_BORDER} lg:border-b`
    if (index === 1) return `border-b ${SECTION_BORDER} lg:border-b`
    if (index === 2) return `border-r ${SECTION_BORDER}`
    return ''
  }

  return isLast ? '' : `border-b ${SECTION_BORDER}`
}

function PlayerCountControls({
  playerCount,
  onChange,
  disabled,
}: {
  playerCount: number
  onChange: (count: number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-3">
      <button
        type="button"
        aria-label="Remove player"
        disabled={disabled || playerCount <= 1}
        onClick={() => onChange(playerCount - 1)}
        className="inline-flex size-8 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-sm font-bold text-wilds-parchment transition hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35"
      >
        −
      </button>
      <span className="min-w-[7rem] text-center text-[11px] font-bold uppercase tracking-[0.18em] text-wilds-muted">
        {playerCount} {playerCount === 1 ? 'Player' : 'Players'}
      </span>
      <button
        type="button"
        aria-label="Add player"
        disabled={disabled || playerCount >= MAX_PLAYERS}
        onClick={() => onChange(playerCount + 1)}
        className="inline-flex size-8 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-sm font-bold text-wilds-parchment transition hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35"
      >
        +
      </button>
    </div>
  )
}

function CoopWeaponPanel({ onHuntChange, onCoopModeChange }: CoopWeaponPanelProps) {
  const isMobile = useIsMobileLayout()
  const [players, setPlayers] = useState<PlayerSlot[]>([{ id: 1 }])
  const nextIdRef = useRef(2)
  const [activePlayerIndex, setActivePlayerIndex] = useState(0)
  const [draws, setDraws] = useState<Record<number, PlayerDraw>>({})
  const [spinContext, setSpinContext] = useState<CrateHuntContext>(IDLE_HUNT)
  const crateRef = useRef<CrateHuntHandle>(null)
  const prevPhaseRef = useRef<CrateHuntContext['phase']>('idle')

  const coopMode = players.length > 1
  const overlayMode = !isMobile
  const spinning = spinContext.phase === 'spinning'

  useEffect(() => {
    onCoopModeChange?.(coopMode)
  }, [coopMode, onCoopModeChange])

  useEffect(() => {
    if (!coopMode) return
    onHuntChange?.(IDLE_HUNT)
  }, [coopMode, onHuntChange])

  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayers((current) => {
      if (count > current.length) {
        const added: PlayerSlot[] = []
        for (let i = current.length; i < count; i++) {
          added.push({ id: nextIdRef.current++ })
        }
        return [...current, ...added]
      }
      return current.slice(0, count)
    })
    setDraws({})
    setActivePlayerIndex(0)
    setSpinContext(IDLE_HUNT)
  }, [])

  const handleSpinChange = useCallback(
    (ctx: CrateHuntContext) => {
      setSpinContext(ctx)

      if (ctx.phase === 'revealed' && ctx.result) {
        const activeId = players[activePlayerIndex]?.id
        if (activeId !== undefined) {
          setDraws((prev) => ({
            ...prev,
            [activeId]: {
              result: ctx.result!,
              spinnerUiVisible: ctx.spinnerUiVisible,
            },
          }))
        }
      }
    },
    [activePlayerIndex, players],
  )

  useEffect(() => {
    const activeId = players[activePlayerIndex]?.id
    if (activeId === undefined) return

    setDraws((prev) => {
      const existing = prev[activeId]
      if (!existing) return prev
      return {
        ...prev,
        [activeId]: { ...existing, spinnerUiVisible: spinContext.spinnerUiVisible },
      }
    })
  }, [spinContext.spinnerUiVisible, activePlayerIndex, players])

  useEffect(() => {
    if (prevPhaseRef.current === 'spinning' && spinContext.phase === 'revealed') {
      setActivePlayerIndex((index) => (index + 1) % players.length)
      setSpinContext(IDLE_HUNT)
    }
    prevPhaseRef.current = spinContext.phase
  }, [spinContext.phase, players.length])

  const handlePlayerDraw = useCallback(
    async (playerIndex: number) => {
      if (playerIndex !== activePlayerIndex || spinning) return
      await crateRef.current?.startSpin()
    },
    [activePlayerIndex, spinning],
  )

  const sharedSpinner = (
    <CrateHunt
      ref={crateRef}
      poolCountLabel="Weapon Types in the pool"
      buttonLayoutId="coop-weapon-crate-button"
      buttonLabels={{ open: 'DRAW', again: 'DRAW' }}
      rarityLabels={RARITY_LABELS}
      pool={WEAPON_POOL}
      pickRandom={pickRandomWeapon}
      reelSide="right"
      spinLabels={['Drawing']}
      buttonIcon="shield"
      buttonSurface="shiny"
      externalGallery={overlayMode}
      overlayMode={overlayMode}
      revealLayout="inline"
      hidePrimaryButton
      onHuntChange={handleSpinChange}
      belowReel={
        isMobile
          ? ({ result, phase }) => (
              <WeaponGalleryImage result={result} visible={phase === 'revealed'} emphasized={false} fillSection />
            )
          : undefined
      }
    />
  )

  if (!coopMode) {
    return (
      <div className="relative h-full min-h-0 w-full">
        <div className="flex h-full min-h-0 w-full flex-col items-center">
          <WeaponCrateOpener onHuntChange={onHuntChange} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center lg:top-3">
          <div className="pointer-events-auto rounded-lg bg-wilds-950/80 px-2 py-1 backdrop-blur-sm">
            <PlayerCountControls playerCount={players.length} onChange={handlePlayerCountChange} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-0 w-full flex-1 self-stretch">
      <div className={`absolute inset-0 ${coopGridClass(players.length)}`}>
        {players.map((player, index) => {
          const isActive = index === activePlayerIndex
          const spinnerVisible = spinContext.phase !== 'idle'
          const disabled = spinning || !isActive

          return (
            <CoopPlayerSection
              key={player.id}
              playerIndex={index}
              playerId={player.id}
              isActive={isActive}
              draw={draws[player.id] ?? null}
              borderClass={sectionBorderClass(index, players.length)}
              drawDisabled={disabled}
              onDraw={() => handlePlayerDraw(index)}
              spinner={
                isActive ? (
                  <div
                    className={spinnerVisible ? '' : 'h-0 overflow-hidden opacity-0'}
                    aria-hidden={!spinnerVisible}
                  >
                    {sharedSpinner}
                  </div>
                ) : undefined
              }
            />
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center lg:top-3">
        <div className="pointer-events-auto rounded-lg bg-wilds-950/80 px-2 py-1 backdrop-blur-sm">
          <PlayerCountControls
            playerCount={players.length}
            onChange={handlePlayerCountChange}
            disabled={spinning}
          />
        </div>
      </div>
    </div>
  )
}

export default CoopWeaponPanel
