import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { MonsterInfo } from '../data/monsterInfoTypes'
import { WILDS_PANEL_BORDER } from '../lib/wildsTheme'

const ELEMENT_CLASS: Record<string, string> = {
  fire: 'text-orange-400',
  water: 'text-sky-400',
  thunder: 'text-yellow-300',
  ice: 'text-cyan-300',
  dragon: 'text-violet-400',
  blast: 'text-amber-600',
}

function formatLabel(value: string): string {
  return value
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function TagList({ items, empty = '—' }: { items: string[]; empty?: string }) {
  if (items.length === 0) {
    return <span className="text-wilds-muted">{empty}</span>
  }

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {items.map((item) => (
        <span
          key={item}
          className={`text-xs font-bold uppercase tracking-wide sm:text-sm ${ELEMENT_CLASS[item.toLowerCase()] ?? 'text-wilds-parchment'}`}
        >
          {formatLabel(item)}
        </span>
      ))}
    </div>
  )
}

function InfoCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-2.5 text-center sm:p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-wilds-muted sm:text-xs">{label}</p>
      <div className="text-xs leading-snug text-wilds-parchment sm:text-sm">{children}</div>
    </div>
  )
}

function InfoGrid({
  columns,
  children,
}: {
  columns: 1 | 2 | 3 | 4
  children: ReactNode
}) {
  const colClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-2'
        : columns === 3
          ? 'grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-4'

  return (
    <div
      className={`grid ${colClass} divide-x divide-y divide-wilds-gold/15 overflow-hidden rounded-sm border border-wilds-gold/15 bg-wilds-850/30`}
    >
      {children}
    </div>
  )
}

function InlineList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-wilds-muted">—</span>
  return <span>{items.join(', ')}</span>
}

type MonsterInfoModalProps = {
  info: MonsterInfo | null
  icon?: string
  open: boolean
  onClose: () => void
}

function MonsterInfoModal({ info, icon, open, onClose }: MonsterInfoModalProps) {
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
      {open && info ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close monster info"
            className="absolute inset-0 bg-wilds-950/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="monster-info-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 w-full max-w-xl rounded-md border bg-wilds-900 shadow-2xl sm:max-w-2xl ${WILDS_PANEL_BORDER}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-wilds-gold/15 px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <h2
                  id="monster-info-title"
                  className="truncate font-black uppercase tracking-tight text-wilds-parchment text-lg sm:text-xl"
                >
                  {info.name}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.14em] text-wilds-muted sm:text-xs">MHWilds gameplay info</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-sm border border-wilds-gold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-wilds-muted transition hover:border-wilds-gold/40 hover:text-wilds-parchment sm:text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 p-4 sm:space-y-3 sm:p-6">
              <div className="flex justify-center border-b border-wilds-gold/15 pb-3 sm:pb-4">
                {icon ? (
                  <img src={icon} alt="" className="size-28 object-contain sm:size-36" draggable={false} />
                ) : null}
              </div>

              <InfoGrid columns={3}>
                <InfoCell label="Elements">
                  <TagList items={info.elements} />
                </InfoCell>
                <InfoCell label="Status Effects">
                  <TagList items={info.statusEffects} />
                </InfoCell>
                <InfoCell label="Weakest To">
                  <TagList items={info.weakestTo} />
                </InfoCell>
              </InfoGrid>

              <InfoGrid columns={2}>
                <InfoCell label="Capture HP">{info.captureHp}</InfoCell>
                <InfoCell label="Limp HP">{info.limpHp}</InfoCell>
              </InfoGrid>

              <InfoGrid columns={4}>
                <InfoCell label="Small Gold">{info.size.goldSmall}</InfoCell>
                <InfoCell label="Average">{info.size.average}</InfoCell>
                <InfoCell label="Silver">{info.size.silver}</InfoCell>
                <InfoCell label="Large Gold">{info.size.goldLarge}</InfoCell>
              </InfoGrid>

              <InfoGrid columns={3}>
                <InfoCell label="Roar">{info.roar}</InfoCell>
                <InfoCell label="Wind">{info.wind}</InfoCell>
                <InfoCell label="Tremor">{info.tremor}</InfoCell>
              </InfoGrid>

              <InfoGrid columns={4}>
                <InfoCell label="Meat">{info.items.meat}</InfoCell>
                <InfoCell label="Dung Pods">{info.items.dungPods}</InfoCell>
                <InfoCell label="Flash Pods">{info.items.flashPods}</InfoCell>
                <InfoCell label="Screamer Pods">{info.items.screamerPods}</InfoCell>
              </InfoGrid>

              <InfoGrid columns={info.sleepingAreas.length > 0 ? 2 : 1}>
                <InfoCell label="Locales">
                  <InlineList items={info.locales} />
                </InfoCell>
                {info.sleepingAreas.length > 0 ? (
                  <InfoCell label="Sleeping Areas">
                    <InlineList items={info.sleepingAreas} />
                  </InfoCell>
                ) : null}
              </InfoGrid>

              <a
                href={info.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-1 text-center text-[10px] uppercase tracking-[0.14em] text-wilds-gold-light/80 transition hover:text-wilds-gold-light sm:text-xs"
              >
                View on Monster Hunter Wiki
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default MonsterInfoModal
