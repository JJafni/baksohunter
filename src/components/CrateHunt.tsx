import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { CrateEntry, Rarity } from '../data/types'
import { getVisualRarity, RARITY_BACKGROUND_GLOW, type VisualRarity } from '../lib/rarityColors'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
  CENTER_INDEX,
  MOBILE_REEL_HEIGHT,
  HUNT_COLUMN_MAX_WIDTH,
  OPEN_MS,
  REEL_LENGTH,
  REEL_WIDTH,
  REVEAL_UI_FADE_DELAY_MS,
  VIEWPORT_HEIGHT,
} from '../lib/crateConfig'
import { buildReelSequence } from '../lib/reelSequence'
import Reel from './Reel'
import RevealPanel from './RevealPanel'
import IdleCrate from './IdleCrate'
import { StatefulButton } from './ui/stateful-button'

type Phase = 'idle' | 'spinning' | 'revealed'

export type CrateHuntContext = {
  result: CrateEntry | null
  phase: Phase
  /** False after post-reveal fade; true while idle, spinning, or before fade completes. */
  spinnerUiVisible: boolean
}

type CrateHuntProps = {
  heading: string
  subtitle: string
  poolCountLabel: string
  buttonLayoutId: string
  buttonLabels: { open: string; again: string }
  rarityLabels: Record<Rarity, string>
  pool: CrateEntry[]
  pickRandom: () => CrateEntry
  /** Which side the reel column (title, spinner, button) sits on. */
  reelSide: 'left' | 'right'
  /** Optional controls shown beside the reel (e.g. monster rarity filters). */
  filters?: (ctx: { disabled: boolean; layout: 'sidebar' | 'bar' }) => ReactNode
  /** Random labels shown on the button while spinning. Omit for a static label. */
  spinLabels?: string[]
  buttonIcon?: 'sword' | 'shield'
  reelOrientation?: 'horizontal' | 'vertical'
  belowReel?: (ctx: CrateHuntContext) => ReactNode
  /** When true, gallery is rendered elsewhere (desktop left panel). */
  externalGallery?: boolean
  /** When true, hunt UI overlays a backdrop image panel. */
  overlayMode?: boolean
  onHuntChange?: (ctx: CrateHuntContext) => void
}

/** Shared row heights so monster and weapon columns line up horizontally. */
const HEADER_ROW_H = '6rem'
const FOOTER_ROW_H = '2.75rem'
/** Fixed mobile reveal row — keeps filters/button from jumping when the name appears. */
const MOBILE_REVEAL_ROW_H = '4.75rem'

const SPINNER_UI_FADE = { duration: 0.7, ease: 'easeInOut' as const }

function SpinnerUiFade({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={SPINNER_UI_FADE}
      className={`w-full ${visible ? '' : 'pointer-events-none'}`}
    >
      {children}
    </motion.div>
  )
}

