import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { WILDS_PANEL_BORDER } from '../lib/wildsTheme'
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

function starToggleClass(star: SelectableStar, on: boolean, large: boolean): string {
  const isLow = star <= 4
  const sizeClass = large ? 'py-3 text-base font-black' : 'py-1.5 text-[10px] font-black sm:text-[11px]'
  return `cursor-pointer rounded-md border tracking-wide transition ${sizeClass} ${
    on
      ? isLow
        ? 'border-sky-400/50 bg-sky-400/10 text-sky-200'
        : 'border-amber-400/50 bg-amber-400/10 text-amber-200'
      : 'border-wilds-gold/15 bg-wilds-950/50 text-wilds-parchment/50 hover:border-wilds-gold/30 hover:text-wilds-parchment/80'
  }`
}

function rankToggleClass(on: boolean, large: boolean): string {
  const sizeClass = large
    ? 'px-4 py-3 text-sm font-bold'
    : 'px-2 py-1 text-[9px] font-bold sm:text-[10px]'
  return `${large ? 'flex-1' : 'flex-1'} cursor-pointer rounded-md border uppercase tracking-[0.06em] transition ${sizeClass} ${
    on
      ? 'border-sky-400/60 bg-sky-400/10 text-sky-300'
      : 'border-wilds-gold/20 bg-wilds-950/60 text-wilds-parchment/70 hover:border-wilds-gold/35'
  }`
}

function highRankToggleClass(on: boolean, large: boolean): string {
  const sizeClass = large
    ? 'px-4 py-3 text-sm font-bold'
    : 'px-2 py-1 text-[9px] font-bold sm:text-[10px]'
  return `${large ? 'flex-1' : 'flex-1'} cursor-pointer rounded-md border uppercase tracking-[0.06em] transition ${sizeClass} ${
    on
      ? 'border-amber-400/60 bg-amber-400/10 text-amber-300'
      : 'border-wilds-gold/20 bg-wilds-950/60 text-wilds-parchment/70 hover:border-wilds-gold/35'
  }`
}

type StarFilterPanelProps = {
  value: HuntStarFilterState
  onChange: (next: HuntStarFilterState) => void
  large?: boolean
  layout?: 'dropdown' | 'modal'
}

