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

const MAX_PLAYERS = 4

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Weapon Type',
  tempered: 'Weapon Type',
  'arch-tempered': 'Weapon Type',
}

type CoopWeaponPanelProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
  onCoopModeChange?: (coopMode: boolean) => void
  /** Reports the current wiki render URL (null = use standard weapon image). */
  onGalleryChange?: (imageUrl: string | null) => void
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
    <div className="mb-4 flex w-full max-w-[620px] items-center justify-center gap-3">
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

function CoopWeaponPanel({ onHuntChange, onCoopModeChange, onGalleryChange }: CoopWeaponPanelProps) {
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
  const galleryImageUrl = useMonsterWeapons ? (weaponRender?.url ?? null) : null
  const revealName = useMonsterWeapons ? (weaponRender?.name ?? null) : null

  useEffect(() => {
    onCoopModeChange?.(coopMode)
  }, [coopMode, onCoopModeChange])

  useEffect(() => {
    onGalleryChange?.(galleryImageUrl ?? null)
  }, [galleryImageUrl, onGalleryChange])

  const handlePlayerCountChange = useCallback(
    (count: number) => {
      setPlayerCount(count)
      setActivePlayerIndex(0)
      setWeaponRender(null)
      if (count < 3) {
        onGalleryChange?.(null)
      }
    },
    [onGalleryChange],
  )

  const handleHuntChange = useCallback(
    (ctx: CrateHuntContext) => {
      setHuntContext(ctx)

      if (ctx.phase === 'revealed' && ctx.result && useMonsterWeapons) {
        const render = pickRandomWeaponRender(ctx.result.slug)
        const url = render?.url ?? null
        setWeaponRender(render ? { name: render.name, url: render.url } : null)
        onGalleryChange?.(url)
      } else if (ctx.phase === 'idle' || ctx.phase === 'spinning') {
        if (useMonsterWeapons) {
          onGalleryChange?.(null)
        }
      }

      // Always propagate to App so the App-level backdrop & phase state work
      onHuntChange?.(ctx)
    },
    [onHuntChange, onGalleryChange, useMonsterWeapons],
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
      setWeaponRender(null)
      onGalleryChange?.(null)
      await crateRef.current?.startSpin()
    },
    [activePlayerIndex, spinning, onGalleryChange],
  )

  if (!coopMode) {
    return (
      <div className="flex w-full flex-col items-center">
        <PlayerCountControls playerCount={playerCount} onChange={handlePlayerCountChange} />
        <WeaponCrateOpener onHuntChange={handleHuntChange} />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center">
      <PlayerCountControls
        playerCount={playerCount}
        onChange={handlePlayerCountChange}
        disabled={spinning}
      />

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
                    wikiSource={useMonsterWeapons && galleryImageUrl !== null}
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
  )
}

export default CoopWeaponPanel
