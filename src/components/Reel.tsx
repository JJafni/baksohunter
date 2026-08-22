import { useEffect, useRef, useState } from 'react'
import type { CrateEntry } from '../data/types'
import type { VisualRarity } from '../lib/rarityColors'
import CrateCard from './CrateCard'
import { CenterMarkerFrame, CenterMarkerGlow } from './CenterMarker'
import { WILDS_REEL_FADE, WILDS_REEL_FRAME } from '../lib/wildsTheme'
import {
  CARD_GAP,
  CARD_SIZE,
  CENTER_INDEX,
  MOBILE_REEL_HEIGHT,
  MOBILE_REEL_MAX_WIDTH,
  MOBILE_VERTICAL_REEL_MIN_HEIGHT,
  SLOT,
  SPIN_MS,
  VIEWPORT_HEIGHT,
} from '../lib/crateConfig'

export type ReelOrientation = 'vertical' | 'horizontal'

type CardMetrics = {
  cardSize: number
  gap: number
  slot: number
}

const DEFAULT_METRICS: CardMetrics = {
  cardSize: CARD_SIZE,
  gap: CARD_GAP,
  slot: SLOT,
}

function metricsForSection(width: number, height: number): CardMetrics {
  const cardSize = Math.max(
    104,
    Math.min(Math.floor(width * 0.92), Math.floor(height * 0.82), 360),
  )
  const gap = Math.max(14, Math.round(cardSize * 0.12))
  return { cardSize, gap, slot: cardSize + gap }
}

type ReelProps = {
  sequence: CrateEntry[]
  onDone: () => void
  landed: boolean
  rarity: VisualRarity
  orientation?: ReelOrientation
  /** Fill parent height instead of using the full desktop vertical viewport. */
  compactVertical?: boolean
  /** Edge-to-edge reel that fills the entire hunt section (mobile columns). */
  fillSection?: boolean
}

function Reel({
  sequence,
  onDone,
  landed,
  rarity,
  orientation = 'vertical',
  compactVertical = false,
  fillSection = false,
}: ReelProps) {
  const isHorizontal = orientation === 'horizontal'
  const containerRef = useRef<HTMLDivElement>(null)
  const [translate, setTranslate] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [viewportSize, setViewportSize] = useState(
    isHorizontal ? MOBILE_REEL_MAX_WIDTH : compactVertical ? MOBILE_VERTICAL_REEL_MIN_HEIGHT : VIEWPORT_HEIGHT,
  )
  const [metrics, setMetrics] = useState<CardMetrics>(DEFAULT_METRICS)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateSize = () => {
      if (isHorizontal) {
        setViewportSize(Math.max(el.clientWidth, 0))
        setMetrics(DEFAULT_METRICS)
        return
      }

      const height = Math.max(el.clientHeight, MOBILE_VERTICAL_REEL_MIN_HEIGHT)
      setViewportSize(height)

      if (fillSection) {
        setMetrics(metricsForSection(el.clientWidth, height))
      } else {
        setMetrics(DEFAULT_METRICS)
      }
    }
    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isHorizontal, compactVertical, fillSection])

  useEffect(() => {
    const finalOffset = viewportSize / 2 - (CENTER_INDEX * metrics.slot + metrics.cardSize / 2)
    const raf = requestAnimationFrame(() => {
      setSpinning(true)
      setTranslate(finalOffset)
    })
    const timer = window.setTimeout(() => doneRef.current(), SPIN_MS + 150)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
    // Runs once per mount; parent remounts this component (via key) for each new spin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportSize, metrics.slot, metrics.cardSize, isHorizontal])

  const trackStyle = isHorizontal
    ? {
        position: 'absolute' as const,
        insetBlock: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: metrics.gap,
        transform: `translateX(${translate}px)`,
      }
    : {
        position: 'absolute' as const,
        insetInline: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: metrics.gap,
        transform: `translateY(${translate}px)`,
      }

  const frameClass = fillSection
    ? 'relative h-full w-full overflow-hidden'
    : isHorizontal
      ? `relative w-full overflow-hidden rounded-2xl ${WILDS_REEL_FRAME}`
      : `relative overflow-hidden rounded-2xl ${WILDS_REEL_FRAME}`

  const fadeSize = fillSection ? 'h-[22%]' : 'h-28'

  return (
    <div
      ref={containerRef}
      className={frameClass}
      style={
        isHorizontal
          ? { height: MOBILE_REEL_HEIGHT }
          : fillSection
            ? { height: '100%', width: '100%', minHeight: MOBILE_VERTICAL_REEL_MIN_HEIGHT }
            : compactVertical
              ? { height: '100%', width: '100%', minHeight: MOBILE_VERTICAL_REEL_MIN_HEIGHT, maxWidth: CARD_SIZE + 40 }
              : { height: VIEWPORT_HEIGHT, width: CARD_SIZE + 40 }
      }
    >
      <CenterMarkerGlow active={landed} rarity={rarity} orientation={orientation} />

      <div
        className={`relative z-10 ${spinning ? 'animate-[reel-blur_4800ms_ease-out_1]' : ''}`}
        style={{
          ...trackStyle,
          transitionProperty: 'transform',
          transitionDuration: spinning ? `${SPIN_MS}ms` : '0ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.62, 0.06, 1)',
        }}
      >
        {sequence.map((entry, i) => (
          <CrateCard
            key={i}
            entry={entry}
            winner={landed && i === CENTER_INDEX}
            size={metrics.cardSize}
            compact={fillSection}
          />
        ))}
      </div>

      {isHorizontal ? (
        <>
          <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r ${WILDS_REEL_FADE} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l ${WILDS_REEL_FADE} to-transparent`} />
        </>
      ) : (
        <>
          <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 ${fadeSize} bg-gradient-to-b ${WILDS_REEL_FADE} to-transparent`} />
          <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${fadeSize} bg-gradient-to-t ${WILDS_REEL_FADE} to-transparent`} />
        </>
      )}

      <CenterMarkerFrame active={landed} rarity={rarity} orientation={orientation} />
    </div>
  )
}

export default Reel
