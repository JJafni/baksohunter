import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { CrateEntry } from '../data/types'
import GalleryBackdropOverlay from './GalleryBackdropOverlay'
import WeaponGalleryImage from './WeaponGalleryImage'
import { StatefulButton } from './ui/stateful-button'
import { HUNT_COLUMN_MAX_WIDTH } from '../lib/crateConfig'

/** Approximate stacked overlay height used for scale-to-fit in grid cells. */
const SPINNER_NATURAL_HEIGHT = 620

export type PlayerDraw = {
  result: CrateEntry
  spinnerUiVisible: boolean
}

type CoopPlayerSectionProps = {
  playerIndex: number
  playerId: number
  isActive: boolean
  draw: PlayerDraw | null
  borderClass?: string
  drawDisabled: boolean
  onDraw: () => void | Promise<void>
  /** Shared spinner — only passed for the active player's cell. */
  spinner?: ReactNode
}

function CoopPlayerSection({
  playerIndex,
  playerId,
  isActive,
  draw,
  borderClass = '',
  drawDisabled,
  onDraw,
  spinner,
}: CoopPlayerSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

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

  const hasDraw = draw !== null
  const galleryEmphasized = hasDraw && draw.spinnerUiVisible

  return (
    <div className={`relative flex h-full min-h-0 flex-col overflow-hidden ${borderClass}`}>
      <span
        className={`wilds-legibility-text pointer-events-none absolute left-0 top-0 z-20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-2.5 sm:py-2 sm:text-xs ${
          isActive ? 'text-wilds-gold-light' : 'text-wilds-muted/80'
        }`}
      >
        Player {playerIndex + 1}
      </span>

      {hasDraw ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <WeaponGalleryImage
            result={draw.result}
            visible
            emphasized={galleryEmphasized}
            variant="backdrop"
            fillSection
          />
          <GalleryBackdropOverlay revealed emphasized={galleryEmphasized} />
        </div>
      ) : null}

      <div ref={contentRef} className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {spinner ? (
            <div
              className="shrink-0"
              style={{
                width: HUNT_COLUMN_MAX_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              {spinner}
            </div>
          ) : hasDraw ? (
            <div className="wilds-legibility-text pointer-events-none px-3 text-center">
              <p className="text-base font-black uppercase leading-tight tracking-tight text-wilds-parchment sm:text-lg lg:text-xl">
                {draw.result.name}
              </p>
            </div>
          ) : null}
        </div>

        <div className="relative z-20 shrink-0 px-2 pb-2 pt-1 sm:px-3 sm:pb-3">
          {isActive && !drawDisabled ? (
            <p className="mb-1 text-center text-[9px] uppercase tracking-[0.14em] text-wilds-gold-light/80">
              Your turn
            </p>
          ) : null}
          <StatefulButton
            layoutId={`coop-player-${playerId}-draw`}
            loadingLabels={['Drawing']}
            icon="shield"
            surface="shiny"
            disabled={drawDisabled}
            onClick={onDraw}
            className={`w-full ${isActive && !drawDisabled ? 'ring-1 ring-wilds-gold/50' : ''}`}
          >
            P{playerIndex + 1} DRAW
          </StatefulButton>
        </div>
      </div>
    </div>
  )
}

export default CoopPlayerSection
