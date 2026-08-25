import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { KOI_CARD_BY_ID } from '../data/koiCards'
import type { KoiCardId, KoiFate, ResolvedKoiCard } from '../lib/koiCurseBridge'
import { WILDS_PANEL_BORDER } from '../lib/wildsTheme'
import { cn } from '../lib/utils'

type KoiFateCardModalProps = {
  card: ResolvedKoiCard | null
  open: boolean
  onClose: () => void
}

function fateLabel(fate: KoiFate) {
  return fate === 'cursed' ? 'Cursed' : 'Blessed'
}

function KoiFateCardModal({ card, open, onClose }: KoiFateCardModalProps) {
  const definition = card ? KOI_CARD_BY_ID[card.id as KoiCardId] : null
  const isCursed = card?.fate === 'cursed'

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
      {open && card && definition ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close koi card details"
            className="absolute inset-0 bg-wilds-950/88 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="koi-fate-card-title"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 w-full max-w-sm overflow-hidden rounded-xl border shadow-2xl sm:max-w-md',
              WILDS_PANEL_BORDER,
              isCursed ? 'shadow-red-950/40' : 'shadow-amber-950/30',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <article
              className="overflow-hidden"
              style={{
                background: definition.panel,
                color: definition.ink,
              }}
            >
              <div className="relative aspect-[676/644] w-full overflow-hidden bg-wilds-950">
                <video
                  src={definition.videoSrc}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              <section className="relative px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-[0.18em]',
                        isCursed ? 'text-red-300/90' : 'text-wilds-gold-light/90',
                      )}
                    >
                      {fateLabel(card.fate)}
                    </p>
                    <h2
                      id="koi-fate-card-title"
                      className="mt-1 font-black uppercase tracking-[0.06em]"
                      style={{ color: definition.ink }}
                    >
                      {definition.name}
                    </h2>
                  </div>
                  <span
                    className="shrink-0 rounded border px-2 py-1 text-sm font-bold leading-none"
                    style={{
                      borderColor: `${definition.accent}66`,
                      color: definition.ink,
                    }}
                    aria-hidden="true"
                  >
                    {definition.kanji}
                  </span>
                </div>

                <p
                  className="text-lg font-semibold leading-snug tracking-[0.02em] sm:text-xl"
                  style={{ color: definition.ink }}
                >
                  {definition.motto}
                </p>

                <div
                  className={cn(
                    'mt-5 rounded-lg border px-4 py-3',
                    isCursed ? 'border-red-400/25 bg-red-950/20' : 'border-wilds-gold/25 bg-amber-950/15',
                  )}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-wilds-muted">
                    What it does
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-wilds-parchment/95 sm:text-base">
                    {isCursed ? definition.cursedEffect : definition.blessedEffect}
                  </p>
                </div>
              </section>
            </article>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded border border-wilds-gold/25 bg-wilds-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-wilds-gold-light backdrop-blur-sm transition-colors hover:border-wilds-gold/45 hover:bg-wilds-900/90"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default KoiFateCardModal
