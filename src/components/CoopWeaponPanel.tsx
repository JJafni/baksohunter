import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CoopPlayerSection, { type PlayerDraw } from './CoopPlayerSection'
import WeaponCrateOpener from './WeaponCrateOpener'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'

const MAX_PLAYERS = 4
const SECTION_BORDER = 'border-wilds-gold/15'

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
      return `${base} grid-cols-2 grid-rows-2 [&>*:last-child]:col-span-2`
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
}: {
  playerCount: number
  onChange: (count: number) => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-3">
      <button
        type="button"
        aria-label="Remove player"
        disabled={playerCount <= 1}
        onClick={() => onChange(playerCount - 1)}
        className="inline-flex size-7 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-sm font-bold text-wilds-parchment transition hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35 sm:size-8"
      >
        −
      </button>
      <span className="min-w-[5.5rem] text-center text-[10px] font-bold uppercase tracking-[0.16em] text-wilds-muted sm:min-w-[7rem] sm:text-[11px] sm:tracking-[0.18em]">
        {playerCount} {playerCount === 1 ? 'Player' : 'Players'}
      </span>
      <button
        type="button"
        aria-label="Add player"
        disabled={playerCount >= MAX_PLAYERS}
        onClick={() => onChange(playerCount + 1)}
        className="inline-flex size-7 items-center justify-center rounded-md border border-wilds-gold/25 bg-wilds-900/70 text-sm font-bold text-wilds-parchment transition hover:border-wilds-gold/45 hover:bg-wilds-850 disabled:cursor-not-allowed disabled:opacity-35 sm:size-8"
      >
        +
      </button>
    </div>
  )
}

const PLAYER_TOOLBAR_SHELL_CLASS =
  'flex shrink-0 justify-center border-b border-wilds-gold/10 px-2 py-1.5 sm:py-2'

/** Invisible desktop spacer so monster/weapon action rows share the same top inset. */
export function PlayerCountToolbarSpacer() {
  return (
    <div
      className={`${PLAYER_TOOLBAR_SHELL_CLASS} pointer-events-none invisible hidden lg:flex`}
      aria-hidden="true"
    >
      <PlayerCountControls playerCount={1} onChange={() => {}} />
    </div>
  )
}

function CoopPanelShell({
  playerCount,
  onPlayerCountChange,
  children,
}: {
  playerCount: number
  onPlayerCountChange: (count: number) => void
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div
        className={`${PLAYER_TOOLBAR_SHELL_CLASS} bg-wilds-950/70 backdrop-blur-sm`}
      >
        <PlayerCountControls playerCount={playerCount} onChange={onPlayerCountChange} />
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}

function CoopWeaponPanel({ onHuntChange, onCoopModeChange }: CoopWeaponPanelProps) {
  const isMobile = useIsMobileLayout()
  const { ref: panelRef, canSplit: splitTwoPlayers } = useCoopPanelSplit()
  const [players, setPlayers] = useState<PlayerSlot[]>([{ id: 1 }])
  const nextIdRef = useRef(2)
  const [draws, setDraws] = useState<Record<number, PlayerDraw>>({})

  const coopMode = players.length > 1
  const overlayMode = !isMobile
  const soloPlayerId = players[0]?.id
  const soloDraw = soloPlayerId != null ? (draws[soloPlayerId] ?? null) : null
  const soloInitialContext: CrateHuntContext | null = soloDraw
    ? {
        result: soloDraw.result,
        questType: null,
        huntStar: null,
        phase: 'revealed',
        spinnerUiVisible: false,
      }
    : null

  useEffect(() => {
    onCoopModeChange?.(coopMode)
  }, [coopMode, onCoopModeChange])

  useEffect(() => {
    if (coopMode) {
      onHuntChange?.(IDLE_HUNT)
      return
    }

    if (soloDraw) {
      onHuntChange?.({
        result: soloDraw.result,
        questType: null,
        huntStar: null,
        phase: 'revealed',
        spinnerUiVisible: false,
      })
      return
    }

    onHuntChange?.(IDLE_HUNT)
  }, [coopMode, soloDraw, soloPlayerId, onHuntChange])

  const handleSoloHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      onHuntChange?.(ctx)

      if (soloPlayerId == null || ctx.phase !== 'revealed' || !ctx.result) return

      setDraws((prev) => ({
        ...prev,
        [soloPlayerId]: {
          result: ctx.result!,
          spinnerUiVisible: ctx.spinnerUiVisible,
        },
      }))
    },
    [onHuntChange, soloPlayerId],
  )

  const handlePlayerCountChange = useCallback((count: number) => {
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
      setDraws((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([id]) => keptIds.has(Number(id)))),
      )
      return remaining
    })
  }, [])

  const handleDrawChange = useCallback((playerId: number, draw: PlayerDraw | null) => {
    setDraws((prev) => {
      if (!draw) {
        const next = { ...prev }
        delete next[playerId]
        return next
      }
      return { ...prev, [playerId]: draw }
    })
  }, [])

  if (!coopMode) {
    return (
      <CoopPanelShell playerCount={players.length} onPlayerCountChange={handlePlayerCountChange}>
        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center">
          <WeaponCrateOpener
            key={`solo-${soloPlayerId ?? 0}`}
            initialContext={soloInitialContext}
            onHuntChange={handleSoloHuntChange}
          />
        </div>
      </CoopPanelShell>
    )
  }

  return (
    <CoopPanelShell playerCount={players.length} onPlayerCountChange={handlePlayerCountChange}>
      <div ref={panelRef} className="relative h-full min-h-0 w-full flex-1 self-stretch">
        <div className={`absolute inset-0 ${coopGridClass(players.length, splitTwoPlayers)}`}>
          {players.map((player, index) => (
            <CoopPlayerSection
              key={player.id}
              playerIndex={index}
              playerId={player.id}
              draw={draws[player.id] ?? null}
              borderClass={sectionBorderClass(index, players.length, splitTwoPlayers)}
              overlayMode={overlayMode}
              isMobile={isMobile}
              onDrawChange={(draw) => handleDrawChange(player.id, draw)}
            />
          ))}
        </div>
      </div>
    </CoopPanelShell>
  )
}

export default CoopWeaponPanel
