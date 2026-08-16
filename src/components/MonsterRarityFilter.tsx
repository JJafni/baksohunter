import type { Rarity } from '../data/types'
import type { RarityFilterState } from '../lib/rarityFilter'

type MonsterRarityFilterProps = {
  value: RarityFilterState
  onChange: (next: RarityFilterState) => void
  disabled?: boolean
}

const FILTER_OPTIONS: { rarity: Rarity; label: string; activeClass: string }[] = [
  { rarity: 'normal', label: 'Large', activeClass: 'border-sky-400/60 bg-sky-400/10 text-sky-300' },
  { rarity: 'tempered', label: 'Tempered', activeClass: 'border-rose-400/60 bg-rose-400/10 text-rose-300' },
  {
    rarity: 'arch-tempered',
    label: 'Arch-Tempered',
    activeClass: 'border-amber-400/60 bg-amber-400/10 text-amber-300',
  },
]

function MonsterRarityFilter({ value, onChange, disabled = false }: MonsterRarityFilterProps) {
  const toggle = (rarity: Rarity) => {
    onChange({ ...value, [rarity]: !value[rarity] })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Pool Filters</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTER_OPTIONS.map(({ rarity, label, activeClass }) => {
          const on = value[rarity]
          return (
            <button
              key={rarity}
              type="button"
              disabled={disabled}
              aria-pressed={on}
              onClick={() => toggle(rarity)}
              className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition sm:px-3 sm:py-1.5 sm:text-xs ${
                on
                  ? activeClass
                  : 'border-white/10 bg-black/20 text-slate-500 hover:border-white/20 hover:text-slate-400'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonsterRarityFilter
