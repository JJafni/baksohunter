import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  KOI_SHUFFLE_LIMIT,
  KOI_SHUFFLE_MESSAGE,
  type KoiFate,
  type ResolvedKoiCard,
  canAddKoiFate,
  getKoiFateFromDirection,
  getKoiFateFromDrag,
  isKoiDragPayload,
  isKoiDropPayload,
  isKoiShuffleResultPayload,
  postKoiFateLimits,
  tryAddResolvedKoiCard,
} from '../lib/koiCurseBridge'
import { cn } from '../lib/utils'
import KoiFateCardModal from './KoiFateCardModal'
import KoiFateColumn from './KoiFateColumn'
import KoiStudiesPanel from './KoiStudiesPanel'

type CurseModeSectionProps = {
  className?: string
  style?: CSSProperties
}

function FateHint({ side, active }: { side: KoiFate; active: boolean }) {
  const isCursed = side === 'cursed'

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 z-20 flex w-[min(22%,7rem)] items-center justify-center transition-opacity duration-200',
        isCursed ? 'left-0 bg-gradient-to-r from-red-950/70 to-transparent' : 'right-0 bg-gradient-to-l from-amber-950/55 to-transparent',
        active ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'filter-section-label [writing-mode:vertical-rl] rotate-180',
          isCursed ? 'text-red-300/90' : 'text-wilds-gold-light/90',
        )}
      >
        {isCursed ? 'Cursed' : 'Blessed'}
      </span>
    </div>
  )
}

function CurseModeSection({ className, style }: CurseModeSectionProps) {
  const koiContainerRef = useRef<HTMLDivElement>(null)
  const koiIframeRef = useRef<HTMLIFrameElement>(null)
  const resolvedCardsRef = useRef<ResolvedKoiCard[]>([])
  const [activeFate, setActiveFate] = useState<KoiFate | null>(null)
  const [resolvedCards, setResolvedCards] = useState<ResolvedKoiCard[]>([])
  const [shufflesLeft, setShufflesLeft] = useState(KOI_SHUFFLE_LIMIT)
  const [selectedCard, setSelectedCard] = useState<ResolvedKoiCard | null>(null)

  resolvedCardsRef.current = resolvedCards

  const handleShuffle = () => {
    if (shufflesLeft <= 0) return
    koiIframeRef.current?.contentWindow?.postMessage({ type: KOI_SHUFFLE_MESSAGE }, '*')
  }

  useEffect(() => {
    postKoiFateLimits(koiIframeRef.current?.contentWindow, resolvedCards)
  }, [resolvedCards])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data

      if (isKoiShuffleResultPayload(data)) {
        if (data.ok) {
          setShufflesLeft(prev => Math.max(0, prev - 1))
        }
        return
      }

      if (isKoiDragPayload(data)) {
        const fate = getKoiFateFromDrag(data.dx, data.dy)
        if (fate && !canAddKoiFate(resolvedCardsRef.current, fate)) {
          setActiveFate(null)
          return
        }

        setActiveFate(fate)
        return
      }

      if (!isKoiDropPayload(data)) return

      setActiveFate(null)

      const fate = getKoiFateFromDirection(data.committedDirection)
      if (!fate) return

      setResolvedCards(prev =>
        tryAddResolvedKoiCard(prev, {
          id: data.cardId as ResolvedKoiCard['id'],
          name: data.cardName,
          fate,
        }),
      )
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const cursedCards = resolvedCards.filter(card => card.fate === 'cursed')
  const blessedCards = resolvedCards.filter(card => card.fate === 'blessed')

  return (
    <section
      className={cn(
        'relative flex min-h-0 flex-col border-t border-wilds-gold/15 bg-wilds-950',
        className,
      )}
      style={style}
      aria-label="Curse mode"
    >
      <div className="flex shrink-0 flex-col items-center justify-center gap-1 border-b border-wilds-gold/10 bg-wilds-950/80 px-4 py-2.5 backdrop-blur-sm">
        <h2 className="filter-section-label">Curse Mode</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-wilds-muted sm:text-xs">
          Drag each koi left or right — up to 3 cursed and 1 blessed
        </p>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <KoiFateColumn fate="cursed" cards={cursedCards} onSelectCard={setSelectedCard} />

        <div className="relative min-h-0 min-w-0 flex-1">
          <FateHint side="cursed" active={activeFate === 'cursed'} />
          <FateHint side="blessed" active={activeFate === 'blessed'} />
          <KoiStudiesPanel
            ref={koiContainerRef}
            iframeRef={koiIframeRef}
            onIframeLoad={() =>
              postKoiFateLimits(koiIframeRef.current?.contentWindow, resolvedCardsRef.current)
            }
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-4">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={shufflesLeft <= 0}
              className="pointer-events-auto cursor-pointer rounded-lg border border-wilds-gold/40 bg-wilds-950/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-wilds-gold-light shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(228,200,120,0.12)] backdrop-blur-sm transition-colors hover:border-wilds-gold/60 hover:bg-wilds-900/95 disabled:cursor-not-allowed disabled:border-wilds-gold/15 disabled:bg-wilds-950/70 disabled:text-wilds-muted/60 sm:text-xs"
            >
              {shufflesLeft > 0 ? `Shuffle (${shufflesLeft} left)` : 'No shuffles left'}
            </button>
          </div>
        </div>

        <KoiFateColumn fate="blessed" cards={blessedCards} onSelectCard={setSelectedCard} />
      </div>

      <KoiFateCardModal
        card={selectedCard}
        open={selectedCard !== null}
        onClose={() => setSelectedCard(null)}
      />
    </section>
  )
}

export default CurseModeSection
