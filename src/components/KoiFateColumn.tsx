import { AnimatePresence, motion } from 'motion/react'
import { KOI_FATE_LIMITS, type KoiFate, type ResolvedKoiCard } from '../lib/koiCurseBridge'
import { cn } from '../lib/utils'
import { KOI_CARD_BY_ID } from '../data/koiCards'

type KoiFateCardProps = {
  card: ResolvedKoiCard
  onSelect: (card: ResolvedKoiCard) => void
  className?: string
}

function KoiFateCard({ card, onSelect, className }: KoiFateCardProps) {
  const definition = KOI_CARD_BY_ID[card.id]

  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      className={cn(
        'flex min-h-0 w-full min-w-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-lg border bg-wilds-950/90 text-left transition-[box-shadow,border-color] hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wilds-gold/70',
        card.fate === 'cursed' ? 'border-red-400/25 hover:border-red-300/45' : 'border-wilds-gold/25 hover:border-wilds-gold/45',
        className,
      )}
      aria-label={`View ${definition.name} ${card.fate} effect`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-wilds-950">
        <video
          src={definition.videoSrc}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <p
        className={cn(
          'shrink-0 border-t px-2 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs',
          card.fate === 'cursed'
            ? 'border-red-400/20 text-red-100/90'
            : 'border-wilds-gold/20 text-wilds-gold-light/90',
        )}
      >
        {definition.name}
      </p>
    </button>
  )
}

type KoiFateColumnProps = {
  fate: KoiFate
  cards: ResolvedKoiCard[]
  onSelectCard: (card: ResolvedKoiCard) => void
  className?: string
}

function KoiFateColumn({ fate, cards, onSelectCard, className }: KoiFateColumnProps) {
  const isCursed = fate === 'cursed'
  const limit = KOI_FATE_LIMITS[fate]
  const isFull = cards.length >= limit

  return (
    <aside
      className={cn(
        'flex min-h-0 w-[min(34%,11rem)] shrink-0 flex-col gap-2 overflow-hidden border-wilds-gold/10 p-2 sm:w-[min(32%,13rem)] sm:gap-2.5 sm:p-3 lg:w-1/4 lg:max-w-xs lg:gap-3 lg:p-4',
        isCursed ? 'border-r bg-red-950/10' : 'border-l bg-amber-950/10',
        className,
      )}
      aria-label={isCursed ? 'Cursed koi' : 'Blessed koi'}
    >
      <div className="flex shrink-0 items-baseline justify-between gap-2">
        <p
          className={cn(
            'filter-section-label',
            isCursed ? 'text-red-300/80' : 'text-wilds-gold-light/80',
          )}
        >
          {isCursed ? 'Cursed' : 'Blessed'}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-wilds-muted/80">
          {cards.length}/{limit}
        </p>
      </div>

      <div className="wilds-scrollbar-hidden flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto sm:gap-2.5 lg:gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {cards.length === 0 ? (
            <motion.p
              key="empty-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="m-auto px-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-wilds-muted/70"
            >
              Drag {isCursed ? 'left' : 'right'}
            </motion.p>
          ) : null}

          {cards.map(card => (
            <motion.div
              key={card.key}
              layout
              initial={{
                opacity: 0,
                x: isCursed ? 48 : -48,
                scale: 0.94,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.24 },
                x: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex min-h-0 w-full min-w-0 flex-1"
            >
              <KoiFateCard card={card} onSelect={onSelectCard} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
        {isFull ? (
          <p className="shrink-0 px-1 text-center text-[9px] font-bold uppercase tracking-[0.1em] text-wilds-muted/60">
            Limit reached
          </p>
        ) : null}
      </div>
    </aside>
  )
}

export default KoiFateColumn
