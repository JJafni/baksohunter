import { REEL_WIDTH, VIEWPORT_HEIGHT } from '../lib/crateConfig'

function OpeningReel() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
      style={{ height: VIEWPORT_HEIGHT, width: REEL_WIDTH }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-slate-900/60 to-slate-950 shadow-[0_0_60px_15px_rgba(251,191,36,0.25)]" />
          <div
            className="absolute inset-2 rounded-xl opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12px)',
            }}
          />
          <svg
            viewBox="0 0 100 100"
            className="relative h-16 w-16 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)]"
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
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500/40" />
        <div className="absolute -left-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-l-0 border-r-[13px] border-y-transparent border-r-slate-500/40" />
        <div className="absolute -right-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-0 border-l-[13px] border-y-transparent border-l-slate-500/40" />
      </div>
    </div>
  )
}

export default OpeningReel
