import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { QuestType } from '../data/questTypes'
import type { HuntStar } from '../data/huntStars'
import type { CrateEntry, Rarity } from '../data/types'
import { getVisualRarity, RARITY_BACKGROUND_GLOW, type VisualRarity } from '../lib/rarityColors'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
  CENTER_INDEX,
  DESKTOP_OVERLAY_ACTIONS_MIN_HEIGHT,
  HUNT_COLUMN_MAX_WIDTH,
  MOBILE_OVERLAY_ACTIONS_MIN_HEIGHT,
  OPEN_MS,
  REEL_LENGTH,
  REEL_WIDTH,
  REVEAL_UI_FADE_DELAY_MS,
} from '../lib/crateConfig'
import { buildReelSequence } from '../lib/reelSequence'
import Reel from './Reel'
import RevealPanel from './RevealPanel'
import QuestTypeBadge from './QuestTypeBadge'
import MobileHuntResultIcon from './MobileHuntResultIcon'
import MonsterInfoTrigger from './MonsterInfoTrigger'
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
  /** Monster overlay footer hidden for an unobstructed gallery view. */
  immersiveView?: boolean
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
  /** Hide mobile overlay chrome (filters, buttons, pool count) for unified mobile layout. */
  hideMobileChrome?: boolean
  /** Compact side-by-side mobile column — vertical reel fills column height. */
  unifiedMobileColumn?: boolean
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
const MOBILE_APPEAR_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

function SpinnerUiFade({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={visible ? { duration: 0 } : SPINNER_UI_FADE}
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
      className={`grid w-full overflow-hidden ${holdLayout ? 'h-full' : ''}`}
      style={{
        gridTemplateRows: holdLayout ? '1fr' : '0fr',
        transitionProperty: 'grid-template-rows',
        transitionDuration: holdLayout ? '300ms' : '0ms',
        transitionTimingFunction: 'ease-in-out',
      }}
    >
      <div className="flex min-h-0 items-center justify-center overflow-hidden">{children}</div>
    </div>
  )
}

function ImmersiveViewIcon({ hidden = false }: { hidden?: boolean }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5 sm:size-4">
        <path
          d="M2.5 2.5 17.5 17.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7.5 7.8A4.2 4.2 0 0 0 7 10c0 3.3 3 6 3 6 1 0 1.8-.3 2.5-.8M12.8 12.2c.5-.7.7-1.4.7-2.2 0-3.3-3-6-3-6-.8 0-1.5.2-2.2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 10s3-6 9-6c1.8 0 3.3.6 4.5 1.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5 sm:size-4">
      <path
        d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" fill="currentColor" />
    </svg>
  )
}

function ImmersiveRestoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Show hunt controls"
      onClick={onClick}
      className="absolute bottom-5 left-1/2 z-30 inline-flex size-10 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-wilds-gold/35 bg-wilds-950/80 text-wilds-gold-light shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:border-wilds-gold/55 hover:bg-wilds-900/90 hover:text-wilds-parchment"
    >
      <ImmersiveViewIcon hidden />
    </button>
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
    hideMobileChrome = false,
    unifiedMobileColumn = false,
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
  const useCenterOverlayReveal = overlayMode && overlaySpinnerCentered && revealNameAfterSpinnerFade
  /** Co-op overlay uses post-reveal fade on mobile too; overlay hunts fade on all breakpoints. */
  const spinnerFadeEnabled = overlayMode || !isMobile
  /** Co-op uses an external DRAW button — drop empty overlay action chrome. */
  const useCompactOverlayChrome = hidePrimaryButton && useCenterOverlayReveal
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
  const [spinnerUiVisible, setSpinnerUiVisible] = useState(
    () => (isRestoredReveal ? false : (initialContext?.spinnerUiVisible ?? true)),
  )
  const [overlayChromeHidden, setOverlayChromeHidden] = useState(false)
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
    setOverlayChromeHidden(false)

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

    await new Promise<void>((resolve) => {
      spinResolverRef.current = resolve
    })
  }, [
    phase,
    pickRandom,
    pickRandomQuestType,
    pickRandomHuntStar,
    questTypeEnabled,
    pool,
    clearSpinnerFadeTimer,
    useCompactOverlayChrome,
  ])

  useImperativeHandle(ref, () => ({ startSpin: startHunt }), [startHunt])

  useEffect(() => {
    if (!questTypeEnabled) setQuestType(null)
  }, [questTypeEnabled])

  const handleLanded = useCallback(() => {
    setPhase('revealed')
    spinResolverRef.current?.()
    spinResolverRef.current = null
  }, [])

  useEffect(() => {
    if (phase === 'idle') {
      clearSpinnerFadeTimer()
      setSpinnerUiVisible(true)
      setOverlayChromeHidden(false)
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
  const [spinnerHoldLayout, setSpinnerHoldLayout] = useState(
    () =>
      useCompactOverlayChrome ? true : !(isRestoredReveal && revealNameAfterSpinnerFade),
  )
  const showOverlayRevealName =
    phase === 'revealed' &&
    (!revealNameAfterSpinnerFade ||
      skipReelMountRef.current ||
      (useCenterOverlayReveal ? !showSpinnerUi : !showSpinnerUi && !spinnerHoldLayout))

  useEffect(() => {
    // Desktop overlay spinners sit in a fixed band — keep the slot open so re-spins
    // fade/scale in instead of dropping as the grid row expands from 0fr.
    if (useCompactOverlayChrome || overlayMode || showSpinnerUi) {
      setSpinnerHoldLayout(true)
      return
    }

    const timer = window.setTimeout(() => setSpinnerHoldLayout(false), SPINNER_UI_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [showSpinnerUi, useCompactOverlayChrome, overlayMode])

  useEffect(() => {
    onHuntChange?.({
      result,
      questType,
      huntStar,
      phase,
      spinnerUiVisible,
      immersiveView: overlayChromeHidden,
    })
  }, [result, questType, huntStar, phase, spinnerUiVisible, overlayChromeHidden, onHuntChange])

  const showImmersiveToggle =
    showMonsterInfo && overlayMode && phase === 'revealed' && showOverlayRevealName && !isMobile
  const hideOverlayChrome = useCallback(() => setOverlayChromeHidden(true), [])

  const visualRarity: VisualRarity = result ? getVisualRarity(result) : 'normal'
  const backgroundGlow = RARITY_BACKGROUND_GLOW

  const buttonLabel = phase === 'revealed' ? buttonLabels.again : buttonLabels.open
  const canSpin = pool.length > 0
  const reelOnLeft = reelSide === 'left'
  const reelColClass = reelOnLeft ? 'col-start-1' : 'col-start-2'
  const nameColClass = reelOnLeft ? 'col-start-2' : 'col-start-1'

  const useMobileOverlayLayout = isMobile && overlayMode
  const useFullSectionReel =
    useMobileOverlayLayout && unifiedMobileColumn && reelOrientation === 'vertical'

  const blockWidth =
    useFullSectionReel || (unifiedMobileColumn && reelOrientation === 'vertical')
      ? '100%'
      : useStackedLayout
        ? '100%'
        : REEL_WIDTH
  const stretchClass =
    phase !== 'idle' && !useCompactOverlayChrome && !useFullSectionReel
      ? reelOrientation === 'horizontal'
        ? 'animate-hunt-reel-stretch-x'
        : 'animate-hunt-reel-stretch-y'
      : ''

  const actionsPadding =
    phase === 'idle' ? 'pt-0' : useStackedLayout ? 'pt-2' : 'pt-4'

  const useMobileOverlayChromeSheet =
    useMobileOverlayLayout && !useCompactOverlayChrome && !hideMobileChrome

  const poolLine = (
    <p
      aria-hidden={!poolCountLabel}
      className={`flex items-center justify-center whitespace-nowrap text-center uppercase tracking-[0.18em] text-wilds-muted ${
        useMobileOverlayChromeSheet ? 'mt-2 text-[9px]' : useStackedLayout ? 'mt-3 px-2 text-[10px]' : 'mt-3 text-[10px] sm:text-xs'
      }`}
      style={{ minHeight: useMobileOverlayChromeSheet ? '2rem' : FOOTER_ROW_H }}
    >
      {poolCountLabel}
    </p>
  )

  const huntContextForRender: CrateHuntContext = { result, questType, huntStar, phase, spinnerUiVisible }
  const belowReelSlot = externalGallery ? null : belowReel?.(huntContextForRender) ?? null
  const columnMaxWidth = HUNT_COLUMN_MAX_WIDTH
  const overlayActionsMinHeight = isMobile
    ? MOBILE_OVERLAY_ACTIONS_MIN_HEIGHT
    : DESKTOP_OVERLAY_ACTIONS_MIN_HEIGHT
  /** Mobile overlay hunts use the full panel width; desktop caps at 620px. */
  const huntColumnWidthStyle =
    isMobile && overlayMode ? undefined : { maxWidth: columnMaxWidth }

  const filtersDisabled = phase === 'spinning'

  const filterRow = filters ? (
    <div
      className={`flex w-full items-center justify-center overflow-visible lg:px-1 ${
        useMobileOverlayChromeSheet ? 'mb-1' : 'mb-2 max-lg:px-2'
      }`}
    >
      <div className="mx-auto w-fit max-w-full">{filters({ disabled: filtersDisabled, layout: 'bar' })}</div>
    </div>
  ) : null

  const mobileChromeButtonGrid = useMobileOverlayChromeSheet ? (
    <div className="mobile-hunt-controls-grid flex min-h-[10.5rem] w-full gap-2">
      <div className="flex min-h-0 w-[30%] max-w-[7.5rem] shrink-0 flex-col gap-2">
        {companionButton ? (
          <div className="flex min-h-0 flex-1">{companionButton({ disabled: filtersDisabled })}</div>
        ) : null}
        {filters ? (
          <div className="flex min-h-0 flex-1">
            {filters({ disabled: filtersDisabled, layout: 'bar' })}
          </div>
        ) : null}
      </div>
      {hidePrimaryButton ? null : (
        <div className="flex min-h-0 min-w-0 flex-1">
          <StatefulButton
            layoutId={buttonLayoutId}
            loadingLabels={spinLabels}
            icon={buttonIcon}
            surface={buttonSurface}
            onClick={startHunt}
            disabled={phase === 'spinning' || !canSpin}
            className="h-full min-h-0 self-stretch py-0"
          >
            {buttonLabel}
          </StatefulButton>
        </div>
      )}
    </div>
  ) : null

  const actions =
    hideMobileChrome && useMobileOverlayLayout ? null : (
    <div
      className={`mx-auto flex w-full flex-col items-center ${actionsPadding}`}
      style={huntColumnWidthStyle}
    >
      {useMobileOverlayChromeSheet ? (
        <>
          {mobileChromeButtonGrid}
          {poolLine}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )

  const showMobileResultIcon =
    useMobileOverlayLayout &&
    phase === 'revealed' &&
    Boolean(result) &&
    !showSpinnerUi &&
    showOverlayRevealName

  const namePanel = (
    <RevealPanel
      result={result}
      visible={showOverlayRevealName}
      revealKey={spinKey}
      rarityLabels={rarityLabels}
      align={useStackedLayout ? 'center' : reelSide === 'left' ? 'right' : 'left'}
      variant={isMobile ? 'mobile' : 'desktop'}
      layout={revealLayout}
      compact={useMobileOverlayLayout}
      showMonsterInfo={showMonsterInfo}
      huntStar={pickRandomHuntStar ? huntStar : null}
      questType={questTypeEnabled && pickRandomQuestType ? questType : null}
      questTypeVisible={phase === 'revealed'}
      nameOverride={nameOverride}
      showImmersiveToggle={showImmersiveToggle && !overlayChromeHidden}
      onHideOverlayChrome={hideOverlayChrome}
      overlayInfoButton={useFullSectionReel && showMonsterInfo}
    />
  )

  const stackedRevealSlot =
    useMobileOverlayLayout
      ? null
      : !useStackedLayout || useCenterOverlayReveal
      ? null
      : isMobile && !overlayMode
        ? (
            <motion.div
              className="flex w-full shrink-0 items-center justify-center overflow-hidden"
              initial={false}
              animate={{ height: phase === 'idle' ? 0 : MOBILE_REVEAL_ROW_H }}
              transition={OPEN_TRANSITION}
            >
              {phase !== 'idle' ? namePanel : null}
            </motion.div>
          )
        : phase !== 'idle'
          ? revealNameAfterSpinnerFade
            ? (
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
              )
            : (
                <div
                  className="w-full transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ display: 'grid', gridTemplateRows: phase === 'revealed' ? 'auto' : '0fr' }}
                >
                  <div className="min-h-0 overflow-hidden">{namePanel}</div>
                </div>
              )
          : null

  const reelSlot =
    phase === 'idle' || sequence.length === 0 || skipReelMountRef.current ? null : (
      <motion.div
        key={spinKey}
        initial={useFullSectionReel ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
        animate={useFullSectionReel ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={OPEN_TRANSITION}
        className={`${useFullSectionReel || (unifiedMobileColumn && reelOrientation === 'vertical') ? 'h-full w-full' : 'w-full'} ${stretchClass}`}
        style={{
          width: blockWidth,
          height: useFullSectionReel || (unifiedMobileColumn && reelOrientation === 'vertical') ? '100%' : undefined,
          maxWidth:
            useFullSectionReel
              ? undefined
              : unifiedMobileColumn && reelOrientation === 'vertical'
                ? REEL_WIDTH
                : isMobile && overlayMode
                  ? undefined
                  : columnMaxWidth,
        }}
      >
        <Reel
          key={`${spinKey}-${reelOrientation}`}
          sequence={sequence}
          onDone={handleLanded}
          landed={phase === 'revealed'}
          rarity={visualRarity}
          orientation={reelOrientation}
          compactVertical={unifiedMobileColumn && reelOrientation === 'vertical' && !useFullSectionReel}
          fillSection={useFullSectionReel}
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

  const showQuestTypeCornerBadge =
    isMobile &&
    overlayMode &&
    Boolean(pickRandomQuestType) &&
    questTypeEnabled &&
    Boolean(questType) &&
    phase === 'revealed' &&
    showOverlayRevealName

  const questTypeCornerBadge = showQuestTypeCornerBadge ? (
    <QuestTypeBadge
      questType={questType}
      visible
      revealKey={spinKey}
      variant="overlay"
      iconOnly
    />
  ) : null

  const mobileNameRevealSlot = (
    <AnimatePresence>
      {phase === 'revealed' && showOverlayRevealName ? (
        <motion.div
          key={`name-${spinKey}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={MOBILE_APPEAR_TRANSITION}
          className="w-full shrink-0 overflow-hidden px-0.5"
        >
          {namePanel}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  const overlaySpinnerInset = useCompactOverlayChrome ? 'inset-x-3 inset-y-2 sm:inset-x-4' : 'inset-0'

  const overlaySpinnerPane =
    phase === 'idle' ? (
      <div className="h-full min-h-0" aria-hidden="true" />
    ) : useCenterOverlayReveal ? (
      useMobileOverlayLayout ? (
        <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 px-3 py-2">
          <div className="relative flex min-h-[180px] w-full flex-1 items-center justify-center">
            {showMobileResultIcon && result ? (
              <MobileHuntResultIcon entry={result} visible visualRarity={visualRarity} />
            ) : null}
            <div
              className={`absolute inset-0 flex items-center justify-center overflow-hidden ${overlaySpinnerInset} ${
                showMobileResultIcon ? 'pointer-events-none opacity-0' : ''
              }`}
              aria-hidden={showMobileResultIcon}
            >
              <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
                <SpinnerUiFade visible={showSpinnerUi}>
                  {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
                </SpinnerUiFade>
              </SpinnerLayoutSlot>
            </div>
          </div>
          {mobileNameRevealSlot}
        </div>
      ) : (
      <div className="relative h-full min-h-0 w-full">
        <div
          className={`absolute flex h-full w-full items-center justify-center overflow-hidden ${overlaySpinnerInset}`}
        >
          <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
            <SpinnerUiFade visible={showSpinnerUi}>
              {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
            </SpinnerUiFade>
          </SpinnerLayoutSlot>
        </div>
        <motion.div
          className={`pointer-events-none absolute flex h-full w-full items-center justify-center ${overlaySpinnerInset} px-4`}
          initial={false}
          animate={{ opacity: showOverlayRevealName ? 1 : 0 }}
          transition={SPINNER_UI_FADE}
        >
          {phase === 'revealed' ? namePanel : null}
        </motion.div>
      </div>
      )
    ) : useMobileOverlayLayout && unifiedMobileColumn ? (
      useFullSectionReel ? (
        <motion.div
          key={`full-section-${spinKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={MOBILE_APPEAR_TRANSITION}
          className="relative h-full min-h-0 w-full"
        >
          {questTypeCornerBadge}
          <div className="absolute inset-0 flex items-center justify-center pb-24">
            <div className="relative flex items-center justify-center">
              {showMonsterInfo && showMobileResultIcon && result ? (
                <MonsterInfoTrigger
                  slug={result.slug}
                  icon={result.icon}
                  visible={showOverlayRevealName}
                  revealKey={spinKey}
                  className="pointer-events-auto absolute -right-1 top-1 z-30 translate-x-1/3 sm:-right-2 sm:top-2"
                />
              ) : null}
              <AnimatePresence mode="wait">
                {showMobileResultIcon && result ? (
                  <MobileHuntResultIcon
                    key={`icon-${result.slug}-${spinKey}`}
                    entry={result}
                    visible
                    visualRarity={visualRarity}
                    large
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ease-in-out ${
              showMobileResultIcon ? 'pointer-events-none opacity-0' : showSpinnerUi ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!showSpinnerUi || showMobileResultIcon}
          >
            <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
              <SpinnerUiFade visible={showSpinnerUi}>{reelSlot}</SpinnerUiFade>
            </SpinnerLayoutSlot>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-wilds-950 via-wilds-950/92 to-transparent px-1 pb-1 pt-10">
            <div className="pointer-events-auto">{mobileNameRevealSlot}</div>
          </div>
        </motion.div>
      ) : (
      <motion.div
        key={`unified-${spinKey}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={MOBILE_APPEAR_TRANSITION}
        className="relative flex h-full min-h-0 w-full flex-col items-center px-1 py-1"
      >
        {questTypeCornerBadge}
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {showMobileResultIcon && result ? (
              <MobileHuntResultIcon
                key={`icon-${result.slug}-${spinKey}`}
                entry={result}
                visible
                visualRarity={visualRarity}
              />
            ) : null}
          </AnimatePresence>
          <div
            className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${
              showMobileResultIcon ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
            aria-hidden={showMobileResultIcon}
          >
            <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
              <SpinnerUiFade visible={showSpinnerUi}>
                {reelSlot ? (
                  <div className="flex h-full w-full items-center justify-center">{reelSlot}</div>
                ) : null}
              </SpinnerUiFade>
            </SpinnerLayoutSlot>
          </div>
        </div>
        {mobileNameRevealSlot}
      </motion.div>
      )
    ) : useMobileOverlayLayout ? (
      <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 px-3 py-2">
        {questTypeCornerBadge}
        <div className="relative flex min-h-[180px] w-full flex-1 items-center justify-center">
          {showMobileResultIcon && result ? (
            <MobileHuntResultIcon entry={result} visible visualRarity={visualRarity} />
          ) : null}
          <div
            className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
              showMobileResultIcon ? 'pointer-events-none opacity-0' : ''
            }`}
            aria-hidden={showMobileResultIcon}
          >
            <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
              <SpinnerUiFade visible={showSpinnerUi}>
                {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
              </SpinnerUiFade>
            </SpinnerLayoutSlot>
          </div>
        </div>
        {mobileNameRevealSlot}
      </div>
    ) : (
      <SpinnerLayoutSlot holdLayout={spinnerHoldLayout}>
        <SpinnerUiFade visible={showSpinnerUi}>
          {reelSlot ? <div className="w-full shrink-0">{reelSlot}</div> : null}
        </SpinnerUiFade>
      </SpinnerLayoutSlot>
    )

  if (useStackedLayout) {
    const overlayControls = (
      <div
        className={`mx-auto flex w-full flex-col items-center ${
          useMobileOverlayChromeSheet ? 'gap-2 px-3' : 'gap-3 max-lg:px-2'
        }`}
        style={huntColumnWidthStyle}
      >
        {stackedRevealSlot}
        {actions}
      </div>
    )
    const overlayControlsCollapsible =
      showMonsterInfo && overlayMode ? (
        <div
          className={`grid w-full transition-[grid-template-rows] duration-300 ease-in-out ${overlayChromeHidden ? 'overflow-hidden' : 'overflow-visible'}`}
          style={{ gridTemplateRows: overlayChromeHidden ? '0fr' : '1fr' }}
        >
          <div className={`min-h-0 ${overlayChromeHidden ? 'overflow-hidden' : 'overflow-visible'}`}>
            {overlayControls}
          </div>
        </div>
      ) : (
        overlayControls
      )
    const immersiveRestoreButton =
      overlayChromeHidden && showMonsterInfo && overlayMode && phase === 'revealed' ? (
        <ImmersiveRestoreButton onClick={() => setOverlayChromeHidden(false)} />
      ) : null
    const desktopSpinnerBandBottom =
      overlayChromeHidden && showMonsterInfo ? '0.5rem' : `calc(${overlayActionsMinHeight} + 0.5rem)`

    return (
      <div
        className={`relative flex h-full min-h-0 w-full flex-1 flex-col ${overlayMode ? '' : 'mx-auto shrink-0'}`}
        style={overlayMode ? undefined : huntColumnWidthStyle}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
          style={{
            opacity: phase === 'revealed' && !overlayMode ? 1 : 0,
            background: backgroundGlow[visualRarity],
          }}
        />

        {overlayMode ? (
          useCompactOverlayChrome ? (
            <div
              className="mx-auto grid h-full min-h-0 w-full gap-3 py-0 transition-[grid-template-rows] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                maxWidth: columnMaxWidth,
                gridTemplateRows: 'minmax(0, 1fr)',
              }}
            >
              {overlaySpinnerPane}
            </div>
          ) : isMobile ? (
            unifiedMobileColumn ? (
              <div className="relative mx-auto flex h-full min-h-0 w-full flex-col">
                {overlaySpinnerPane}
                {immersiveRestoreButton}
              </div>
            ) : (
            <div className="relative mx-auto flex h-full min-h-0 w-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {overlaySpinnerPane}
              </div>
              <div className="mobile-hunt-controls shrink-0 border-t border-wilds-gold/10 bg-wilds-950/92 backdrop-blur-md">
                {overlayControlsCollapsible}
              </div>
              {immersiveRestoreButton}
            </div>
            )
          ) : (
            <div
              className="relative mx-auto h-full min-h-0 w-full py-2"
              style={{ maxWidth: columnMaxWidth }}
            >
              <div
                className="absolute inset-x-0 top-2 flex items-center justify-center overflow-hidden transition-[bottom] duration-300 ease-in-out"
                style={{ bottom: desktopSpinnerBandBottom }}
              >
                {overlaySpinnerPane}
              </div>
              <div
                className={`absolute inset-x-0 bottom-0 mx-auto flex w-full flex-col justify-end transition-[min-height] duration-300 ease-in-out ${overlayChromeHidden && showMonsterInfo ? 'overflow-hidden' : 'overflow-visible'}`}
                style={{
                  maxWidth: columnMaxWidth,
                  minHeight: overlayChromeHidden && showMonsterInfo ? 0 : overlayActionsMinHeight,
                }}
              >
                {overlayControlsCollapsible}
              </div>
              {immersiveRestoreButton}
            </div>
          )
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
