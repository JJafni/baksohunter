import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'
import type { QuestType } from '../data/questTypes'
import type { HuntStar } from '../data/huntStars'
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
import { StatefulButton } from './ui/stateful-button'

type Phase = 'idle' | 'spinning' | 'revealed'

export type CrateHuntContext = {
  result: CrateEntry | null
  /** Random capture / slay / hunt objective; null for weapon hunts. */
  questType: QuestType | null
  /** Random investigation star rating; null for weapon hunts or when disabled. */
  huntStar: HuntStar | null
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
  /** When set, a star rating is chosen on each spin based on the result. */
  pickRandomHuntStar?: (entry: CrateEntry) => HuntStar
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
  /** Inline name + subtitle on reveal (weapon column). */
  revealLayout?: 'stacked' | 'inline'
  /** Optional button beside the primary action (1/4 width). */
  companionButton?: (ctx: { disabled: boolean }) => ReactNode
  /** Hide the built-in DRAW button (co-op uses external player buttons). */
  hidePrimaryButton?: boolean
  /** Override the revealed entry name (e.g. specific monster weapon). */
  nameOverride?: string | null
  /** Restore a previous hunt session (e.g. solo after co-op). */
  initialContext?: CrateHuntContext | null
  /** Center the overlay spinner in the column (weapon desktop). */
  overlaySpinnerCentered?: boolean
  /** Fade the reveal name in only after the post-reveal spinner fade (weapon desktop). */
  revealNameAfterSpinnerFade?: boolean
  onHuntChange?: (ctx: CrateHuntContext) => void
}

export type CrateHuntHandle = {
  startSpin: () => Promise<void>
}

/** Shared row heights so monster and weapon columns line up horizontally. */
const FOOTER_ROW_H = '2.75rem'
/** Fixed mobile reveal row — keeps filters/button from jumping when the name appears. */
const MOBILE_REVEAL_ROW_H = '4.25rem'
/** Bottom filter row above spin buttons — both columns reserve this height. */
const SPINNER_UI_FADE = { duration: 0.7, ease: 'easeInOut' as const }
const SPINNER_UI_FADE_MS = SPINNER_UI_FADE.duration * 1000
const OPEN_TRANSITION = { duration: OPEN_MS / 1000, ease: [0.22, 1, 0.36, 1] as const }

function SpinnerUiFade({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={SPINNER_UI_FADE}
      className={`w-full shrink-0 ${visible ? '' : 'pointer-events-none'}`}
    >
      {children}
    </motion.div>
  )
}

