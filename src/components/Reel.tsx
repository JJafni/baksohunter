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
  SLOT,
  SPIN_MS,
  VIEWPORT_HEIGHT,
} from '../lib/crateConfig'

export type ReelOrientation = 'vertical' | 'horizontal'

type ReelProps = {
  sequence: CrateEntry[]
  onDone: () => void
  landed: boolean
  rarity: VisualRarity
  orientation?: ReelOrientation
}

function Reel({ sequence, onDone, landed, rarity, orientation = 'vertical' }: ReelProps) {
  const isHorizontal = orientation === 'horizontal'
  const containerRef = useRef<HTMLDivElement>(null)
  const [translate, setTranslate] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [viewportSize, setViewportSize] = useState(isHorizontal ? MOBILE_REEL_MAX_WIDTH : VIEWPORT_HEIGHT)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (!isHorizontal) {
      setViewportSize(VIEWPORT_HEIGHT)
      return
    }

    const el = containerRef.current
    if (!el) return

    const updateSize = () => setViewportSize(el.clientWidth)
    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isHorizontal])

  useEffect(() => {
    const finalOffset = viewportSize / 2 - (CENTER_INDEX * SLOT + CARD_SIZE / 2)
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
  }, [viewportSize, isHorizontal])

  const trackStyle = isHorizontal
    ? {
        position: 'absolute' as const,
        insetBlock: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: CARD_GAP,
        transform: `translateX(${translate}px)`,
      }
    : {
        position: 'absolute' as const,
        insetInline: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: CARD_GAP,
        transform: `translateY(${translate}px)`,
      }

  return (
    <div
      ref={containerRef}
      className={
        isHorizontal
          ? `relative w-full overflow-hidden rounded-2xl ${WILDS_REEL_FRAME}`
          : `relative overflow-hidden rounded-2xl ${WILDS_REEL_FRAME}`
      }
      style={
        isHorizontal
          ? { height: MOBILE_REEL_HEIGHT }
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
          <CrateCard key={i} entry={entry} winner={landed && i === CENTER_INDEX} />
        ))}
      </div>

      {isHorizontal ? (
        <>
          <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r ${WILDS_REEL_FADE} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l ${WILDS_REEL_FADE} to-transparent`} />
        </>
      ) : (
        <>
          <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b ${WILDS_REEL_FADE} to-transparent`} />
          <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t ${WILDS_REEL_FADE} to-transparent`} />
        </>
      )}

      <CenterMarkerFrame active={landed} rarity={rarity} orientation={orientation} />
    </div>
  )
}

export default Reel
