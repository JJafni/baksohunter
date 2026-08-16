import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
  CENTER_INDEX,
  MOBILE_REEL_HEIGHT,
  OPEN_MS,
  REEL_LENGTH,
  REEL_WIDTH,
  VIEWPORT_HEIGHT,
} from '../lib/crateConfig'
import { buildReelSequence } from '../lib/reelSequence'
import Reel from './Reel'
import RevealPanel from './RevealPanel'
import IdleCrate from './IdleCrate'
import { StatefulButton } from './ui/stateful-button'

type Phase = 'idle' | 'spinning' | 'revealed'

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
}

/** Shared row heights so monster and weapon columns line up horizontally. */
const HEADER_ROW_H = '6rem'
const FOOTER_ROW_H = '2.75rem'

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
}: CrateHuntProps) {
  const isMobile = useIsMobileLayout()
  const reelOrientation = isMobile ? 'horizontal' : 'vertical'
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<CrateEntry | null>(null)
  const [sequence, setSequence] = useState<CrateEntry[]>([])
  const [spinKey, setSpinKey] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const spinResolverRef = useRef<(() => void) | null>(null)

  const startHunt = useCallback(async () => {
    if (phase === 'spinning' || pool.length === 0) return

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
  }, [phase, pickRandom, pool])

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

  const rarity: Rarity = result?.rarity ?? 'normal'
  const backgroundGlow: Record<Rarity, string> = {
    normal: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(56,189,248,0.18), transparent 70%)',
    tempered: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(244,63,94,0.18), transparent 70%)',
    'arch-tempered': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(251,191,36,0.22), transparent 70%)',
  }

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

  const blockWidth = isMobile ? '100%' : REEL_WIDTH
  const reelSlotHeight = isMobile ? MOBILE_REEL_HEIGHT : VIEWPORT_HEIGHT
  const stretchClass = isEntering
    ? isMobile
      ? 'animate-hunt-reel-stretch-x'
      : 'animate-hunt-reel-stretch-y'
    : ''

  const header = (
    <div
      className={`flex flex-col items-center text-center ${isMobile ? 'gap-1' : 'justify-end pb-1'} ${isEntering ? 'animate-hunt-side-enter' : ''}`}
      style={{ width: blockWidth, minHeight: isMobile ? undefined : HEADER_ROW_H }}
    >
      <p
        className={`select-none font-black uppercase leading-none tracking-tight text-slate-500/40 ${
          isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'
        }`}
      >
        {heading}
      </p>
      <p
        className={`w-max max-w-none whitespace-nowrap font-bold uppercase tracking-[0.15em] text-slate-100 ${
          isMobile ? 'text-base' : 'mt-2 text-lg sm:text-xl'
        }`}
      >
        {subtitle}
      </p>
    </div>
  )

  const poolLine = (
    <p
      className={`mt-3 text-center uppercase tracking-[0.18em] text-slate-600 ${
        isMobile ? 'max-w-[20rem] px-2 text-[10px] leading-relaxed' : 'text-[10px] sm:text-xs'
      }`}
      style={{ minHeight: isMobile ? undefined : FOOTER_ROW_H }}
    >
      {poolCountLabel}
    </p>
  )

  const filtersDisabled = phase === 'spinning'
  const filterLayout = isMobile ? 'bar' : 'sidebar'
  const filtersSlot = filters ? (
    <div className={isMobile ? 'w-full' : 'self-center'}>
      {filters({ disabled: filtersDisabled, layout: filterLayout })}
    </div>
  ) : null

  const actions = (
    <div className={`flex flex-col items-center ${isMobile ? 'pt-2' : 'pt-6'}`} style={{ width: blockWidth }}>
      <StatefulButton layoutId={buttonLayoutId} onClick={startHunt} disabled={phase === 'spinning' || !canSpin}>
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
      align={isMobile ? 'center' : reelSide === 'left' ? 'right' : 'left'}
    />
  )

  const reelSlot =
    phase === 'idle' ? (
      <div
        className={`flex items-center justify-center ${isMobile ? 'w-full max-w-[620px]' : ''}`}
        style={{ width: blockWidth, height: reelSlotHeight }}
      >
        <IdleCrate orientation={reelOrientation} />
      </div>
    ) : (
      <div className={isMobile ? 'w-full max-w-[620px]' : ''} style={{ width: blockWidth }}>
        <div className={stretchClass}>
          <Reel
            key={`${spinKey}-${reelOrientation}`}
            sequence={sequence}
            onDone={handleLanded}
            landed={phase === 'revealed'}
            rarity={rarity}
            orientation={reelOrientation}
          />
        </div>
      </div>
    )

  const nameSlot =
    phase === 'idle' ? (
      isMobile ? null : (
        <div className="w-[150px] shrink-0 sm:w-[185px]" aria-hidden="true" />
      )
    ) : (
      namePanel
    )

  if (isMobile) {
    return (
      <div className="relative w-full max-w-[620px] shrink-0">
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
          style={{
            opacity: phase === 'revealed' ? 1 : 0,
            background: backgroundGlow[rarity],
          }}
        />

        <div className="flex w-full flex-col items-center gap-4">
          {header}
          {hasFilters ? filtersSlot : null}
          <div className="w-full">{reelSlot}</div>
          {nameSlot}
          {actions}
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
          background: backgroundGlow[rarity],
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
        <div className={`${reelColClass} row-start-1 flex justify-center overflow-visible`}>{header}</div>

        {hasFilters ? (
          <div className={`${filterColClass} row-start-2 self-center`}>{filtersSlot}</div>
        ) : null}

        <div className={`${reelColClass} row-start-2`}>{reelSlot}</div>

        <div className={`${nameColClass} row-start-2 self-center`}>{nameSlot}</div>

        <div className={`${reelColClass} row-start-3`}>{actions}</div>
      </div>
    </div>
  )
}

export default CrateHunt
