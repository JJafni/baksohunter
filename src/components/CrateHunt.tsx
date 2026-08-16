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
  /** Side the info column (title, name, button) sits on relative to the reel. */
  infoSide: 'left' | 'right'
}

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
  infoSide,
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
  const infoAlign = infoSide === 'left' ? 'items-end text-right' : 'items-start text-left'

  const infoPanel = (
    <div className={`flex w-[200px] shrink-0 flex-col justify-center gap-8 sm:w-[220px] ${infoAlign}`}>
      {phase !== 'idle' ? (
        <div className={isEntering ? 'animate-hunt-side-enter' : ''}>
          <p className="select-none text-3xl font-black uppercase leading-none tracking-tight text-slate-500/40 sm:text-4xl">
            {heading}
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-100">{subtitle}</p>
        </div>
      ) : null}

      {phase !== 'idle' ? (
        <RevealPanel
          result={result}
          visible={phase === 'revealed'}
          rarityLabels={rarityLabels}
          align={infoSide === 'left' ? 'right' : 'left'}
        />
      ) : null}

      <div className={`flex flex-col gap-4 ${infoSide === 'left' ? 'items-end' : 'items-start'}`}>
        <StatefulButton layoutId={buttonLayoutId} onClick={startHunt} disabled={phase === 'spinning'}>
          {buttonLabel}
        </StatefulButton>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
          {pool.length} {poolCountLabel}
        </p>
      </div>
    </div>
  )

  const reelPanel =
    phase === 'idle' ? (
      <IdleCrate />
    ) : (
      <div className={isEntering ? 'animate-hunt-reel-stretch' : ''}>
        <Reel
          key={spinKey}
          sequence={sequence}
          onDone={handleLanded}
          landed={phase === 'revealed'}
          rarity={rarity}
        />
      </div>
    )

  return (
    <div className="relative w-fit">
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          background: backgroundGlow[rarity],
        }}
      />

      {phase === 'idle' ? (
        <div className="flex flex-col items-center" style={{ width: REEL_WIDTH }}>
          {reelPanel}
          <div className="mt-6 flex w-full flex-col items-center gap-4">
            <StatefulButton layoutId={buttonLayoutId} onClick={startHunt}>
              {buttonLabel}
            </StatefulButton>
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
              {pool.length} {poolCountLabel}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center gap-5 sm:gap-6 ${
            infoSide === 'right' ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          <div className="shrink-0" style={{ width: REEL_WIDTH }}>
            {reelPanel}
          </div>
          {infoPanel}
        </div>
      )}
    </div>
  )
}

export default CrateHunt