function CrateHunt({
  heading,
  subtitle,
  poolCountLabel,
  buttonLayoutId,
  buttonLabels,
  rarityLabels,
  pool,
  pickRandom,
  reelSide,
  filters,
  spinLabels,
  buttonIcon = 'sword',
  reelOrientation = 'horizontal',
  belowReel,
  externalGallery = false,
  overlayMode = false,
  onHuntChange,
}: CrateHuntProps) {
  const isMobile = useIsMobileLayout()
  const useStackedLayout = isMobile || reelOrientation === 'horizontal'
  const spinnerFadeEnabled = !isMobile
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<CrateEntry | null>(null)
  const [sequence, setSequence] = useState<CrateEntry[]>([])
  const [spinKey, setSpinKey] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [spinnerUiVisible, setSpinnerUiVisible] = useState(true)
  const spinResolverRef = useRef<(() => void) | null>(null)
  const spinnerFadeTimerRef = useRef<number | null>(null)

  const clearSpinnerFadeTimer = useCallback(() => {
    if (spinnerFadeTimerRef.current !== null) {
      window.clearTimeout(spinnerFadeTimerRef.current)
      spinnerFadeTimerRef.current = null
    }
  }, [])

  const startHunt = useCallback(async () => {
    if (phase === 'spinning' || pool.length === 0) return

    clearSpinnerFadeTimer()
    setSpinnerUiVisible(true)

    const target = pickRandom()
    setResult(target)
    setSequence(buildReelSequence(pool, target, REEL_LENGTH, CENTER_INDEX))

    if (phase === 'idle') {
      setIsEntering(true)
    }

    setPhase('spinning')
    setSpinKey((k) => k + 1)

    await new Promise<void>((resolve) => {
      spinResolverRef.current = resolve
    })
  }, [phase, pickRandom, pool, clearSpinnerFadeTimer])

  useEffect(() => {
    if (!isEntering) return

    const timer = window.setTimeout(() => setIsEntering(false), OPEN_MS)
    return () => window.clearTimeout(timer)
  }, [isEntering])

  const handleLanded = useCallback(() => {
    setPhase('revealed')
    spinResolverRef.current?.()
    spinResolverRef.current = null
  }, [])

  useEffect(() => {
    if (phase === 'idle') {
      clearSpinnerFadeTimer()
      setSpinnerUiVisible(true)
      return
    }

    if (phase !== 'revealed') {
      clearSpinnerFadeTimer()
      return
    }

    setSpinnerUiVisible(true)
    if (!spinnerFadeEnabled) return

    spinnerFadeTimerRef.current = window.setTimeout(() => {
      setSpinnerUiVisible(false)
      spinnerFadeTimerRef.current = null
    }, REVEAL_UI_FADE_DELAY_MS)

    return clearSpinnerFadeTimer
  }, [phase, spinKey, clearSpinnerFadeTimer, spinnerFadeEnabled])

  const showSpinnerUi = spinnerFadeEnabled ? spinnerUiVisible : true

  useEffect(() => {
    onHuntChange?.({ result, phase, spinnerUiVisible })
  }, [result, phase, spinnerUiVisible, onHuntChange])

  const visualRarity: VisualRarity = result ? getVisualRarity(result) : 'normal'
  const backgroundGlow = RARITY_BACKGROUND_GLOW

  const buttonLabel = phase === 'revealed' ? buttonLabels.again : buttonLabels.open
  const canSpin = pool.length > 0
  const hasFilters = Boolean(filters)
  const reelOnLeft = reelSide === 'left'
  const filterColClass = reelOnLeft ? 'col-start-1' : 'col-start-3'
  const reelColClass = hasFilters ? 'col-start-2' : reelOnLeft ? 'col-start-1' : 'col-start-2'
  const nameColClass = hasFilters
    ? reelOnLeft
      ? 'col-start-3'
      : 'col-start-1'
    : reelOnLeft
      ? 'col-start-2'
      : 'col-start-1'

  const blockWidth = useStackedLayout ? '100%' : REEL_WIDTH
  const reelSlotHeight = useStackedLayout ? MOBILE_REEL_HEIGHT : VIEWPORT_HEIGHT
  const stretchClass = isEntering
    ? useStackedLayout
      ? 'animate-hunt-reel-stretch-x'
      : 'animate-hunt-reel-stretch-y'
    : ''

  const header = (
    <div
      className={`flex flex-col items-center text-center ${useStackedLayout ? 'gap-1' : 'justify-end pb-1'} ${isEntering ? 'animate-hunt-side-enter' : ''}`}
      style={{ width: blockWidth, minHeight: useStackedLayout ? undefined : HEADER_ROW_H }}
    >
      <p
        className={`select-none font-black uppercase leading-none tracking-tight text-wilds-muted/50 ${
          useStackedLayout ? 'text-2xl' : 'text-3xl sm:text-4xl'
        }`}
      >
        {heading}
      </p>
      <p
        className={`w-max max-w-none whitespace-nowrap font-bold uppercase tracking-[0.15em] text-wilds-parchment ${
          useStackedLayout ? 'text-base' : 'mt-2 text-lg sm:text-xl'
        }`}
      >
        {subtitle}
      </p>
    </div>
  )

  const poolLine = (
    <p
      className={`mt-3 flex items-center justify-center whitespace-nowrap text-center uppercase tracking-[0.18em] text-wilds-muted ${
        useStackedLayout ? 'px-2 text-[10px]' : 'text-[10px] sm:text-xs'
      }`}
      style={{ minHeight: FOOTER_ROW_H }}
    >
      {poolCountLabel}
    </p>
  )

  const huntContextForRender: CrateHuntContext = { result, phase, spinnerUiVisible }
  const belowReelSlot = externalGallery ? null : belowReel?.(huntContextForRender) ?? null

  const filtersDisabled = phase === 'spinning'
  const filterLayout = useStackedLayout ? 'bar' : 'sidebar'
  const filtersSlot = filters ? (
    <div className={useStackedLayout ? 'w-full' : 'self-center'}>
      {filters({ disabled: filtersDisabled, layout: filterLayout })}
    </div>
  ) : null

  const actions = (
    <div className={`flex flex-col items-center ${useStackedLayout ? 'pt-2' : 'pt-6'}`} style={{ width: blockWidth }}>
      <StatefulButton
        layoutId={buttonLayoutId}
        loadingLabels={spinLabels}
        icon={buttonIcon}
        onClick={startHunt}
        disabled={phase === 'spinning' || !canSpin}
      >
        {buttonLabel}
      </StatefulButton>
      {poolLine}
    </div>
  )

  const namePanel = (
    <RevealPanel
      result={result}
      visible={phase === 'revealed'}
      rarityLabels={rarityLabels}
      align={useStackedLayout ? 'center' : reelSide === 'left' ? 'right' : 'left'}
      variant={useStackedLayout ? 'mobile' : 'desktop'}
    />
  )

  const mobileRevealSlot = !useStackedLayout ? null : isMobile ? (
    <motion.div
      className="flex w-full shrink-0 items-center justify-center overflow-hidden"
      initial={false}
      animate={{ height: phase === 'idle' ? 0 : MOBILE_REVEAL_ROW_H }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {phase !== 'idle' ? namePanel : null}
    </motion.div>
  ) : phase !== 'idle' ? (
      <motion.div
        layout
        className="w-full transition-[grid-template-rows] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ display: 'grid', gridTemplateRows: phase === 'revealed' ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">{namePanel}</div>
      </motion.div>
    ) : null

  const columnMaxWidth = HUNT_COLUMN_MAX_WIDTH

  const reelSlot =
    phase === 'idle' ? (
      <div
        className="flex w-full items-center justify-center"
        style={{ width: blockWidth, maxWidth: columnMaxWidth, height: reelSlotHeight }}
      >
        <IdleCrate orientation={reelOrientation} />
      </div>
    ) : (
      <div className="w-full" style={{ width: blockWidth, maxWidth: columnMaxWidth }}>
        <div className={stretchClass}>
          <Reel
            key={`${spinKey}-${reelOrientation}`}
            sequence={sequence}
            onDone={handleLanded}
            landed={phase === 'revealed'}
            rarity={visualRarity}
            orientation={reelOrientation}
          />
        </div>
      </div>
    )

  const nameSlot =
    phase === 'idle' ? (
      useStackedLayout ? null : (
        <div className="w-[150px] shrink-0 sm:w-[185px]" aria-hidden="true" />
      )
    ) : (
      namePanel
    )

  if (useStackedLayout) {
    return (
      <div
        className={`relative mx-auto w-full shrink-0 ${overlayMode ? 'flex h-full flex-col' : ''}`}
        style={{ maxWidth: HUNT_COLUMN_MAX_WIDTH }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
          style={{
            opacity: phase === 'revealed' && !overlayMode ? 1 : 0,
            background: backgroundGlow[visualRarity],
          }}
        />

        <div
          className={`flex w-full flex-col items-center ${overlayMode ? 'h-full min-h-0 gap-3 py-2' : 'gap-4 lg:gap-3'}`}
        >
          <SpinnerUiFade visible={showSpinnerUi}>
            {header}
            <div className="w-full shrink-0">{reelSlot}</div>
          </SpinnerUiFade>
          {!externalGallery && belowReelSlot ? <div className="w-full">{belowReelSlot}</div> : null}
          <div className={`flex w-full flex-col items-center gap-2 ${overlayMode ? 'mt-auto' : ''}`}>
            {mobileRevealSlot}
            {hasFilters ? filtersSlot : null}
            {actions}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-fit max-w-full shrink-0">
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          background: backgroundGlow[visualRarity],
        }}
      />

      <div
        className="grid gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6"
        style={{
          gridTemplateColumns: hasFilters
            ? reelOnLeft
              ? `auto ${REEL_WIDTH}px auto`
              : `auto ${REEL_WIDTH}px auto`
            : reelOnLeft
              ? `${REEL_WIDTH}px auto`
              : `auto ${REEL_WIDTH}px`,
          gridTemplateRows: `${HEADER_ROW_H} auto auto`,
        }}
      >
        <div className={`${reelColClass} row-start-1 flex justify-center overflow-visible`}>
          <SpinnerUiFade visible={showSpinnerUi}>{header}</SpinnerUiFade>
        </div>

        {hasFilters ? (
          <div className={`${filterColClass} row-start-2 self-center`}>{filtersSlot}</div>
        ) : null}

        <div className={`${reelColClass} row-start-2`}>
          <SpinnerUiFade visible={showSpinnerUi}>{reelSlot}</SpinnerUiFade>
        </div>

        <div className={`${nameColClass} row-start-2 self-center`}>{nameSlot}</div>

        <div className={`${reelColClass} row-start-3`}>{actions}</div>
      </div>
    </div>
  )
}

export default CrateHunt
