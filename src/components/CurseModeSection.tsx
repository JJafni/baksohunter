import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  type KoiCardId,
  type KoiFate,
  type ResolvedKoiCard,
  getKoiAccent,
  getKoiFateFromDirection,
  getKoiFateFromDrag,
  isKoiDragPayload,
  isKoiDropPayload,
} from '../lib/koiCurseBridge'
import { cn } from '../lib/utils'
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
        'pointer-events-none absolute inset-y-0 z-20 flex w-[min(28%,9rem)] items-center justify-center transition-opacity duration-200',
        isCursed ? 'left-0 bg-gradient-to-r from-red-950/70 to-transparent' : 'right-0 bg-gradient-to-l from-amber-950/55 to-transparent',
        active ? 'opacity-100' : 'opacity-35',
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          'filter-section-label [writing-mode:vertical-rl] rotate-180',
          isCursed ? 'text-red-300/90' : 'text-wilds-gold-light/90',
          active && (isCursed ? 'text-red-200' : 'text-wilds-gold-light'),
        )}
      >
        {isCursed ? 'Cursed' : 'Blessed'}
      </span>
    </div>
  )
}

function CurseModeSection({ className, style }: CurseModeSectionProps) {
  const koiContainerRef = useRef<HTMLDivElement>(null)
  const [activeFate, setActiveFate] = useState<KoiFate | null>(null)
  const [resolvedCards, setResolvedCards] = useState<ResolvedKoiCard[]>([])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data

      if (isKoiDragPayload(data)) {
        setActiveFate(getKoiFateFromDrag(data.dx, data.dy))
        return
      }

      if (!isKoiDropPayload(data)) return

      setActiveFate(null)

      const fate = getKoiFateFromDirection(data.committedDirection)
      if (!fate) return

      const cardId = data.cardId as KoiCardId
      setResolvedCards(prev => [
        ...prev,
        {
          key: `${fate}-${cardId}-${Date.now()}`,
          id: cardId,
          name: data.cardName,
          fate,
        },
      ])
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const recentCursed = resolvedCards.filter(card => card.fate === 'cursed').slice(-3)
  const recentBlessed = resolvedCards.filter(card => card.fate === 'blessed').slice(-3)

  return (
    <section
      className={cn(
        'relative flex min-h-0 flex-col border-t border-wilds-gold/15 bg-[#10100e]',
        className,
      )}
      style={style}
      aria-label="Curse mode"
    >
      <div className="flex shrink-0 flex-col items-center justify-center gap-1 border-b border-wilds-gold/10 bg-wilds-950/80 px-4 py-2.5 backdrop-blur-sm">
        <h2 className="filter-section-label">Curse Mode</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-wilds-muted sm:text-xs">
          Drag each koi left or right — you must choose cursed or blessed
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <FateHint side="cursed" active={activeFate === 'cursed'} />
        <FateHint side="blessed" active={activeFate === 'blessed'} />

        <KoiStudiesPanel ref={koiContainerRef} className="absolute inset-0 h-full w-full" />

        {(recentCursed.length > 0 || recentBlessed.length > 0) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-end justify-between gap-3 px-4">
            <ul className="flex max-w-[45%] flex-wrap gap-1.5">
              {recentCursed.map(card => (
                <li
                  key={card.key}
                  className="rounded border border-red-400/25 bg-wilds-950/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-red-100/90 backdrop-blur-sm"
                  style={{ boxShadow: `inset 0 0 0 1px ${getKoiAccent(card.id)}33` }}
                >
                  {card.name}
                </li>
              ))}
            </ul>
            <ul className="flex max-w-[45%] flex-wrap justify-end gap-1.5">
              {recentBlessed.map(card => (
                <li
                  key={card.key}
                  className="rounded border border-wilds-gold/25 bg-wilds-950/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-wilds-gold-light/90 backdrop-blur-sm"
                  style={{ boxShadow: `inset 0 0 0 1px ${getKoiAccent(card.id)}33` }}
                >
                  {card.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default CurseModeSection
