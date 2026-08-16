import { REEL_WIDTH } from '../lib/crateConfig'

type IdleCrateProps = {
  spinning?: boolean
}

function IdleCrate({ spinning = false }: IdleCrateProps) {
  return (
    <div
      className={`relative flex items-center justify-center transition-opacity duration-500 ${
        spinning ? 'opacity-40' : 'opacity-100'
      }`}
      style={{ width: REEL_WIDTH, height: REEL_WIDTH }}
    >
        <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-slate-900/60 to-slate-950 shadow-[0_0_40px_10px_rgba(251,191,36,0.2)]" />
        <div
          className="absolute inset-3 rounded-2xl opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12px)',
          }}
        />
        <svg
          viewBox="0 0 100 100"
          className="relative h-20 w-20 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)]"
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
        >
          <path d="M20 78 C 28 55, 30 40, 26 20" />
          <path d="M40 82 C 46 58, 47 38, 44 15" />
          <path d="M60 82 C 58 58, 58 38, 62 15" />
          <path d="M80 78 C 74 55, 72 40, 76 20" />
        </svg>
    </div>
  )
}

export default IdleCrate
