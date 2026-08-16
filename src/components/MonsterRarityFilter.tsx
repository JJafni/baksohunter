import type { MonsterPoolFilterState } from '../lib/rarityFilter'

type MonsterRarityFilterProps = {
  value: MonsterPoolFilterState
  onChange: (next: MonsterPoolFilterState) => void
  disabled?: boolean
  variant?: 'sidebar' | 'bar'
}

const FILTER_OPTIONS: {
  key: keyof MonsterPoolFilterState
  label: string
  activeClass: string
}[] = [
  { key: 'large', label: 'Base', activeClass: 'border-sky-400/60 bg-sky-400/10 text-sky-300' },
  { key: 'tempered', label: 'Tempered', activeClass: 'border-violet-400/60 bg-violet-400/10 text-violet-300' },
  {
    key: 'arch-tempered',
    label: 'Arch-Tempered',
    activeClass: 'border-amber-400/60 bg-amber-400/10 text-amber-300',
  },
  {
    key: 'elderDragon',
    label: 'Elder Dragon',
    activeClass: 'border-rose-400/60 bg-rose-400/10 text-rose-300',
  },
]

function MonsterRarityFilter({ value, onChange, disabled = false, variant = 'sidebar' }: MonsterRarityFilterProps) {
  const toggle = (key: keyof MonsterPoolFilterState) => {
    onChange({ ...value, [key]: !value[key] })
  }

  const isBar = variant === 'bar'

  return (
    <div
      className={
        isBar
          ? 'flex w-full flex-col items-center gap-2'
          : 'flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 sm:w-[6.25rem]'
      }
    >
      <p className="text-center text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-wilds-muted sm:text-[10px]">
        Pool Filters
      </p>
      <div className={isBar ? 'flex flex-wrap items-center justify-center gap-2' : 'flex flex-col gap-1.5'}>
        {FILTER_OPTIONS.map(({ key, label, activeClass }) => {
          const on = value[key]
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={on}
              onClick={() => toggle(key)}
              className={`cursor-pointer rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase leading-tight tracking-[0.08em] transition sm:text-[10px] ${
                on
                  ? activeClass
                  : 'border-wilds-gold/15 bg-wilds-850/60 text-wilds-muted hover:border-wilds-gold/30 hover:text-wilds-parchment'
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
