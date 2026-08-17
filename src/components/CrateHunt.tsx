import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import type { QuestType } from '../data/questTypes'
import type { CrateEntry, Rarity } from '../data/types'
import { getVisualRarity, RARITY_BACKGROUND_GLOW, type VisualRarity } from '../lib/rarityColors'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
  CENTER_INDEX,
  HUNT_COLUMN_MAX_WIDTH,
  OPEN_MS,
  REEL_LENGTH,
  REEL_WIDTH,
  REVEAL_UI_FADE_DELAY_MS,
} from '../lib/crateConfig'
import { buildReelSequence } from '../lib/reelSequence'
import Reel from './Reel'
import RevealPanel from './RevealPanel'
import QuestTypeBadge from './QuestTypeBadge'
import { StatefulButton } from './ui/stateful-button'

type Phase = 'idle' | 'spinning' | 'revealed'

export type CrateHuntContext = {
  result: CrateEntry | null
  /** Random capture / slay / hunt objective; null for weapon hunts. */
  questType: QuestType | null
  phase: Phase
  /** False after post-reveal fade; true while idle, spinning, or before fade completes. */
  spinnerUiVisible: boolean
}

type CrateHuntProps = {
  poolCountLabel: string
  buttonLayoutId: string
  buttonLabels: { open: string; again: string }
  rarityLabels: Record<Rarity, string>
  pool: CrateEntry[]
  pickRandom: () => CrateEntry
  /** When set, a quest objective is chosen on each spin based on the result. */
  pickRandomQuestType?: (entry: CrateEntry) => QuestType
  /** When false, quest objectives are disabled and any active badge is cleared. */
  questTypeEnabled?: boolean
  /** Which side the reel column (title, spinner, button) sits on. */
  reelSide: 'left' | 'right'
  /** Optional controls shown beside the reel (e.g. monster rarity filters). */
  filters?: (ctx: { disabled: boolean; layout: 'sidebar' | 'bar' }) => ReactNode
  /** Random labels shown on the button while spinning. Omit for a static label. */
  spinLabels?: string[]
  buttonIcon?: 'sword' | 'shield'
  /** Hunt = sandblasted matte; Draw = grey shiny gradient. */
  buttonSurface?: 'matte' | 'shiny'
  reelOrientation?: 'horizontal' | 'vertical'
  belowReel?: (ctx: CrateHuntContext) => ReactNode
  /** When true, gallery is rendered elsewhere (desktop left panel). */
  externalGallery?: boolean
  /** When true, show monster info button on reveal (monster hunts only). */
  showMonsterInfo?: boolean
  /** When true, hunt UI overlays a backdrop image panel. */
  overlayMode?: boolean
  onHuntChange?: (ctx: CrateHuntContext) => void
}

/** Shared row heights so monster and weapon columns line up horizontally. */
const FOOTER_ROW_H = '2.75rem'
/** Fixed mobile reveal row — keeps filters/button from jumping when the name appears. */
const MOBILE_REVEAL_ROW_H = '4.75rem'

