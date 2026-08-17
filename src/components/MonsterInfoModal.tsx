import { useEffect, type ReactNode } from 'react'
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
    <div className="flex flex-col gap-1 border-wilds-gold/10 p-2 text-center sm:p-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-wilds-muted sm:text-[10px]">{label}</p>
      <div className="text-xs text-wilds-parchment sm:text-sm">{children}</div>
    </div>
  )
}

type MonsterInfoModalProps = {
  info: MonsterInfo | null
  open: boolean
  onClose: () => void
}

function MonsterInfoModal({ info, open, onClose }: MonsterInfoModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && info ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close monster info"
            className="absolute inset-0 bg-wilds-950/80 backdrop-blur-sm"
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
            className={`relative z-10 max-h-[min(90vh,720px)] w-full max-w-md overflow-y-auto rounded-md border bg-wilds-900/95 shadow-2xl ${WILDS_PANEL_BORDER}`}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-wilds-gold/15 bg-wilds-900/95 px-4 py-3 sm:px-5">
              <div>
                <h2 id="monster-info-title" className="font-black uppercase tracking-tight text-wilds-parchment text-lg sm:text-xl">
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

            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-3 overflow-hidden rounded-sm border border-wilds-gold/15">
                <InfoCell label="Elements">
                  <TagList items={info.elements} />
                </InfoCell>
                <InfoCell label="Status Effects">
                  <TagList items={info.statusEffects} />
                </InfoCell>
                <InfoCell label="Weakest To">
                  <TagList items={info.weakestTo} />
                </InfoCell>
              </div>

              <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-sm border border-wilds-gold/15">
                <InfoCell label="Capture HP">{info.captureHp}</InfoCell>
                <InfoCell label="Limp HP">{info.limpHp}</InfoCell>
              </div>

              <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-sm border border-wilds-gold/15 sm:grid-cols-4">
                <InfoCell label="Small Gold">{info.size.goldSmall}</InfoCell>
                <InfoCell label="Average">{info.size.average}</InfoCell>
                <InfoCell label="Silver">{info.size.silver}</InfoCell>
                <InfoCell label="Large Gold">{info.size.goldLarge}</InfoCell>
              </div>

              <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-sm border border-wilds-gold/15">
                <InfoCell label="Roar">{info.roar}</InfoCell>
                <InfoCell label="Wind">{info.wind}</InfoCell>
                <InfoCell label="Tremor">{info.tremor}</InfoCell>
              </div>

              <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-sm border border-wilds-gold/15 sm:grid-cols-4">
                <InfoCell label="Meat">{info.items.meat}</InfoCell>
                <InfoCell label="Dung Pods">{info.items.dungPods}</InfoCell>
                <InfoCell label="Flash Pods">{info.items.flashPods}</InfoCell>
                <InfoCell label="Screamer Pods">{info.items.screamerPods}</InfoCell>
              </div>

              <div className="mt-2 overflow-hidden rounded-sm border border-wilds-gold/15">
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
              </div>

              {info.sleepingAreas.length > 0 ? (
                <div className="mt-2 overflow-hidden rounded-sm border border-wilds-gold/15">
                  <InfoCell label="Sleeping Areas">
                    <ul className="space-y-1 text-left text-[11px] sm:text-xs">
                      {info.sleepingAreas.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  </InfoCell>
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
    </AnimatePresence>
  )
}

export default MonsterInfoModal
