import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { MonsterEntry } from '../data/monsters'
import { WILDS_PANEL_BORDER } from '../lib/wildsTheme'
import {
  clearMonsterExclusions,
  toggleMonsterExcluded,
  type MonsterExcludeState,
} from '../lib/monsterExcludeFilter'

type MonsterExcludeTileProps = {
  entry: MonsterEntry
  isExcluded: boolean
  onToggle: () => void
}

function MonsterExcludeTile({ entry, isExcluded, onToggle }: MonsterExcludeTileProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setLoaded(false)
    if (imgRef.current?.complete) setLoaded(true)
  }, [entry.icon])

  return (
    <li>
      <button
        type="button"
        aria-pressed={isExcluded}
        aria-label={`${isExcluded ? 'Include' : 'Exclude'} ${entry.name}`}
        title={entry.name}
        onClick={onToggle}
        className={`group relative flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-md border p-2 sm:p-2.5 ${
          isExcluded
            ? 'border-wilds-gold/15 bg-wilds-950/40 opacity-45 grayscale'
            : 'border-wilds-gold/35 bg-wilds-900/80 transition-colors hover:border-wilds-gold/55 hover:bg-wilds-850/90'
        }`}
      >
        <span className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
          {!loaded ? (
            <span
              aria-hidden="true"
              className="skeleton absolute inset-1 rounded-md border border-wilds-gold/10"
            />
          ) : null}
          <img
            ref={imgRef}
            src={entry.icon}
            alt=""
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
          />
          {isExcluded ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="h-px w-full rotate-[-24deg] bg-neutral-400/70" />
            </span>
          ) : null}
        </span>
        <span className="line-clamp-2 w-full text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-wilds-parchment/90 sm:text-[10px]">
          {entry.name}
        </span>
      </button>
    </li>
  )
}

type MonsterExcludeModalProps = {
  open: boolean
  onClose: () => void
  species: MonsterEntry[]
  excluded: MonsterExcludeState
  onChange: (next: MonsterExcludeState) => void
}

function MonsterExcludeModal({ open, onClose, species, excluded, onChange }: MonsterExcludeModalProps) {
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

  useEffect(() => {
    if (!open) return

    for (const entry of species) {
      const img = new Image()
      img.src = entry.icon
    }
  }, [open, species])

  if (typeof document === 'undefined') return null

  const excludedCount = excluded.size

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
            aria-label="Close monster picker"
            className="absolute inset-0 bg-wilds-950/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="monster-exclude-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border bg-wilds-950/98 shadow-2xl ${WILDS_PANEL_BORDER}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-wilds-gold/15 px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <h2
                  id="monster-exclude-title"
                  className="font-black uppercase tracking-[0.12em] text-wilds-parchment text-sm sm:text-base"
                >
                  Exclude Monsters
                </h2>
                <p className="mt-1 text-xs text-wilds-muted sm:text-sm">
                  Tap an icon to remove that species from the hunt pool.
                  {excludedCount > 0 ? ` ${excludedCount} excluded.` : ' None excluded.'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {excludedCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => onChange(clearMonsterExclusions())}
                    className="rounded-md border border-wilds-gold/25 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-wilds-muted transition hover:cursor-pointer hover:border-wilds-gold/40 hover:text-wilds-parchment sm:text-xs"
                  >
                    Include all
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-wilds-gold/25 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-wilds-muted transition hover:cursor-pointer hover:border-wilds-gold/40 hover:text-wilds-parchment"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="wilds-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <ul className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6">
                {species.map((entry) => (
                  <MonsterExcludeTile
                    key={entry.slug}
                    entry={entry}
                    isExcluded={excluded.has(entry.slug)}
                    onToggle={() => onChange(toggleMonsterExcluded(excluded, entry.slug))}
                  />
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default MonsterExcludeModal
