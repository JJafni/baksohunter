import { useCallback, useEffect, useRef, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { CENTER_INDEX, OPEN_MS, REEL_LENGTH } from '../lib/crateConfig'
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
  /** Which side of the reel the reveal name sits on (faces inward toward the other column). */
  revealSide: 'left' | 'right'
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
  revealSide,
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

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          background: backgroundGlow[rarity],
        }}
      />

      {phase === 'idle' ? (
        <IdleCrate />
      ) : (
        <div className="flex w-full flex-col items-center gap-8">
          <div className={`text-center ${isEntering ? 'animate-hunt-side-enter' : ''}`}>
            <p className="select-none text-4xl font-black uppercase tracking-tight text-slate-500/40 sm:text-5xl">
              {heading}
            </p>
            <p className="mt-1 text-lg font-bold uppercase tracking-[0.2em] text-slate-100">{subtitle}</p>
          </div>

          <div
            className={`flex w-full items-center justify-center gap-6 lg:gap-8 ${
              revealSide === 'right' ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className={isEntering ? 'animate-hunt-reel-stretch' : ''}>
              <Reel
                key={spinKey}
                sequence={sequence}
                onDone={handleLanded}
                landed={phase === 'revealed'}
                rarity={rarity}
              />
            </div>

            <RevealPanel
              result={result}
              visible={phase === 'revealed'}
              rarityLabels={rarityLabels}
              align={revealSide === 'left' ? 'right' : 'left'}
            />
          </div>
        </div>
      )}

      <StatefulButton
        className="mt-8"
        layoutId={buttonLayoutId}
        onClick={startHunt}
        disabled={phase === 'spinning'}
      >
        {buttonLabel}
      </StatefulButton>

      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-slate-600">
        {pool.length} {poolCountLabel}
      </p>
    </div>
  )
}

export default CrateHunt
