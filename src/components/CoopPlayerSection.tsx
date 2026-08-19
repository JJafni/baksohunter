import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { CrateEntry } from '../data/types'
import GalleryBackdropOverlay from './GalleryBackdropOverlay'
import WeaponGalleryImage from './WeaponGalleryImage'
import { HUNT_COLUMN_MAX_WIDTH } from '../lib/crateConfig'

/** Approximate stacked overlay height used for scale-to-fit in grid cells. */
const SPINNER_NATURAL_HEIGHT = 680

export type PlayerDraw = {
  result: CrateEntry
  weaponRender: { name: string; url: string } | null
  displayName: string
  spinnerUiVisible: boolean
}

type CoopPlayerSectionProps = {
  playerIndex: number
  isActive: boolean
  draw: PlayerDraw | null
  useMonsterWeapons: boolean
  /** Shared spinner — only passed for the active player's cell. */
  spinner?: ReactNode
}

function CoopPlayerSection({
  playerIndex,
  isActive,
  draw,
  useMonsterWeapons,
  spinner,
}: CoopPlayerSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
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
  const imageUrl = useMonsterWeapons ? (draw?.weaponRender?.url ?? null) : null

  return (
    <div ref={containerRef} className="relative h-full min-h-0 overflow-hidden">
      <span
        className={`wilds-legibility-text pointer-events-none absolute left-0 top-0 z-20 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-2.5 sm:py-2 sm:text-xs ${
          isActive ? 'text-wilds-gold-light' : 'text-wilds-muted/80'
        }`}
      >
        Player {playerIndex + 1}
      </span>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <WeaponGalleryImage
          result={draw?.result ?? null}
          visible={hasDraw}
          emphasized={galleryEmphasized}
          variant="backdrop"
          imageUrl={imageUrl}
          fillSection
          wikiSource={useMonsterWeapons && !!draw?.weaponRender}
        />
        <GalleryBackdropOverlay revealed={hasDraw} emphasized={galleryEmphasized} />
      </div>

      <div className="relative z-10 flex h-full min-h-0 items-center justify-center">
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
            <p className="text-lg font-black uppercase leading-tight tracking-tight text-wilds-parchment sm:text-xl lg:text-2xl">
              {draw.displayName}
            </p>
          </div>
        ) : isActive ? (
          <p className="px-3 text-center text-[10px] uppercase tracking-[0.16em] text-wilds-muted/70">
            Your turn
          </p>
        ) : (
          <p className="px-3 text-center text-[10px] uppercase tracking-[0.16em] text-wilds-muted/40">
            Waiting
          </p>
        )}
      </div>
    </div>
  )
}

export default CoopPlayerSection
