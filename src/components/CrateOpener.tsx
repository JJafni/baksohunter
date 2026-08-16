import { useCallback, useEffect, useState } from 'react'
import { MONSTER_POOL, pickRandomMonster, type MonsterEntry, type Rarity } from '../data/monsters'
import { CENTER_INDEX, OPEN_MS, REEL_LENGTH } from '../lib/crateConfig'
import Reel from './Reel'
import RevealPanel from './RevealPanel'
import IdleCrate from './IdleCrate'

type Phase = 'idle' | 'spinning' | 'revealed'

function buildSequence(target: MonsterEntry): MonsterEntry[] {
  const sequence: MonsterEntry[] = []
  for (let i = 0; i < REEL_LENGTH; i++) {
    sequence.push(i === CENTER_INDEX ? target : pickRandomMonster())
  }
  return sequence
}

function CrateOpener() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<MonsterEntry | null>(null)
  const [sequence, setSequence] = useState<MonsterEntry[]>([])
  const [spinKey, setSpinKey] = useState(0)
  const [isEntering, setIsEntering] = useState(false)

  const startHunt = useCallback(() => {
    if (phase === 'spinning') return

    const target = pickRandomMonster()
    setResult(target)
    setSequence(buildSequence(target))
    setPhase('spinning')
    setSpinKey((k) => k + 1)

    if (phase === 'idle') {
      setIsEntering(true)
    }
  }, [phase])

  useEffect(() => {
    if (!isEntering) return

    const timer = window.setTimeout(() => setIsEntering(false), OPEN_MS)
    return () => window.clearTimeout(timer)
  }, [isEntering])

  const handleLanded = useCallback(() => {
    setPhase('revealed')
  }, [])

  const rarity: Rarity = result?.rarity ?? 'normal'
  const backgroundGlow: Record<Rarity, string> = {
    normal: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(56,189,248,0.18), transparent 70%)',
    tempered: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(244,63,94,0.18), transparent 70%)',
    'arch-tempered': 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(251,191,36,0.22), transparent 70%)',
  }

  const isBusy = phase === 'spinning'
  const buttonLabel = phase === 'revealed' ? 'Hunt Again' : 'Open Crate'

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
        <div
          className={`flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16 ${
            isEntering ? 'animate-hunt-stage-enter' : ''
          }`}
        >
          <div className={`w-full max-w-[320px] text-center lg:w-[320px] lg:text-right ${isEntering ? 'animate-hunt-side-enter' : ''}`}>
            <p className="select-none text-4xl font-black uppercase tracking-tight text-slate-500/40 sm:text-5xl">
              Hunting
            </p>
            <p className="mt-1 text-lg font-bold uppercase tracking-[0.2em] text-slate-100">
              Crate &middot; Large Monsters
            </p>
          </div>

          <Reel key={spinKey} sequence={sequence} onDone={handleLanded} landed={phase === 'revealed'} rarity={rarity} />

          <div className={isEntering ? 'animate-hunt-reveal-enter' : ''}>
            <RevealPanel result={result} visible={phase === 'revealed'} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={startHunt}
        disabled={isBusy}
        className={`mt-8 rounded-lg px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] transition-all ${
          isBusy
            ? 'cursor-not-allowed bg-slate-800 text-slate-500 shadow-none'
            : 'cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_30px_rgba(251,146,60,0.4)] hover:scale-105 active:scale-95'
        }`}
      >
        {isBusy ? 'Opening...' : buttonLabel}
      </button>

      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-slate-600">
        {MONSTER_POOL.length} Large, Tempered &amp; Arch-Tempered Monsters in the pool
      </p>
    </div>
  )
}

export default CrateOpener