function SpinnerLayoutSlot({
  holdLayout,
  children,
}: {
  holdLayout: boolean
  children: ReactNode
}) {
  return (
    <div
      className="grid w-full overflow-hidden"
      style={{
        gridTemplateRows: holdLayout ? '1fr' : '0fr',
        transitionProperty: 'grid-template-rows',
        transitionDuration: holdLayout ? '300ms' : '0ms',
        transitionTimingFunction: 'ease-in-out',
      }}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

const CrateHunt = forwardRef<CrateHuntHandle, CrateHuntProps>(function CrateHunt(
  {
    poolCountLabel,
    buttonLayoutId,
    buttonLabels,
    rarityLabels,
    pool,
    pickRandom,
    pickRandomQuestType,
    pickRandomHuntStar,
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
    revealLayout = 'stacked',
    companionButton,
    hidePrimaryButton = false,
    nameOverride = null,
    initialContext = null,
    overlaySpinnerCentered = false,
    revealNameAfterSpinnerFade = false,
    onHuntChange,
  },
  ref,
) {
  const isMobile = useIsMobileLayout()
  const useStackedLayout = isMobile || reelOrientation === 'horizontal'
  const spinnerFadeEnabled = !isMobile
  const isRestoredReveal = initialContext?.phase === 'revealed'
  const restoredRevealRef = useRef(isRestoredReveal)
  /** Restored hunts show the result statically — skip mounting Reel until the next draw. */
  const skipReelMountRef = useRef(isRestoredReveal)
  const [phase, setPhase] = useState<Phase>(() => initialContext?.phase ?? 'idle')
  const [result, setResult] = useState<CrateEntry | null>(() => initialContext?.result ?? null)
  const [questType, setQuestType] = useState<QuestType | null>(() => initialContext?.questType ?? null)
  const [huntStar, setHuntStar] = useState<HuntStar | null>(() => initialContext?.huntStar ?? null)
  const [sequence, setSequence] = useState<CrateEntry[]>(() => {
    if (initialContext?.phase === 'revealed' && initialContext.result) {
      return buildReelSequence(pool, initialContext.result, REEL_LENGTH, CENTER_INDEX)
    }
    return []
  })
  const [spinKey, setSpinKey] = useState(() => (initialContext?.phase === 'revealed' ? 1 : 0))
  const [isEntering, setIsEntering] = useState(false)
  const [spinnerUiVisible, setSpinnerUiVisible] = useState(
    () => (isRestoredReveal ? false : (initialContext?.spinnerUiVisible ?? true)),
  )
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

    skipReelMountRef.current = false
    clearSpinnerFadeTimer()
    setSpinnerUiVisible(true)

    const target = pickRandom()
    const nextQuestType =
      questTypeEnabled && pickRandomQuestType ? pickRandomQuestType(target) : null
    const nextHuntStar = pickRandomHuntStar ? pickRandomHuntStar(target) : null
    setPhase('spinning')
    setSpinKey((k) => k + 1)
    setResult(target)
    setQuestType(nextQuestType)
    setHuntStar(nextHuntStar)
    setSequence(buildReelSequence(pool, target, REEL_LENGTH, CENTER_INDEX))

    if (phase === 'idle') {
      setIsEntering(true)
    }

    await new Promise<void>((resolve) => {
      spinResolverRef.current = resolve
    })
  }, [phase, pickRandom, pickRandomQuestType, pickRandomHuntStar, questTypeEnabled, pool, clearSpinnerFadeTimer])

  useImperativeHandle(ref, () => ({ startSpin: startHunt }), [startHunt])

  useEffect(() => {
    if (!questTypeEnabled) setQuestType(null)
  }, [questTypeEnabled])

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

    if (restoredRevealRef.current) {
      restoredRevealRef.current = false
      if (!spinnerFadeEnabled || !spinnerUiVisible) return

      spinnerFadeTimerRef.current = window.setTimeout(() => {
        setSpinnerUiVisible(false)
        spinnerFadeTimerRef.current = null
      }, REVEAL_UI_FADE_DELAY_MS)

      return clearSpinnerFadeTimer
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
  const showOverlayRevealName =
    phase === 'revealed' && (!revealNameAfterSpinnerFade || !showSpinnerUi)
  const [spinnerHoldLayout, setSpinnerHoldLayout] = useState(true)

  useEffect(() => {
    if (showSpinnerUi) {
      setSpinnerHoldLayout(true)
      return
    }

    const timer = window.setTimeout(() => setSpinnerHoldLayout(false), SPINNER_UI_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [showSpinnerUi])

  useEffect(() => {
    onHuntChange?.({ result, questType, huntStar, phase, spinnerUiVisible })
  }, [result, questType, huntStar, phase, spinnerUiVisible, onHuntChange])

  const visualRarity: VisualRarity = result ? getVisualRarity(result) : 'normal'
  const backgroundGlow = RARITY_BACKGROUND_GLOW

  const buttonLabel = phase === 'revealed' ? buttonLabels.again : buttonLabels.open
  const canSpin = pool.length > 0
  const reelOnLeft = reelSide === 'left'
  const reelColClass = reelOnLeft ? 'col-start-1' : 'col-start-2'
  const nameColClass = reelOnLeft ? 'col-start-2' : 'col-start-1'

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
      aria-hidden={!poolCountLabel}
      className={`mt-3 flex items-center justify-center whitespace-nowrap text-center uppercase tracking-[0.18em] text-wilds-muted ${
        useStackedLayout ? 'px-2 text-[10px]' : 'text-[10px] sm:text-xs'
      }`}
      style={{ minHeight: FOOTER_ROW_H }}
    >
      {poolCountLabel}
    </p>
  )

  const huntContextForRender: CrateHuntContext = { result, questType, huntStar, phase, spinnerUiVisible }
  const belowReelSlot = externalGallery ? null : belowReel?.(huntContextForRender) ?? null
  const columnMaxWidth = HUNT_COLUMN_MAX_WIDTH

  const filtersDisabled = phase === 'spinning'

  const filterRow = (
    <div className="mb-2 flex w-full items-center justify-center overflow-visible px-1 max-lg:min-h-[7.5rem] lg:min-h-[5.25rem]">
      {filters ? (
        <div className="mx-auto w-fit max-w-full">{filters({ disabled: filtersDisabled, layout: 'bar' })}</div>
      ) : null}
    </div>
  )

  const actions = (
    <div
      className={`mx-auto flex w-full flex-col items-center ${actionsPadding}`}
      style={{ maxWidth: columnMaxWidth }}
    >
      {filterRow}
      <div className="flex w-full gap-2">
        {companionButton ? (
          <div className="w-1/4 min-w-0 shrink-0">{companionButton({ disabled: filtersDisabled })}</div>
        ) : null}
        {hidePrimaryButton ? null : (
          <StatefulButton
            layoutId={buttonLayoutId}
            loadingLabels={spinLabels}
            icon={buttonIcon}
            surface={buttonSurface}
            onClick={startHunt}
            disabled={phase === 'spinning' || !canSpin}
            className={companionButton ? 'min-w-0 flex-[3]' : 'w-full'}
          >
            {buttonLabel}
          </StatefulButton>
        )}
      </div>
      {poolLine}
    </div>
  )

  const namePanel = (
    <RevealPanel
      result={result}
      visible={showOverlayRevealName}
      revealKey={spinKey}
      rarityLabels={rarityLabels}
      align={useStackedLayout ? 'center' : reelSide === 'left' ? 'right' : 'left'}
      variant={isMobile ? 'mobile' : 'desktop'}
      layout={revealLayout}
      showMonsterInfo={showMonsterInfo}
      huntStar={pickRandomHuntStar ? huntStar : null}
      questType={questTypeEnabled && pickRandomQuestType ? questType : null}
      questTypeVisible={phase === 'revealed'}
      nameOverride={nameOverride}
    />
  )

  const stackedRevealSlot = !useStackedLayout ? null : isMobile ? (
    <motion.div
      className="flex w-full shrink-0 items-center justify-center overflow-hidden"
      initial={false}
      animate={{ height: phase === 'idle' ? 0 : MOBILE_REVEAL_ROW_H }}
      transition={OPEN_TRANSITION}
    >
      {phase !== 'idle' ? namePanel : null}
    </motion.div>
  ) : phase !== 'idle' ? (
    revealNameAfterSpinnerFade ? (
      <motion.div
        className="w-full overflow-hidden"
        initial={false}
        animate={{ opacity: showOverlayRevealName ? 1 : 0 }}
        transition={SPINNER_UI_FADE}
        style={{
          display: 'grid',
          gridTemplateRows: showOverlayRevealName ? '1fr' : '0fr',
        }}
      >
        <div className="min-h-0 overflow-hidden">{phase === 'revealed' ? namePanel : null}</div>
      </motion.div>
    ) : (
      <div
        className="w-full transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ display: 'grid', gridTemplateRows: phase === 'revealed' ? 'auto' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">{namePanel}</div>
      </div>
    )
  ) : null

  const reelSlot =
    phase === 'idle' || sequence.length === 0 || skipReelMountRef.current ? null : (
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={OPEN_TRANSITION}
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
    const overlayControls = (
      <div
        className="mx-auto flex w-full flex-col items-center gap-3"
        style={{ maxWidth: columnMaxWidth }}
      >
        {stackedRevealSlot}
        {actions}
      </div>
    )

    return (
      <div
        className={`relative mx-auto w-full shrink-0 ${overlayMode ? 'flex h-full min-h-0 w-full flex-col' : ''}`}
        style={{ maxWidth: columnMaxWidth }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
          style={{
            opacity: phase === 'revealed' && !overlayMode ? 1 : 0,
            background: backgroundGlow[visualRarity],
          }}
        />

        {overlayMode ? (
          <div
            className="mx-auto grid h-full min-h-0 w-full gap-3 py-2 transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              maxWidth: columnMaxWidth,
              gridTemplateRows: 'minmax(0, 1fr) auto',
            }}
          >
            {phase === 'idle' ? (
              <div aria-hidden="true" />
            ) : (
              <div
                className={`flex min-h-0 flex-1 flex-col items-center overflow-hidden ${
                  overlaySpinnerCentered ? 'justify-center' : ''
                }`}
              >
                <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
                  <SpinnerUiFade visible={showSpinnerUi}>
                    {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
                  </SpinnerUiFade>
                </SpinnerLayoutSlot>
                {!externalGallery && belowReelSlot ? <div className="w-full">{belowReelSlot}</div> : null}
              </div>
            )}
            {overlayControls}
          </div>
        ) : (
          <div
            className="mx-auto flex w-full flex-col items-center gap-4 lg:gap-3"
            style={{ maxWidth: columnMaxWidth }}
          >
            <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
              <SpinnerUiFade visible={showSpinnerUi}>
                {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
              </SpinnerUiFade>
            </SpinnerLayoutSlot>
            {!externalGallery && belowReelSlot ? <div className="w-full">{belowReelSlot}</div> : null}
            {overlayControls}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-full shrink-0">
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
          gridTemplateColumns: reelOnLeft ? `${REEL_WIDTH}px auto` : `auto ${REEL_WIDTH}px`,
          gridTemplateRows: 'auto auto',
        }}
      >
        <div className={`${reelColClass} row-start-1`}>
          <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
            <SpinnerUiFade visible={showSpinnerUi}>{reelSlot}</SpinnerUiFade>
          </SpinnerLayoutSlot>
        </div>

        <div className={`${nameColClass} row-start-1 self-center`}>{nameSlot}</div>

        <div className={`${reelColClass} row-start-2`}>{actions}</div>
      </div>
      </div>
    </div>
  )
})

export default CrateHunt
