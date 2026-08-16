import { useEffect, useRef, useState } from 'react'
import type { MonsterEntry } from '../data/monsters'
import MonsterCard from './MonsterCard'
import CenterMarker from './CenterMarker'
import { CARD_GAP, CARD_SIZE, CENTER_INDEX, SLOT, SPIN_MS, VIEWPORT_HEIGHT } from '../lib/crateConfig'

type ReelProps = {
  sequence: MonsterEntry[]
  onDone: () => void
  landed: boolean
  tempered: boolean
}

function Reel({ sequence, onDone, landed, tempered }: ReelProps) {
  const [translateY, setTranslateY] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const finalY = VIEWPORT_HEIGHT / 2 - (CENTER_INDEX * SLOT + CARD_SIZE / 2)
    const raf = requestAnimationFrame(() => {
      setSpinning(true)
      setTranslateY(finalY)
    })
    const timer = window.setTimeout(() => doneRef.current(), SPIN_MS + 150)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
    // Runs once per mount; parent remounts this component (via key) for each new spin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
      style={{ height: VIEWPORT_HEIGHT, width: CARD_SIZE + 40 }}
    >
      <div
        className={spinning ? 'animate-[reel-blur_4800ms_ease-out_1]' : ''}
        style={{
          position: 'absolute',
          insetInline: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: CARD_GAP,
          transform: `translateY(${translateY}px)`,
          transitionProperty: 'transform',
          transitionDuration: spinning ? `${SPIN_MS}ms` : '0ms',
          transitionTimingFunction: 'cubic-bezier(0.1, 0.62, 0.06, 1)',
        }}
      >
        {sequence.map((entry, i) => (
          <MonsterCard key={i} entry={entry} winner={landed && i === CENTER_INDEX} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

      <CenterMarker active={landed} tempered={tempered} />
    </div>
  )
}

export default Reel
