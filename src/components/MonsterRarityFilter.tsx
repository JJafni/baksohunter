import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { DEFAULT_MONSTER_POOL_FILTER, type MonsterPoolFilterState } from '../lib/rarityFilter'
import { isDefaultStarFilter, type HuntStarFilterState } from '../lib/starFilter'
import { WILDS_PANEL_BORDER } from '../lib/wildsTheme'
import { StarFilterPanel } from './HuntStarFilter'

type MonsterRarityFilterProps = {
  value: MonsterPoolFilterState
  onChange: (next: MonsterPoolFilterState) => void
  questTypeEnabled?: boolean
  onQuestTypeChange?: (enabled: boolean) => void
  disabled?: boolean
  variant?: 'sidebar' | 'bar'
  /** Star filter shown inside the mobile modal and as trailing chip on desktop bar. */
  starFilter?: HuntStarFilterState
  onStarFilterChange?: (next: HuntStarFilterState) => void
  /** Rendered after Hunt Type in bar layout on desktop (e.g. star difficulty dropdown). */
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

function isDefaultPoolFilter(value: MonsterPoolFilterState): boolean {
  return (
    value.large === DEFAULT_MONSTER_POOL_FILTER.large &&
    value.tempered === DEFAULT_MONSTER_POOL_FILTER.tempered &&
    value['arch-tempered'] === DEFAULT_MONSTER_POOL_FILTER['arch-tempered'] &&
    value.elderDragon === DEFAULT_MONSTER_POOL_FILTER.elderDragon
  )
}

function FilterChevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M2 4.5 6 8.5 10 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

type FilterChipsProps = {
  value: MonsterPoolFilterState
  onChange: (next: MonsterPoolFilterState) => void
  questTypeEnabled?: boolean
  onQuestTypeChange?: (enabled: boolean) => void
  disabled?: boolean
  layout: 'bar' | 'sidebar' | 'modal'
  trailing?: ReactNode
}

function FilterChips({
  value,
  onChange,
  questTypeEnabled,
  onQuestTypeChange,
  disabled = false,
  layout,
  trailing,
}: FilterChipsProps) {
  const isBar = layout === 'bar'
  const isModal = layout === 'modal'

  const toggle = (key: keyof MonsterPoolFilterState) => {
    onChange({ ...value, [key]: !value[key] })
  }

  return (
    <div
      className={
        isBar
          ? 'mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-2.5 lg:gap-2'
          : isModal
            ? 'flex flex-wrap items-center justify-center gap-2'
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
              isBar || isModal
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
          {trailing && !isModal ? (
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
  )
}

function MonsterPoolFilterModal({
  open,
  onClose,
  value,
  onChange,
  questTypeEnabled,
  onQuestTypeChange,
  disabled,
  starFilter,
  onStarFilterChange,
}: {
  open: boolean
  onClose: () => void
  value: MonsterPoolFilterState
  onChange: (next: MonsterPoolFilterState) => void
  questTypeEnabled?: boolean
  onQuestTypeChange?: (enabled: boolean) => void
  disabled?: boolean
  starFilter?: HuntStarFilterState
  onStarFilterChange?: (next: HuntStarFilterState) => void
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
            aria-label="Close pool filters"
            className="absolute inset-0 bg-wilds-950/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pool-filter-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 max-h-[min(90vh,640px)] w-full max-w-md overflow-y-auto rounded-lg border bg-wilds-950/98 p-4 shadow-2xl ${WILDS_PANEL_BORDER}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-wilds-gold/15 pb-3">
              <h2
                id="pool-filter-title"
                className="font-black uppercase tracking-[0.12em] text-wilds-parchment text-sm"
              >
                Pool Filters
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md border border-wilds-gold/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-wilds-muted transition hover:border-wilds-gold/40 hover:text-wilds-parchment"
              >
                Done
              </button>
            </div>

            <FilterChips
              value={value}
              onChange={onChange}
              questTypeEnabled={questTypeEnabled}
              onQuestTypeChange={onQuestTypeChange}
              disabled={disabled}
              layout="modal"
            />

            {starFilter && onStarFilterChange ? (
              <div className="mt-5 border-t border-wilds-gold/15 pt-5">
                <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-wilds-muted">
                  Star Difficulty
                </p>
                <StarFilterPanel
                  value={starFilter}
                  onChange={onStarFilterChange}
                  large
                  layout="modal"
                />
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function MonsterRarityFilter({
  value,
  onChange,
  questTypeEnabled,
  onQuestTypeChange,
  disabled = false,
  variant = 'sidebar',
  starFilter,
  onStarFilterChange,
  trailing,
}: MonsterRarityFilterProps) {
  const isMobile = useIsMobileLayout()
  const [filtersExpanded, setFiltersExpanded] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const isBar = variant === 'bar'
  const useMobileModal = isMobile && isBar

  const poolIsDefault = isDefaultPoolFilter(value)
  const starIsDefault = !starFilter || isDefaultStarFilter(starFilter)
  const questTypeIsDefault = questTypeEnabled ?? true
  const filtersCustomized = !poolIsDefault || !starIsDefault || !questTypeIsDefault

  if (useMobileModal) {
    return (
      <>
        <div className="wilds-legibility-text flex w-full flex-col">
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            onClick={() => setModalOpen(true)}
            className={`filter-chip min-h-[2.35rem] w-full ${
              filtersCustomized
                ? 'border-wilds-gold/50 bg-wilds-gold/10 text-wilds-gold-light'
                : 'border-wilds-gold/25 bg-wilds-950/75 text-wilds-parchment/85 hover:border-wilds-gold/40 hover:text-wilds-parchment'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Pool Filters
          </button>
        </div>

        <MonsterPoolFilterModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          value={value}
          onChange={onChange}
          questTypeEnabled={questTypeEnabled}
          onQuestTypeChange={onQuestTypeChange}
          disabled={disabled}
          starFilter={starFilter}
          onStarFilterChange={onStarFilterChange}
        />
      </>
    )
  }

  return (
    <div
      className={
        isBar
          ? 'wilds-legibility-text mx-auto flex w-fit max-w-full flex-col items-center gap-2'
          : 'wilds-legibility-text flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 sm:w-[6.25rem]'
      }
    >
      {isBar ? (
        <>
          <button
            type="button"
            aria-expanded={filtersExpanded}
            onClick={() => setFiltersExpanded((open) => !open)}
            className="filter-section-label inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-1 py-0.5 transition hover:text-wilds-parchment"
          >
            Pool Filters
            <FilterChevron open={filtersExpanded} />
          </button>
          <div
            className={`grid w-full transition-[grid-template-rows] duration-300 ease-in-out ${filtersExpanded ? 'overflow-visible' : 'overflow-hidden'}`}
            style={{ gridTemplateRows: filtersExpanded ? '1fr' : '0fr' }}
          >
            <div className={`min-h-0 ${filtersExpanded ? 'overflow-visible' : 'overflow-hidden'}`}>
              <FilterChips
                value={value}
                onChange={onChange}
                questTypeEnabled={questTypeEnabled}
                onQuestTypeChange={onQuestTypeChange}
                disabled={disabled}
                layout="bar"
                trailing={trailing}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="filter-section-label">Pool Filters</p>
          <FilterChips
            value={value}
            onChange={onChange}
            questTypeEnabled={questTypeEnabled}
            onQuestTypeChange={onQuestTypeChange}
            disabled={disabled}
            layout="sidebar"
            trailing={trailing}
          />
        </>
      )}
    </div>
  )
}

export default MonsterRarityFilter
