import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
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

const LOW_RANK_STARS = SELECTABLE_STARS.filter((s) => s <= 4)
const HIGH_RANK_STARS = SELECTABLE_STARS.filter((s) => s >= 5)

function starToggleClass(star: SelectableStar, on: boolean): string {
  const isLow = star <= 4
  return `cursor-pointer rounded-md border py-1.5 text-[10px] font-black tracking-wide transition sm:text-[11px] ${
    on
      ? isLow
        ? 'border-sky-400/50 bg-sky-400/10 text-sky-200'
        : 'border-amber-400/50 bg-amber-400/10 text-amber-200'
      : 'border-wilds-gold/15 bg-wilds-950/50 text-wilds-parchment/50 hover:border-wilds-gold/30 hover:text-wilds-parchment/80'
  }`
}

function HuntStarFilter({
  value,
  onChange,
  disabled = false,
  variant = 'bar',
  embedded = false,
}: HuntStarFilterProps) {
  const isMobile = useIsMobileLayout()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const isBar = variant === 'bar'
  const opensUpward = !isMobile

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

  const menuPositionClass = opensUpward
    ? 'bottom-full left-1/2 mb-1.5 -translate-x-1/2 origin-bottom'
    : 'top-full left-1/2 mt-1.5 -translate-x-1/2 origin-top'

  const menuShadowClass = opensUpward
    ? 'shadow-[0_-8px_32px_rgba(0,0,0,0.55)]'
    : 'shadow-[0_8px_32px_rgba(0,0,0,0.55)]'

  const menuWidthClass = isMobile ? 'w-[8.75rem]' : 'w-[15rem]'

  const menuMotion = opensUpward
    ? { initial: { opacity: 0, y: 8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } }
    : { initial: { opacity: 0, y: -8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } }

  return (
    <div
      ref={rootRef}
      className={
        embedded
          ? 'wilds-legibility-text relative shrink-0 overflow-visible'
          : isBar
            ? 'wilds-legibility-text relative flex shrink-0 flex-col items-center gap-2 overflow-visible'
            : 'wilds-legibility-text relative flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 overflow-visible sm:w-[6.25rem]'
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
            initial={menuMotion.initial}
            animate={menuMotion.animate}
            exit={menuMotion.initial}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 rounded-lg border border-wilds-gold/30 bg-wilds-950/95 p-2.5 backdrop-blur-sm ${menuPositionClass} ${menuShadowClass} ${menuWidthClass}`}
          >
            <div className={isMobile ? 'flex flex-col gap-1' : 'mb-2 flex gap-1.5'}>
              <button
                type="button"
                aria-pressed={value.lowRank}
                onClick={() => onChange({ ...value, lowRank: !value.lowRank })}
                className={`${isMobile ? '' : 'flex-1'} cursor-pointer rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] transition sm:text-[10px] ${
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
                className={`${isMobile ? '' : 'flex-1'} cursor-pointer rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] transition sm:text-[10px] ${
                  value.highRank
                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
                    : 'border-wilds-gold/20 bg-wilds-950/60 text-wilds-parchment/70 hover:border-wilds-gold/35'
                }`}
              >
                High Rank
              </button>
            </div>

            <p
              className={`text-center text-[8px] font-bold uppercase tracking-[0.14em] text-wilds-muted sm:text-[9px] ${
                isMobile ? 'mb-1 mt-2' : 'mb-1.5'
              }`}
            >
              {isMobile ? 'Stars' : 'Investigation Stars'}
            </p>

            {isMobile ? (
              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col gap-1">
                  {LOW_RANK_STARS.map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="option"
                      aria-selected={value.stars[star]}
                      onClick={() => toggleStar(star)}
                      className={`px-2 ${starToggleClass(star, value.stars[star])}`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {HIGH_RANK_STARS.map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="option"
                      aria-selected={value.stars[star]}
                      onClick={() => toggleStar(star)}
                      className={`px-2 ${starToggleClass(star, value.stars[star])}`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1">
                {SELECTABLE_STARS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="option"
                    aria-selected={value.stars[star]}
                    onClick={() => toggleStar(star)}
                    className={starToggleClass(star, value.stars[star])}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            )}

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
