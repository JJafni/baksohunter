import { useCallback, useState } from 'react'
import { MONSTER_POOL, pickRandomMonster, type MonsterEntry } from '../data/monsters'
import { CENTER_INDEX, REEL_LENGTH } from '../lib/crateConfig'
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

  const startHunt = useCallback(() => {
    const target = pickRandomMonster()
    setResult(target)
    setSequence(buildSequence(target))
    setPhase('spinning')
    setSpinKey((k) => k + 1)
  }, [])

  const handleLanded = useCallback(() => {
    setPhase('revealed')
  }, [])

  const tempered = result?.tempered ?? false

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: phase === 'revealed' ? 1 : 0,
          background: tempered
            ? 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(244,63,94,0.18), transparent 70%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(56,189,248,0.18), transparent 70%)',
        }}
      />

      {phase === 'idle' ? (
        <IdleCrate onOpen={startHunt} />
      ) : (
        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <div className="w-full max-w-[320px] text-center lg:w-[320px] lg:text-right">
            <p className="select-none text-4xl font-black uppercase tracking-tight text-slate-500/40 sm:text-5xl">
              Hunting
            </p>
            <p className="mt-1 text-lg font-bold uppercase tracking-[0.2em] text-slate-100">
              Crate &middot; Large Monsters
            </p>
          </div>

          <Reel key={spinKey} sequence={sequence} onDone={handleLanded} landed={phase === 'revealed'} tempered={tempered} />

          <RevealPanel result={result} visible={phase === 'revealed'} />
        </div>
      )}

      {phase === 'revealed' && (
        <button
          type="button"
          onClick={startHunt}
          className="mt-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-transform hover:scale-105 active:scale-95"
        >
          Hunt Again
        </button>
      )}

      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-slate-600">
        {MONSTER_POOL.length} Large &amp; Tempered Monsters in the pool
      </p>
    </div>
  )
}

export default CrateOpener
