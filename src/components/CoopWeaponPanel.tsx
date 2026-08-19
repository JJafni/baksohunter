import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import CoopPlayerSection, { type PlayerDraw } from './CoopPlayerSection'
import WeaponCrateOpener from './WeaponCrateOpener'
import WeaponGalleryImage from './WeaponGalleryImage'
import { StatefulButton } from './ui/stateful-button'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import { pickRandomWeaponRender } from '../lib/weaponRenderImages'
import type { Rarity } from '../data/types'

const MAX_PLAYERS = 4

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
  switch (count) {
    case 2:
      return 'grid h-full min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-2 lg:grid-rows-1'
    case 3:
      return 'grid h-full min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-2 lg:grid-rows-2 [&>*:last-child]:lg:col-span-2'
    default:
      return 'grid h-full min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-2 lg:grid-rows-2'
  }
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
    <div className="flex shrink-0 items-center justify-center gap-3 pb-3">
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
  const [activeRender, setActiveRender] = useState<{ name: string; url: string } | null>(null)
  const crateRef = useRef<CrateHuntHandle>(null)
  const prevPhaseRef = useRef<CrateHuntContext['phase']>('idle')

  const coopMode = players.length > 1
  const useMonsterWeapons = players.length >= 3
  const overlayMode = !isMobile
  const spinning = spinContext.phase === 'spinning'
  const revealName = useMonsterWeapons ? activeRender?.name : null

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
    setActiveRender(null)
  }, [])

  const handleSpinChange = useCallback(
    (ctx: CrateHuntContext) => {
      setSpinContext(ctx)

      if (ctx.phase === 'revealed' && ctx.result) {
        const render = useMonsterWeapons ? pickRandomWeaponRender(ctx.result.slug) : null
        setActiveRender(render ? { name: render.name, url: render.url } : null)

        const activeId = players[activePlayerIndex]?.id
        if (activeId !== undefined) {
          setDraws((prev) => ({
            ...prev,
            [activeId]: {
              result: ctx.result!,
              weaponRender: render ? { name: render.name, url: render.url } : null,
              displayName: render?.name ?? ctx.result!.name,
              spinnerUiVisible: ctx.spinnerUiVisible,
            },
          }))
        }
      }
    },
    [activePlayerIndex, players, useMonsterWeapons],
  )

  // Keep spinnerUiVisible in sync for saved draws
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
      setActiveRender(null)
    }
    prevPhaseRef.current = spinContext.phase
  }, [spinContext.phase, players.length])

  const handlePlayerDraw = useCallback(
    async (playerIndex: number) => {
      if (playerIndex !== activePlayerIndex || spinning) return
      setActiveRender(null)
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
      nameOverride={revealName}
      onHuntChange={handleSpinChange}
      belowReel={
        isMobile
          ? ({ result, phase }) => (
              <WeaponGalleryImage
                result={result}
                visible={phase === 'revealed'}
                emphasized={false}
                imageUrl={useMonsterWeapons ? activeRender?.url : null}
                fillSection
                wikiSource={useMonsterWeapons && activeRender !== null}
              />
            )
          : undefined
      }
    />
  )

  if (!coopMode) {
    return (
      <div className="flex w-full flex-col items-center">
        <PlayerCountControls
          playerCount={players.length}
          onChange={handlePlayerCountChange}
        />
        <WeaponCrateOpener onHuntChange={onHuntChange} />
      </div>
    )
  }

  const drawButtonGridClass =
    players.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'

  return (
    <div className="flex h-full min-h-0 w-full flex-col self-stretch">
      <div className="shrink-0 px-4 pt-1 lg:px-6">
        <PlayerCountControls
          playerCount={players.length}
          onChange={handlePlayerCountChange}
          disabled={spinning}
        />
      </div>

      <div className={coopGridClass(players.length)}>
        {players.map((player, index) => {
          const isActive = index === activePlayerIndex
          const spinnerVisible = spinContext.phase !== 'idle'

          return (
            <CoopPlayerSection
              key={player.id}
              playerIndex={index}
              isActive={isActive}
              draw={draws[player.id] ?? null}
              useMonsterWeapons={useMonsterWeapons}
              spinner={
                isActive ? (
                  <div className={spinnerVisible ? '' : 'h-0 overflow-hidden opacity-0'} aria-hidden={!spinnerVisible}>
                    {sharedSpinner}
                  </div>
                ) : undefined
              }
            />
          )
        })}
      </div>

      <div className={`mt-3 grid w-full shrink-0 gap-2 px-4 lg:px-6 ${drawButtonGridClass}`}>
        {players.map((player, index) => {
          const isActive = index === activePlayerIndex
          const disabled = spinning || !isActive

          return (
            <StatefulButton
              key={player.id}
              layoutId={`coop-player-${player.id}-draw`}
              loadingLabels={['Drawing']}
              icon="shield"
              surface="shiny"
              disabled={disabled}
              onClick={() => handlePlayerDraw(index)}
              className={`w-full ${isActive && !spinning ? 'ring-1 ring-wilds-gold/50' : ''}`}
            >
              P{index + 1} DRAW
            </StatefulButton>
          )
        })}
      </div>

      <p className="mt-2 shrink-0 px-4 pb-2 text-center text-[10px] uppercase tracking-[0.16em] text-wilds-muted lg:px-6">
        {spinning ? (
          <>Player {activePlayerIndex + 1}&apos;s turn — drawing…</>
        ) : (
          <span className="text-wilds-gold-light/80">Player {activePlayerIndex + 1}&apos;s turn</span>
        )}
      </p>
    </div>
  )
}

export default CoopWeaponPanel
