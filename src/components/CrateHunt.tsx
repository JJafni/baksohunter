import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { CENTER_INDEX, OPEN_MS, REEL_LENGTH, REEL_WIDTH } from '../lib/crateConfig'
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
}

/** Shared row heights so monster and weapon columns line up horizontally. */
const HEADER_ROW_H = '4.75rem'
const FOOTER_ROW_H = '2.75rem'

function buildSequence(target: CrateEntry, pickRandom: () => CrateEntry): CrateEntry[] {
  const sequence: CrateEntry[] = []
  for (let i = 0; i < REEL_LENGTH; i++) {
    sequence.push(i === CENTER_INDEX ? target : pickRandom())
  }
  return sequence
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
}: CrateHuntProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<CrateEntry | null>(null)
  const [sequence, setSequence] = useState<CrateEntry[]>([])
  const [spinKey, setSpinKey] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const spinResolverRef = useRef<(() => void) | null>(null)

  const startHunt = useCallback(async () => {
    if (phase === 'spinning') return

    const target = pickRandom()
    setResult(target)
    setSequence(buildSequence(target, pickRandom))

    if (phase === 'idle') {
      setIsEntering(true)
    }

    setPhase('spinning')
    setSpinKey((k) => k + 1)

    await new Promise<void>((resolve) => {
      spinResolverRef.current = resolve
    })
  }, [phase, pickRandom])

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
  const reelOnLeft = reelSide === 'left'
  const reelColClass = reelOnLeft ? 'col-start-1' : 'col-start-2'
  const nameColClass = reelOnLeft ? 'col-start-2' : 'col-start-1'

  const header = (
    <div className={`text-center ${isEntering ? 'animate-hunt-side-enter' : ''}`} style={{ width: REEL_WIDTH }}>
      <p className="select-none text-3xl font-black uppercase leading-none tracking-tight text-slate-500/40 sm:text-4xl">
        {heading}
      </p>
      <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-100">{subtitle}</p>
    </div>
  )

  const reel = (
    <div style={{ width: REEL_WIDTH }}>
      <div className={isEntering ? 'animate-hunt-reel-stretch' : ''}>
        <Reel
          key={spinKey}
          sequence={sequence}
          onDone={handleLanded}
          landed={phase === 'revealed'}
          rarity={rarity}
        />
      </div>
    </div>
  )

  const poolLine = (
    <p
      className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs"
      style={{ minHeight: FOOTER_ROW_H }}
    >
      {pool.length} {poolCountLabel}
    </p>
  )

  const actions = (
    <div className="flex flex-col items-center pt-6" style={{ width: REEL_WIDTH }}>
      <StatefulButton layoutId={buttonLayoutId} onClick={startHunt} disabled={phase === 'spinning'}>
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
      align={reelSide === 'left' ? 'left' : 'right'}
    />
  )

  return (
    <div className="relative w-fit max-w-full shrink-0">
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          background: backgroundGlow[rarity],
        }}
      />

      {phase === 'idle' ? (
        <div className="flex flex-col items-center" style={{ width: REEL_WIDTH }}>
          <IdleCrate />
          <div className="flex w-full flex-col items-center pt-6">
            <StatefulButton layoutId={buttonLayoutId} onClick={startHunt}>
              {buttonLabel}
            </StatefulButton>
            {poolLine}
          </div>
        </div>
      ) : (
        <div
          className="grid gap-x-3 sm:gap-x-4"
          style={{
            gridTemplateColumns: reelOnLeft ? `${REEL_WIDTH}px auto` : `auto ${REEL_WIDTH}px`,
            gridTemplateRows: `${HEADER_ROW_H} auto auto`,
          }}
        >
          <div
            className={`${reelColClass} row-start-1 flex items-start justify-center`}
            style={{ width: REEL_WIDTH, minHeight: HEADER_ROW_H }}
          >
            {header}
          </div>

          <div className={`${reelColClass} row-start-2`}>{reel}</div>

          <div className={`${nameColClass} row-start-2 self-center`}>{namePanel}</div>

          <div className={`${reelColClass} row-start-3`}>{actions}</div>
        </div>
      )}
    </div>
  )
}

export default CrateHunt
