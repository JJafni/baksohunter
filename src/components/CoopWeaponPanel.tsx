import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateHuntContext } from './CrateHunt'
import CrateHunt, { type CrateHuntHandle } from './CrateHunt'
import WeaponCrateOpener from './WeaponCrateOpener'
import WeaponGalleryImage from './WeaponGalleryImage'
import { StatefulButton } from './ui/stateful-button'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import { pickRandomWeaponRender } from '../lib/weaponRenderImages'
import type { Rarity } from '../data/types'
import { WILDS_BACKDROP_OVERLAY } from '../lib/wildsTheme'
import { motion } from 'motion/react'

const MAX_PLAYERS = 4

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Weapon Type',
  tempered: 'Weapon Type',
  'arch-tempered': 'Weapon Type',
}

type CoopWeaponPanelProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
  onCoopModeChange?: (coopMode: boolean) => void
}

function GalleryBackdropOverlay({
  revealed,
  emphasized,
}: {
  revealed: boolean
  emphasized: boolean
}) {
  const opacity = !revealed ? 1 : emphasized ? 1 : 0.45

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-[1] ${WILDS_BACKDROP_OVERLAY}`}
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    />
  )
}

function PlayerCountControls({
  playerCount,
  onChange,
}: {
  playerCount: number
  onChange: (count: number) => void
}) {
  return (
    <div className="mb-4 flex w-full max-w-[620px] items-center justify-center gap-3">
      <button
        type="button"
        aria-label="Remove player"
        disabled={playerCount <= 1}
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
        disabled={playerCount >= MAX_PLAYERS}
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
  const [playerCount, setPlayerCount] = useState(1)
  const [activePlayerIndex, setActivePlayerIndex] = useState(0)
  const [huntContext, setHuntContext] = useState<CrateHuntContext>({
    result: null,
    questType: null,
    huntStar: null,
    phase: 'idle',
    spinnerUiVisible: true,
  })
  const [weaponRender, setWeaponRender] = useState<{ name: string; url: string } | null>(null)
  const crateRef = useRef<CrateHuntHandle>(null)
  const prevPhaseRef = useRef<CrateHuntContext['phase']>('idle')

  const coopMode = playerCount > 1
  const useMonsterWeapons = playerCount >= 3
  const overlayMode = !isMobile
  const spinning = huntContext.phase === 'spinning'
  const galleryEmphasized = huntContext.phase === 'revealed' && huntContext.spinnerUiVisible

  useEffect(() => {
    onCoopModeChange?.(coopMode)
  }, [coopMode, onCoopModeChange])

  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayerCount(count)
    setActivePlayerIndex(0)
    setWeaponRender(null)
  }, [])

  const handleHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setHuntContext(ctx)

      if (ctx.phase === 'revealed' && ctx.result && useMonsterWeapons) {
        const render = pickRandomWeaponRender(ctx.result.slug)
        setWeaponRender(render ? { name: render.name, url: render.url } : null)
      }

      if (!coopMode) {
        onHuntChange?.(ctx)
      }
    },
    [coopMode, onHuntChange, useMonsterWeapons],
  )

  useEffect(() => {
    if (prevPhaseRef.current === 'spinning' && huntContext.phase === 'revealed') {
      setActivePlayerIndex((index) => (index + 1) % playerCount)
    }
    prevPhaseRef.current = huntContext.phase
  }, [huntContext.phase, playerCount])

  useEffect(() => {
    setActivePlayerIndex(0)
    setWeaponRender(null)
  }, [playerCount])

  const handlePlayerDraw = useCallback(
    async (playerIndex: number) => {
      if (playerIndex !== activePlayerIndex || spinning) return
      await crateRef.current?.startSpin()
    },
    [activePlayerIndex, spinning],
  )

  const galleryImageUrl = useMonsterWeapons ? weaponRender?.url : null
  const revealName = useMonsterWeapons ? weaponRender?.name : null

  if (!coopMode) {
    return (
      <div className="flex w-full flex-col items-center">
        <PlayerCountControls playerCount={playerCount} onChange={handlePlayerCountChange} />
        <WeaponCrateOpener onHuntChange={handleHuntChange} />
      </div>
    )
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center">
      {!isMobile ? (
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
          <WeaponGalleryImage
            result={huntContext.result}
            visible={huntContext.phase === 'revealed'}
            emphasized={galleryEmphasized}
            variant="backdrop"
            imageUrl={galleryImageUrl}
            fillSection
          />
          <GalleryBackdropOverlay
            revealed={huntContext.phase === 'revealed'}
            emphasized={galleryEmphasized}
          />
        </div>
      ) : null}

      <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center">
        <PlayerCountControls playerCount={playerCount} onChange={handlePlayerCountChange} />

        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
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
            onHuntChange={handleHuntChange}
            belowReel={
              isMobile
                ? ({ result, phase }) => (
                    <WeaponGalleryImage
                      result={result}
                      visible={phase === 'revealed'}
                      emphasized={false}
                      imageUrl={galleryImageUrl}
                      fillSection
                      wikiSource={useMonsterWeapons}
                    />
                  )
                : undefined
            }
          />
        </div>

        <div
          className={`mt-3 grid w-full max-w-[620px] gap-2 ${
            playerCount <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {Array.from({ length: playerCount }, (_, index) => {
            const isActive = index === activePlayerIndex
            const disabled = spinning || !isActive

            return (
              <StatefulButton
                key={index}
                layoutId={`coop-player-${index}-draw`}
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

        {spinning ? (
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.16em] text-wilds-muted">
            Player {activePlayerIndex + 1}&apos;s turn — drawing…
          </p>
        ) : (
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.16em] text-wilds-gold-light/80">
            Player {activePlayerIndex + 1}&apos;s turn
          </p>
        )}
      </div>
    </div>
  )
}

export default CoopWeaponPanel
