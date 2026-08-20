import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { HUNT_COLUMN_MAX_WIDTH } from '../lib/crateConfig'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import type { Rarity } from '../data/types'
import { StatefulButton } from './ui/stateful-button'

/** Match co-op cell overlay height for scale-to-fit. */
const SPINNER_NATURAL_HEIGHT = 620

const RARITY_LABELS: Record<Rarity, string> = {
  normal: '',
  tempered: '',
  'arch-tempered': '',
}

type WeaponCrateOpenerProps = {
  initialContext?: CrateHuntContext | null
  onHuntChange?: (ctx: CrateHuntContext) => void
}

function WeaponCrateOpener({ initialContext = null, onHuntChange }: WeaponCrateOpenerProps) {
  const isMobile = useIsMobileLayout()
  const overlayMode = Boolean(onHuntChange)

  if (!isMobile) {
    return (
      <CrateHunt
        poolCountLabel=""
        buttonLayoutId="weapon-crate-button"
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
        overlaySpinnerCentered={overlayMode}
        revealNameAfterSpinnerFade={overlayMode}
        revealLayout="inline"
        initialContext={initialContext}
        onHuntChange={onHuntChange}
      />
    )
  }

  return (
    <MobileSoloWeaponCrateOpener initialContext={initialContext} onHuntChange={onHuntChange} />
  )
}

/** Mobile solo — same scaled overlay + external DRAW pattern as co-op cells. */
function MobileSoloWeaponCrateOpener({
  initialContext = null,
  onHuntChange,
}: WeaponCrateOpenerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const crateRef = useRef<CrateHuntHandle>(null)
  const [scale, setScale] = useState(1)
  const [phase, setPhase] = useState<CrateHuntContext['phase']>(() => initialContext?.phase ?? 'idle')

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
      onHuntChange?.(ctx)
    },
    [onHuntChange],
  )

  const handleDraw = useCallback(async () => {
    if (phase === 'spinning') return
    await crateRef.current?.startSpin()
  }, [phase])

  const showCrateHunt = phase !== 'idle'
  const spinning = phase === 'spinning'
  const isActive = spinning || phase === 'revealed'

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
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
              buttonLayoutId="weapon-crate-button"
              buttonLabels={{ open: 'DRAW', again: 'DRAW' }}
              rarityLabels={RARITY_LABELS}
              pool={WEAPON_POOL}
              pickRandom={pickRandomWeapon}
              reelSide="right"
              spinLabels={['Drawing']}
              buttonIcon="shield"
              buttonSurface="shiny"
              externalGallery
              overlayMode
              overlaySpinnerCentered
              revealNameAfterSpinnerFade
              revealLayout="inline"
              hidePrimaryButton
              initialContext={initialContext}
              onHuntChange={handleHuntChange}
            />
          </div>
        </div>

        <div className="relative z-20 shrink-0 px-2 pb-2 pt-1 sm:px-3 sm:pb-3">
          <StatefulButton
            layoutId="weapon-crate-button"
            loadingLabels={['Drawing']}
            icon="shield"
            surface="shiny"
            disabled={spinning}
            onClick={handleDraw}
            className={`w-full text-sm tracking-[0.12em] ${isActive && !spinning ? 'ring-1 ring-wilds-gold/50' : ''}`}
          >
            DRAW
          </StatefulButton>
        </div>
      </div>
    </div>
  )
}

export default WeaponCrateOpener