const SPINNER_UI_FADE = { duration: 0.7, ease: 'easeInOut' as const }
const FILTERS_FADE = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
const CONTROLS_LAYOUT = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

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
  poolCountLabel,
  buttonLayoutId,
  buttonLabels,
  rarityLabels,
  pool,
  pickRandom,
  pickRandomQuestType,
  questTypeEnabled = true,
  reelSide,
  filters,
  spinLabels,
  buttonIcon = 'sword',
  buttonSurface = 'matte',
  reelOrientation = 'horizontal',
  belowReel,
  externalGallery = false,
  showMonsterInfo = false,
  overlayMode = false,
  onHuntChange,
}: CrateHuntProps) {
  const isMobile = useIsMobileLayout()
  const useStackedLayout = isMobile || reelOrientation === 'horizontal'
  const spinnerFadeEnabled = !isMobile
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<CrateEntry | null>(null)
  const [questType, setQuestType] = useState<QuestType | null>(null)
  const [sequence, setSequence] = useState<CrateEntry[]>([])
  const [spinKey, setSpinKey] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [spinnerUiVisible, setSpinnerUiVisible] = useState(true)
  const [filtersRevealed, setFiltersRevealed] = useState(false)
  const spinResolverRef = useRef<(() => void) | null>(null)
  const spinnerFadeTimerRef = useRef<number | null>(null)
  const filtersRevealTimerRef = useRef<number | null>(null)
  const filtersRevealPendingRef = useRef(false)

  const clearSpinnerFadeTimer = useCallback(() => {
    if (spinnerFadeTimerRef.current !== null) {
      window.clearTimeout(spinnerFadeTimerRef.current)
      spinnerFadeTimerRef.current = null
    }
  }, [])

  const clearFiltersRevealTimer = useCallback(() => {
    if (filtersRevealTimerRef.current !== null) {
      window.clearTimeout(filtersRevealTimerRef.current)
      filtersRevealTimerRef.current = null
    }
  }, [])

  const revealFilters = useCallback(() => {
    if (!filtersRevealPendingRef.current) return
    filtersRevealPendingRef.current = false
    clearFiltersRevealTimer()
    setFiltersRevealed(true)
  }, [clearFiltersRevealTimer])

  const startHunt = useCallback(async () => {
    if (phase === 'spinning' || pool.length === 0) return

    clearSpinnerFadeTimer()
    setSpinnerUiVisible(true)

    const target = pickRandom()
    const nextQuestType =
      questTypeEnabled && pickRandomQuestType ? pickRandomQuestType(target) : null
    setPhase('spinning')
    setSpinKey((k) => k + 1)
    setResult(target)
    setQuestType(nextQuestType)
    setSequence(buildReelSequence(pool, target, REEL_LENGTH, CENTER_INDEX))

    if (phase === 'idle') {
      setIsEntering(true)
    }

    await new Promise<void>((resolve) => {
      spinResolverRef.current = resolve
    })
  }, [phase, pickRandom, pickRandomQuestType, questTypeEnabled, pool, clearSpinnerFadeTimer])

  useEffect(() => {
    if (!questTypeEnabled) setQuestType(null)
  }, [questTypeEnabled])

  useEffect(() => {
    if (phase === 'idle') {
      clearFiltersRevealTimer()
      filtersRevealPendingRef.current = false
      setFiltersRevealed(false)
      return
    }

    if (filtersRevealed) return

    filtersRevealPendingRef.current = true
    clearFiltersRevealTimer()
    filtersRevealTimerRef.current = window.setTimeout(revealFilters, OPEN_MS)

    return clearFiltersRevealTimer
  }, [phase, spinKey, filtersRevealed, clearFiltersRevealTimer, revealFilters])

  const handleControlsLayoutComplete = useCallback(() => {
    if (phase === 'idle' || filtersRevealed) return
    revealFilters()
  }, [phase, filtersRevealed, revealFilters])

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
    onHuntChange?.({ result, questType, phase, spinnerUiVisible })
  }, [result, questType, phase, spinnerUiVisible, onHuntChange])

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
  const stretchClass = isEntering
    ? useStackedLayout
      ? 'animate-hunt-reel-stretch-x'
      : 'animate-hunt-reel-stretch-y'
    : ''

  const actionsPadding =
    phase === 'idle' ? 'pt-0' : useStackedLayout ? 'pt-2' : 'pt-4'

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

  const huntContextForRender: CrateHuntContext = { result, questType, phase, spinnerUiVisible }
  const belowReelSlot = externalGallery ? null : belowReel?.(huntContextForRender) ?? null

  const filtersDisabled = phase === 'spinning'
  const filterLayout = useStackedLayout ? 'bar' : 'sidebar'
  const filtersWithFade = filters && filtersRevealed ? (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={FILTERS_FADE}
      className={useStackedLayout ? 'w-full' : 'self-center'}
    >
      {filters({ disabled: filtersDisabled, layout: filterLayout })}
    </motion.div>
  ) : null

  const actions = (
    <div className={`flex flex-col items-center ${actionsPadding}`} style={{ width: blockWidth }}>
      <StatefulButton
        layoutId={buttonLayoutId}
        loadingLabels={spinLabels}
        icon={buttonIcon}
        surface={buttonSurface}
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
      revealKey={spinKey}
      rarityLabels={rarityLabels}
      align={useStackedLayout ? 'center' : reelSide === 'left' ? 'right' : 'left'}
      variant={useStackedLayout ? 'mobile' : 'desktop'}
      showMonsterInfo={showMonsterInfo}
    />
  )

  const questTypeBadge =
    questTypeEnabled && pickRandomQuestType ? (
      <QuestTypeBadge questType={questType} visible={phase === 'revealed'} revealKey={spinKey} />
    ) : null

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
    phase === 'idle' ? null : (
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full ${stretchClass}`}
        style={{ width: blockWidth, maxWidth: columnMaxWidth }}
      >
        <Reel
          key={`${spinKey}-${reelOrientation}`}
          sequence={sequence}
          onDone={handleLanded}
          landed={phase === 'revealed'}
          rarity={visualRarity}
          orientation={reelOrientation}
        />
      </motion.div>
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
        style={{ maxWidth: overlayMode ? undefined : HUNT_COLUMN_MAX_WIDTH }}
      >
        {questTypeBadge}
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
          style={{
            opacity: phase === 'revealed' && !overlayMode ? 1 : 0,
            background: backgroundGlow[visualRarity],
          }}
        />

        <motion.div
          layout
          transition={{ layout: CONTROLS_LAYOUT }}
          className={`flex w-full flex-col items-center ${
            overlayMode
              ? `mx-auto h-full min-h-0 gap-3 py-2 ${phase === 'idle' ? 'justify-center' : ''}`
              : 'gap-4 lg:gap-3'
          }`}
          style={overlayMode ? { maxWidth: HUNT_COLUMN_MAX_WIDTH } : undefined}
        >
          <SpinnerUiFade visible={showSpinnerUi}>
            {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
          </SpinnerUiFade>
          {!externalGallery && belowReelSlot ? <div className="w-full">{belowReelSlot}</div> : null}
          <motion.div
            layout
            transition={{ layout: CONTROLS_LAYOUT }}
            onLayoutAnimationComplete={handleControlsLayoutComplete}
            className={`flex w-full flex-col items-center gap-2 ${
              overlayMode && phase !== 'idle' ? 'mt-auto' : ''
            }`}
          >
            {mobileRevealSlot}
            {filtersWithFade}
            {actions}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-full shrink-0">
      {questTypeBadge}
      <div className="relative mx-auto w-fit max-w-full">
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
          gridTemplateRows: 'auto auto',
        }}
      >
        {filtersWithFade ? (
          <div className={`${filterColClass} row-start-1 self-center`}>{filtersWithFade}</div>
        ) : null}

        <div className={`${reelColClass} row-start-1`}>
          <SpinnerUiFade visible={showSpinnerUi}>{reelSlot}</SpinnerUiFade>
        </div>

        <div className={`${nameColClass} row-start-1 self-center`}>{nameSlot}</div>

        <div className={`${reelColClass} row-start-2`}>{actions}</div>
      </div>
      </div>
    </div>
  )
}

export default CrateHunt
