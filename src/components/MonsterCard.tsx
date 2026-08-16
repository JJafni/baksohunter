import type { MonsterEntry } from '../data/monsters'
import { CARD_SIZE } from '../lib/crateConfig'

type MonsterCardProps = {
  entry: MonsterEntry
  winner?: boolean
}

const RARITY_TONE = {
  normal: {
    border: 'border-sky-500/60',
    chip: 'bg-sky-500/15 text-sky-200 border-sky-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(56,189,248,0.5)]',
  },
  tempered: {
    border: 'border-rose-500/70',
    chip: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
    glow: 'shadow-[0_0_45px_10px_rgba(244,63,94,0.55)]',
  },
  'arch-tempered': {
    border: 'border-amber-400/80',
    chip: 'bg-amber-500/15 text-amber-200 border-amber-400/50',
    glow: 'shadow-[0_0_55px_14px_rgba(251,191,36,0.6)]',
  },
} as const

function MonsterCard({ entry, winner = false }: MonsterCardProps) {
  const tone = RARITY_TONE[entry.rarity]

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-lg border-2 bg-slate-950/80 p-2.5 transition-transform ${tone.border} ${
        winner ? `scale-[1.06] ${tone.glow}` : ''
      }`}
      style={{ width: CARD_SIZE, height: CARD_SIZE }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 10px)',
        }}
      />
      <div className="relative flex flex-1 items-center justify-center">
        <img
          src={entry.icon}
          alt={entry.name}
          className="h-[76px] w-[76px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          draggable={false}
        />
      </div>
      <span
        className={`relative w-full truncate rounded border px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide ${tone.chip}`}
      >
        {entry.name}
      </span>
    </div>
  )
}

export default MonsterCard
