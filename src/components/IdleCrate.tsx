type IdleCrateProps = {
  onOpen: () => void
}

function IdleCrate({ onOpen }: IdleCrateProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-slate-900/60 to-slate-950 shadow-[0_0_60px_15px_rgba(251,191,36,0.25)]" />
        <div
          className="absolute inset-3 rounded-2xl opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 12px)',
          }}
        />
        <svg
          viewBox="0 0 100 100"
          className="relative h-24 w-24 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.6)]"
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

      <button
        type="button"
        onClick={onOpen}
        className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-transform hover:scale-105 active:scale-95"
      >
        <span className="relative">Open Crate</span>
      </button>
    </div>
  )
}

export default IdleCrate
