import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import { HUNT_COLUMN_MAX_WIDTH } from '../lib/crateConfig'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import GalleryBackdropOverlay from './GalleryBackdropOverlay'
import WeaponGalleryImage from './WeaponGalleryImage'
import { StatefulButton } from './ui/stateful-button'

/** Approximate stacked overlay height used for scale-to-fit in grid cells. */
const SPINNER_NATURAL_HEIGHT = 620

const RARITY_LABELS: Record<Rarity, string> = {
  normal: '',
  tempered: '',
  'arch-tempered': '',
}

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

export type PlayerDraw = {
  result: CrateEntry
  spinnerUiVisible: boolean
}

type CoopPlayerSectionProps = {
  playerIndex: number
  playerId: number
  draw: PlayerDraw | null
  borderClass?: string
  overlayMode: boolean
  isMobile: boolean
  onDrawChange: (draw: PlayerDraw | null) => void
}

function CoopPlayerSection({
  playerIndex,
  playerId,
  draw,
  borderClass = '',
  overlayMode,
  isMobile,
  onDrawChange,
}: CoopPlayerSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const crateRef = useRef<CrateHuntHandle>(null)
  const [scale, setScale] = useState(1)
  const [phase, setPhase] = useState<CrateHuntContext['phase']>(() => (draw ? 'revealed' : 'idle'))
  const [spinnerUiVisible, setSpinnerUiVisible] = useState(
    () => draw?.spinnerUiVisible ?? true,
  )

  const restoredContext: CrateHuntContext | null = draw
    ? {
        result: draw.result,
        questType: null,
        huntStar: null,
        phase: 'revealed',
        spinnerUiVisible: false,
      }
    : null

  useEffect(() => {
    if (!draw) {
      setPhase('idle')
      setSpinnerUiVisible(true)
    }
  }, [draw])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const updateScale = () => {
      const width = el.clientWidth
      const height = el.clientHeight
      if (width <= 0 || height <= 0) return

      const scaleW = width / HUNT_COLUMN_MAX_WIDTH
      const scaleH = height / SPINNER_NATURAL_HEIGHT
      setScale(Math.min(scaleW, scaleH, 1))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setPhase(ctx.phase)
      setSpinnerUiVisible(ctx.spinnerUiVisible)

      if (ctx.phase === 'revealed' && ctx.result) {
        onDrawChange({
          result: ctx.result,
          spinnerUiVisible: ctx.spinnerUiVisible,
        })
      }
    },
    [onDrawChange],
  )

  const handleDraw = useCallback(async () => {
    if (phase === 'spinning') return
    await crateRef.current?.startSpin()
  }, [phase])

  const useCenterReveal = overlayMode
  const hasDraw = draw !== null
  const galleryVisible = hasDraw && phase === 'revealed'
  const galleryEmphasized = galleryVisible && spinnerUiVisible
  const spinning = phase === 'spinning'
  const showCrateHunt = phase !== 'idle'
  const isActive = spinning || phase === 'revealed'
  const labelColorClass = isActive
    ? (PLAYER_LABEL_COLORS_ACTIVE[playerIndex] ?? PLAYER_LABEL_COLORS_ACTIVE[0])
    : (PLAYER_LABEL_COLORS[playerIndex] ?? PLAYER_LABEL_COLORS[0])

  return (
    <div className={`relative flex h-full min-h-0 flex-col overflow-hidden ${borderClass}`}>
      <span
        className={`wilds-legibility-text pointer-events-none absolute left-0 top-0 z-20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-2.5 sm:py-2 sm:text-xs ${labelColorClass}`}
      >
        Player {playerIndex + 1}
      </span>

      {hasDraw && !isMobile ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <WeaponGalleryImage
            result={draw.result}
            visible={galleryVisible}
            emphasized={galleryEmphasized}
            variant="backdrop"
          />
          <GalleryBackdropOverlay revealed={galleryVisible} emphasized={galleryEmphasized} />
        </div>
      ) : null}

      <div ref={contentRef} className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div
            className={
              showCrateHunt
                ? 'shrink-0'
                : 'pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0'
            }
            aria-hidden={!showCrateHunt}
            style={
              showCrateHunt
                ? {
                    width: HUNT_COLUMN_MAX_WIDTH,
                    height: SPINNER_NATURAL_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }
                : undefined
            }
          >
            <CrateHunt
              ref={crateRef}
              poolCountLabel=""
              buttonLayoutId={`coop-player-${playerId}-crate`}
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
              overlaySpinnerCentered={useCenterReveal}
              revealNameAfterSpinnerFade={useCenterReveal}
              revealLayout="inline"
              hidePrimaryButton
              initialContext={restoredContext}
              onHuntChange={handleHuntChange}
            />
          </div>
        </div>

        <div className="relative z-20 shrink-0 px-2 pb-2 pt-1 sm:px-3 sm:pb-3">
          <StatefulButton
            layout={false}
            loadingLabels={['Drawing']}
            icon="shield"
            surface="shiny"
            disabled={spinning}
            onClick={handleDraw}
            className={`w-full ${isMobile ? 'text-sm tracking-[0.12em]' : ''} ${isActive && !spinning ? 'ring-1 ring-wilds-gold/50' : ''}`}
          >
            P{playerIndex + 1} DRAW
          </StatefulButton>
        </div>
      </div>
    </div>
  )
}

export default CoopPlayerSection
