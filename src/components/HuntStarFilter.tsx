import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  DEFAULT_HUNT_STAR_FILTER,
  formatStarFilterLabel,
  isDefaultStarFilter,
  SELECTABLE_STARS,
  type HuntStarFilterState,
  type SelectableStar,
} from '../lib/starFilter'

type HuntStarFilterProps = {
  value: HuntStarFilterState
  onChange: (next: HuntStarFilterState) => void
  disabled?: boolean
  variant?: 'sidebar' | 'bar'
  /** When true, omit the section label (sits inline beside Hunt Type). */
  embedded?: boolean
}

function HuntStarFilter({
  value,
  onChange,
  disabled = false,
  variant = 'bar',
  embedded = false,
}: HuntStarFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const isBar = variant === 'bar'

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggleStar = (star: SelectableStar) => {
    onChange({ ...value, stars: { ...value.stars, [star]: !value.stars[star] } })
  }

  const reset = () => onChange(DEFAULT_HUNT_STAR_FILTER)

  const label = formatStarFilterLabel(value)
  const isDefault = isDefaultStarFilter(value)

  return (
    <div
      ref={rootRef}
      className={
        embedded
          ? 'wilds-legibility-text relative shrink-0'
          : isBar
            ? 'wilds-legibility-text relative flex shrink-0 flex-col items-center gap-2'
            : 'wilds-legibility-text relative flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 sm:w-[6.25rem]'
      }
    >
      {!embedded ? (
        <p className="text-center text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-wilds-parchment/90 sm:text-[10px]">
          Difficulty
        </p>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase leading-tight tracking-[0.08em] transition sm:text-[10px] ${
          isDefault
            ? 'border-wilds-gold/25 bg-wilds-950/75 text-wilds-parchment/85 hover:border-wilds-gold/40 hover:text-wilds-parchment'
            : 'border-wilds-gold/50 bg-wilds-gold/10 text-wilds-gold-light'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span>{label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
        >
          <path d="M2 4.5 6 8.5 10 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="listbox"
            aria-label="Star difficulty filter"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full z-50 mb-1.5 w-[min(100vw-2rem,13.5rem)] origin-bottom rounded-lg border border-wilds-gold/30 bg-wilds-950/95 p-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:w-[13.5rem]"
          >
            <div className="mb-2 flex gap-1.5">
              <button
                type="button"
                aria-pressed={value.lowRank}
                onClick={() => onChange({ ...value, lowRank: !value.lowRank })}
                className={`flex-1 cursor-pointer rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] transition sm:text-[10px] ${
                  value.lowRank
                    ? 'border-sky-400/60 bg-sky-400/10 text-sky-300'
                    : 'border-wilds-gold/20 bg-wilds-950/60 text-wilds-parchment/70 hover:border-wilds-gold/35'
                }`}
              >
                Low Rank
              </button>
              <button
                type="button"
                aria-pressed={value.highRank}
                onClick={() => onChange({ ...value, highRank: !value.highRank })}
                className={`flex-1 cursor-pointer rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] transition sm:text-[10px] ${
                  value.highRank
                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                    : 'border-wilds-gold/20 bg-wilds-950/60 text-wilds-parchment/70 hover:border-wilds-gold/35'
                }`}
              >
                High Rank
              </button>
            </div>

            <p className="mb-1.5 text-center text-[8px] font-bold uppercase tracking-[0.14em] text-wilds-muted sm:text-[9px]">
              Investigation Stars
            </p>
            <div className="grid grid-cols-3 gap-1">
              {SELECTABLE_STARS.map((star) => {
                const on = value.stars[star]
                const isLow = star <= 4
                return (
                  <button
                    key={star}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => toggleStar(star)}
                    className={`cursor-pointer rounded-md border py-1.5 text-[10px] font-black tracking-wide transition sm:text-xs ${
                      on
                        ? isLow
                          ? 'border-sky-400/50 bg-sky-400/10 text-sky-200'
                          : 'border-amber-400/50 bg-amber-400/10 text-amber-200'
                        : 'border-wilds-gold/15 bg-wilds-950/50 text-wilds-parchment/50 hover:border-wilds-gold/30 hover:text-wilds-parchment/80'
                    }`}
                  >
                    {star}★
                  </button>
                )
              })}
            </div>

            {!isDefault ? (
              <button
                type="button"
                onClick={reset}
                className="mt-2 w-full cursor-pointer rounded-md border border-wilds-gold/20 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-wilds-muted transition hover:border-wilds-gold/35 hover:text-wilds-parchment sm:text-[10px]"
              >
                Reset
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default HuntStarFilter
