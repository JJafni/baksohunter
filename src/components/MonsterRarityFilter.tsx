import type { ReactNode } from 'react'
import type { MonsterPoolFilterState } from '../lib/rarityFilter'

type MonsterRarityFilterProps = {
  value: MonsterPoolFilterState
  onChange: (next: MonsterPoolFilterState) => void
  questTypeEnabled?: boolean
  onQuestTypeChange?: (enabled: boolean) => void
  disabled?: boolean
  variant?: 'sidebar' | 'bar'
  /** Rendered after Hunt Type in bar layout (e.g. star difficulty dropdown). */
  trailing?: ReactNode
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

function MonsterRarityFilter({
  value,
  onChange,
  questTypeEnabled,
  onQuestTypeChange,
  disabled = false,
  variant = 'sidebar',
  trailing,
}: MonsterRarityFilterProps) {
  const toggle = (key: keyof MonsterPoolFilterState) => {
    onChange({ ...value, [key]: !value[key] })
  }

  const isBar = variant === 'bar'

  return (
    <div
      className={
        isBar
          ? 'wilds-legibility-text flex w-full flex-col items-center gap-2 lg:mx-auto lg:w-fit lg:max-w-full'
          : 'wilds-legibility-text flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 sm:w-[6.25rem]'
      }
    >
      <p className="filter-section-label">Pool Filters</p>
      <div
        className={
          isBar
            ? 'flex w-full flex-wrap items-center justify-center gap-2.5 lg:mx-auto lg:w-fit lg:max-w-full lg:gap-2'
            : 'flex flex-col gap-2 lg:gap-1.5'
        }
      >
        {FILTER_OPTIONS.map(({ key, label, activeClass }) => {
          const on = value[key]
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={on}
              onClick={() => toggle(key)}
              className={`filter-chip ${
                on
                  ? activeClass
                  : 'border-wilds-gold/25 bg-wilds-950/75 text-wilds-parchment/85 hover:border-wilds-gold/40 hover:text-wilds-parchment'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {label}
            </button>
          )
        })}
        {onQuestTypeChange ? (
          <>
            <div
              aria-hidden="true"
              className={
                isBar
                  ? 'mx-0.5 h-5 w-px shrink-0 self-center bg-wilds-gold/20'
                  : 'my-0.5 h-px w-full shrink-0 bg-wilds-gold/20'
              }
            />
            <button
              type="button"
              disabled={disabled}
              aria-pressed={questTypeEnabled}
              onClick={() => onQuestTypeChange(!questTypeEnabled)}
              className={`filter-chip ${
                questTypeEnabled
                  ? 'border-wilds-gold/50 bg-wilds-gold/10 text-wilds-gold-light'
                  : 'border-wilds-gold/25 bg-wilds-950/75 text-wilds-parchment/85 hover:border-wilds-gold/40 hover:text-wilds-parchment'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Hunt Type
            </button>
            {trailing ? (
              <>
                <div
                  aria-hidden="true"
                  className={
                    isBar
                      ? 'mx-0.5 h-5 w-px shrink-0 self-center bg-wilds-gold/20'
                      : 'my-0.5 h-px w-full shrink-0 bg-wilds-gold/20'
                  }
                />
                {trailing}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default MonsterRarityFilter