function StarFilterPanel({ value, onChange, large = false, layout = 'dropdown' }: StarFilterPanelProps) {
  const toggleStar = (star: SelectableStar) => {
    onChange({ ...value, stars: { ...value.stars, [star]: !value.stars[star] } })
  }

  const isDefault = isDefaultStarFilter(value)
  const useGrid = layout === 'modal' || !large

  return (
    <>
      <div className={large ? 'flex gap-2' : 'mb-2 flex gap-1.5'}>
        <button
          type="button"
          aria-pressed={value.lowRank}
          onClick={() => onChange({ ...value, lowRank: !value.lowRank })}
          className={rankToggleClass(value.lowRank, large)}
        >
          Low Rank
        </button>
        <button
          type="button"
          aria-pressed={value.highRank}
          onClick={() => onChange({ ...value, highRank: !value.highRank })}
          className={highRankToggleClass(value.highRank, large)}
        >
          High Rank
        </button>
      </div>

      <p
        className={`text-center font-bold uppercase tracking-[0.14em] text-wilds-muted ${
          large ? 'mb-3 mt-4 text-xs' : 'mb-1.5 text-[8px] sm:text-[9px]'
        }`}
      >
        Investigation Stars
      </p>

      {useGrid ? (
        <div className={`grid grid-cols-5 ${large ? 'gap-2' : 'gap-1'}`}>
          {SELECTABLE_STARS.map((star) => (
            <button
              key={star}
              type="button"
              role="option"
              aria-selected={value.stars[star]}
              onClick={() => toggleStar(star)}
              className={starToggleClass(star, value.stars[star], large)}
            >
              {star}★
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col gap-1">
            {LOW_RANK_STARS.map((star) => (
              <button
                key={star}
                type="button"
                role="option"
                aria-selected={value.stars[star]}
                onClick={() => toggleStar(star)}
                className={`px-2 ${starToggleClass(star, value.stars[star], false)}`}
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
                className={`px-2 ${starToggleClass(star, value.stars[star], false)}`}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>
      )}

      {!isDefault ? (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_HUNT_STAR_FILTER)}
          className={`mt-3 w-full cursor-pointer rounded-md border border-wilds-gold/20 font-bold uppercase tracking-[0.1em] text-wilds-muted transition hover:border-wilds-gold/35 hover:text-wilds-parchment ${
            large ? 'py-2.5 text-sm' : 'py-1 text-[9px] sm:text-[10px]'
          }`}
        >
          Reset
        </button>
      ) : null}
    </>
  )
}

function HuntStarFilterModal({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean
  onClose: () => void
  value: HuntStarFilterState
  onChange: (next: HuntStarFilterState) => void
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close star filter"
            className="absolute inset-0 bg-wilds-950/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="star-filter-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 w-full max-w-md rounded-lg border bg-wilds-950/98 p-4 shadow-2xl ${WILDS_PANEL_BORDER}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-wilds-gold/15 pb-3">
              <h2
                id="star-filter-title"
                className="font-black uppercase tracking-[0.12em] text-wilds-parchment text-sm"
              >
                Star Difficulty
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md border border-wilds-gold/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-wilds-muted transition hover:border-wilds-gold/40 hover:text-wilds-parchment"
              >
                Done
              </button>
            </div>

            <StarFilterPanel value={value} onChange={onChange} large layout="modal" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const isBar = variant === 'bar'
  const [menuStyle, setMenuStyle] = useState<{ left: number; bottom: number } | null>(null)

  useLayoutEffect(() => {
    if (!open || isMobile) {
      setMenuStyle(null)
      return
    }

    const update = () => {
      const trigger = triggerRef.current
      if (!trigger) return

      const rect = trigger.getBoundingClientRect()
      setMenuStyle({
        left: rect.left + rect.width / 2,
        bottom: window.innerHeight - rect.top + 6,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, isMobile])

  useEffect(() => {
    if (!open || isMobile) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
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
  }, [open, isMobile])

  const label = formatStarFilterLabel(value)
  const isDefault = isDefaultStarFilter(value)

  const triggerClass = embedded
    ? 'filter-chip filter-chip-embedded'
    : 'filter-chip'

  const desktopDropdown =
    typeof document !== 'undefined' && !isMobile
      ? createPortal(
          <AnimatePresence>
            {open && menuStyle ? (
              <motion.div
                ref={dropdownRef}
                key="star-filter-menu"
                id={menuId}
                role="listbox"
                aria-label="Star difficulty filter"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="fixed z-[200] w-[15rem] origin-bottom -translate-x-1/2 rounded-lg border border-wilds-gold/30 bg-wilds-950/95 p-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.55)] backdrop-blur-sm"
                style={{
                  left: menuStyle.left,
                  bottom: menuStyle.bottom,
                }}
              >
                <StarFilterPanel value={value} onChange={onChange} layout="dropdown" />
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <>
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
          <p className="filter-section-label">Difficulty</p>
        ) : null}

        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup={isMobile ? 'dialog' : 'listbox'}
          aria-expanded={open}
          aria-controls={isMobile ? undefined : menuId}
          onClick={() => setOpen((o) => !o)}
          className={`${triggerClass} ${
            isDefault
              ? 'border-wilds-gold/25 bg-wilds-950/75 text-wilds-parchment/85 hover:border-wilds-gold/40 hover:text-wilds-parchment'
              : 'border-wilds-gold/50 bg-wilds-gold/10 text-wilds-gold-light'
          } disabled:cursor-not-allowed disabled:opacity-50 enabled:cursor-pointer`}
        >
          <span>{label}</span>
          {!isMobile ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="currentColor"
            >
              <path d="M2 4.5 6 8.5 10 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          ) : null}
        </button>
      </div>

      {desktopDropdown}

      {isMobile ? (
        <HuntStarFilterModal
          open={open}
          onClose={() => setOpen(false)}
          value={value}
          onChange={onChange}
        />
      ) : null}
    </>
  )
}

export default HuntStarFilter
