import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { MonsterInfo } from '../data/monsterInfoTypes'
import { WILDS_PANEL_BORDER, WILDS_SCROLLBAR } from '../lib/wildsTheme'

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
          className={`text-[11px] font-bold uppercase tracking-wide sm:text-xs ${ELEMENT_CLASS[item.toLowerCase()] ?? 'text-wilds-parchment'}`}
        >
          {formatLabel(item)}
        </span>
      ))}
    </div>
  )
}

function InfoCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-2 text-center sm:p-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-wilds-muted sm:text-[10px]">{label}</p>
      <div className="text-xs text-wilds-parchment sm:text-sm">{children}</div>
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
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
            className={`relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-md flex-col overflow-hidden rounded-md border bg-wilds-900 shadow-2xl ${WILDS_PANEL_BORDER}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-wilds-gold/15 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h2
                  id="monster-info-title"
                  className="truncate font-black uppercase tracking-tight text-wilds-parchment text-lg sm:text-xl"
                >
                  {info.name}
                </h2>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-wilds-muted sm:text-[11px]">
                  MHWilds gameplay info
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-sm border border-wilds-gold/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-wilds-muted transition hover:border-wilds-gold/40 hover:text-wilds-parchment"
              >
                Close
              </button>
            </div>

            <div className={`min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 ${WILDS_SCROLLBAR}`}>
              <div className="mb-3 flex justify-center border-b border-wilds-gold/15 pb-3">
                {icon ? (
                  <img src={icon} alt="" className="size-24 object-contain sm:size-28" draggable={false} />
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-sm border border-dashed border-wilds-gold/20 text-[10px] uppercase tracking-[0.14em] text-wilds-muted sm:size-28">
                    No icon
                  </div>
                )}
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

                <div className="mt-2">
                  <InfoGrid columns={2}>
                    <InfoCell label="Capture HP">{info.captureHp}</InfoCell>
                    <InfoCell label="Limp HP">{info.limpHp}</InfoCell>
                  </InfoGrid>
                </div>

                <div className="mt-2">
                  <InfoGrid columns={4}>
                    <InfoCell label="Small Gold">{info.size.goldSmall}</InfoCell>
                    <InfoCell label="Average">{info.size.average}</InfoCell>
                    <InfoCell label="Silver">{info.size.silver}</InfoCell>
                    <InfoCell label="Large Gold">{info.size.goldLarge}</InfoCell>
                  </InfoGrid>
                </div>

                <div className="mt-2">
                  <InfoGrid columns={3}>
                    <InfoCell label="Roar">{info.roar}</InfoCell>
                    <InfoCell label="Wind">{info.wind}</InfoCell>
                    <InfoCell label="Tremor">{info.tremor}</InfoCell>
                  </InfoGrid>
                </div>

                <div className="mt-2">
                  <InfoGrid columns={4}>
                    <InfoCell label="Meat">{info.items.meat}</InfoCell>
                    <InfoCell label="Dung Pods">{info.items.dungPods}</InfoCell>
                    <InfoCell label="Flash Pods">{info.items.flashPods}</InfoCell>
                    <InfoCell label="Screamer Pods">{info.items.screamerPods}</InfoCell>
                  </InfoGrid>
                </div>

                <div className="mt-2">
                  <InfoGrid columns={1}>
                    <InfoCell label="Locales">
                      {info.locales.length > 0 ? (
                        <ul className="space-y-1 text-left text-[11px] sm:text-xs">
                          {info.locales.map((locale) => (
                            <li key={locale}>{locale}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-wilds-muted">—</span>
                      )}
                    </InfoCell>
                  </InfoGrid>
                </div>

                {info.sleepingAreas.length > 0 ? (
                  <div className="mt-2">
                    <InfoGrid columns={1}>
                      <InfoCell label="Sleeping Areas">
                        <ul className="space-y-1 text-left text-[11px] sm:text-xs">
                          {info.sleepingAreas.map((area) => (
                            <li key={area}>{area}</li>
                          ))}
                        </ul>
                      </InfoCell>
                    </InfoGrid>
                  </div>
                ) : null}

                <a
                  href={info.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-[10px] uppercase tracking-[0.14em] text-wilds-gold-light/80 transition hover:text-wilds-gold-light"
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
