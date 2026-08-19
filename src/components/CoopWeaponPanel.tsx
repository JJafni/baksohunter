import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

/** Min weapon-panel width before 2-player co-op sits side-by-side (~450px per cell). */
const COOP_TWO_PLAYER_SPLIT_MIN_WIDTH = 900

function useCoopPanelSplit(minWidth = COOP_TWO_PLAYER_SPLIT_MIN_WIDTH) {
  const [canSplit, setCanSplit] = useState(false)
  const observerRef = useRef<ResizeObserver | null>(null)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null

      if (!node) {
        setCanSplit(false)
        return
      }

      const update = () => {
        setCanSplit(node.clientWidth >= minWidth)
      }

      update()
      const observer = new ResizeObserver(update)
      observer.observe(node)
      observerRef.current = observer
    },
    [minWidth],
  )

  useEffect(() => () => observerRef.current?.disconnect(), [])

  return { ref, canSplit }
}

function coopGridClass(count: number, splitTwoPlayers: boolean) {
  const base = 'grid h-full w-full gap-0 [&>*]:min-h-0'
  switch (count) {
    case 2:
      return splitTwoPlayers
        ? `${base} grid-cols-2 grid-rows-1`
        : `${base} grid-cols-1 grid-rows-2`
    case 3:
      return `${base} grid-cols-2 grid-rows-2 [&>*:last-child]:col-span-2 [&>*:last-child]:mx-auto [&>*:last-child]:h-full [&>*:last-child]:w-full [&>*:last-child]:max-w-[calc(50%-0.375rem)]`
    default:
      return `${base} grid-cols-2 grid-rows-2`
  }
}

function sectionBorderClass(index: number, count: number, splitTwoPlayers: boolean): string {
  if (count === 2) {
    if (!splitTwoPlayers) {
      return index === 0 ? `border-b ${SECTION_BORDER}` : ''
    }
    return index === 0 ? `border-r ${SECTION_BORDER}` : ''
  }

  if (count === 3) {
    if (index === 0) return `border-b border-r ${SECTION_BORDER}`
    if (index === 1) return `border-b ${SECTION_BORDER}`
    return ''
  }

  if (count === 4) {
    if (index === 0) return `border-b border-r ${SECTION_BORDER}`
    if (index === 1) return `border-b ${SECTION_BORDER}`
    if (index === 2) return `border-r ${SECTION_BORDER}`
    return ''
  }

  return index === count - 1 ? '' : `border-b ${SECTION_BORDER}`
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
  const { ref: panelRef, canSplit: splitTwoPlayers } = useCoopPanelSplit()
  const [players, setPlayers] = useState<PlayerSlot[]>([{ id: 1 }])
  const nextIdRef = useRef(2)
  const [drawingPlayerId, setDrawingPlayerId] = useState<number | null>(null)
  const [draws, setDraws] = useState<Record<number, PlayerDraw>>({})
  const [spinContext, setSpinContext] = useState<CrateHuntContext>(IDLE_HUNT)
  const crateRef = useRef<CrateHuntHandle>(null)
  const pendingSpinRef = useRef(false)
  const spinCompleteRef = useRef<(() => void) | null>(null)
  const drawingPlayerIdRef = useRef<number | null>(null)
  const [drawLocked, setDrawLocked] = useState(false)

  const coopMode = players.length > 1
  const overlayMode = !isMobile
  const spinning = spinContext.phase === 'spinning'
  const drawBusy = drawLocked || drawingPlayerId !== null || spinning

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
    drawingPlayerIdRef.current = null
    setDrawLocked(false)
    setDrawingPlayerId(null)
    setSpinContext(IDLE_HUNT)
    pendingSpinRef.current = false
  }, [])

  const handleSpinChange = useCallback(
    (ctx: CrateHuntContext) => {
      setSpinContext(ctx)

      if (ctx.phase === 'revealed' && ctx.result && drawingPlayerId !== null) {
        setDraws((prev) => ({
          ...prev,
          [drawingPlayerId]: {
            result: ctx.result!,
            spinnerUiVisible: ctx.spinnerUiVisible,
          },
        }))
      }
    },
    [drawingPlayerId],
  )

  useEffect(() => {
    if (drawingPlayerId === null) return

    setDraws((prev) => {
      const existing = prev[drawingPlayerId]
      if (!existing) return prev
      return {
        ...prev,
        [drawingPlayerId]: { ...existing, spinnerUiVisible: spinContext.spinnerUiVisible },
      }
    })
  }, [spinContext.spinnerUiVisible, drawingPlayerId])

  useEffect(() => {
    if (drawingPlayerId !== null && spinContext.phase === 'revealed' && !spinContext.spinnerUiVisible) {
      setSpinContext(IDLE_HUNT)
      drawingPlayerIdRef.current = null
      setDrawLocked(false)
      setDrawingPlayerId(null)
      pendingSpinRef.current = false
    }
  }, [spinContext.phase, spinContext.spinnerUiVisible, drawingPlayerId])

  const resetDrawSession = useCallback(() => {
    pendingSpinRef.current = false
    drawingPlayerIdRef.current = null
    setDrawLocked(false)
    setDrawingPlayerId(null)
    spinCompleteRef.current?.()
    spinCompleteRef.current = null
  }, [])

  useLayoutEffect(() => {
    if (!pendingSpinRef.current || drawingPlayerId === null) return

    let cancelled = false

    const run = async () => {
      for (let attempt = 0; attempt < 10 && !cancelled; attempt++) {
        if (crateRef.current) break
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      }

      if (cancelled || !crateRef.current) {
        resetDrawSession()
        return
      }

      pendingSpinRef.current = false

      try {
        await crateRef.current.startSpin()
      } finally {
        spinCompleteRef.current?.()
        spinCompleteRef.current = null
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [drawingPlayerId, resetDrawSession])

  const handlePlayerDraw = useCallback(
    (playerIndex: number) => {
      if (
        drawingPlayerIdRef.current !== null ||
        pendingSpinRef.current ||
        drawLocked ||
        spinning
      ) {
        return Promise.resolve()
      }

      const playerId = players[playerIndex]?.id
      if (playerId === undefined) return Promise.resolve()

      pendingSpinRef.current = true
      drawingPlayerIdRef.current = playerId
      setDrawLocked(true)
      setDrawingPlayerId(playerId)

      return new Promise<void>((resolve) => {
        spinCompleteRef.current = resolve
      })
    },
    [players, drawLocked, spinning],
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
              <WeaponGalleryImage result={result} visible={phase === 'revealed'} emphasized={false} />
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
    <div ref={panelRef} className="relative h-full min-h-0 w-full flex-1 self-stretch">
      <div
        key={`coop-grid-${players.length}-${splitTwoPlayers ? 'split' : 'stack'}`}
        className={`absolute inset-0 ${coopGridClass(players.length, splitTwoPlayers)}`}
      >
        {players.map((player, index) => {
          const isDrawing = player.id === drawingPlayerId
          const spinnerVisible = isDrawing && spinContext.phase !== 'idle'

          return (
            <CoopPlayerSection
              key={player.id}
              playerIndex={index}
              playerId={player.id}
              isDrawing={isDrawing}
              draw={draws[player.id] ?? null}
              borderClass={sectionBorderClass(index, players.length, splitTwoPlayers)}
              drawDisabled={drawBusy}
              onDraw={() => handlePlayerDraw(index)}
              spinner={
                isDrawing ? (
                  <div
                    className={
                      spinnerVisible
                        ? ''
                        : 'pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0'
                    }
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
            disabled={drawBusy}
          />
        </div>
      </div>
    </div>
  )
}

export default CoopWeaponPanel
