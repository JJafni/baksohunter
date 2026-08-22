import type { CrateEntry } from '../data/types'
import { CARD_SIZE } from '../lib/crateConfig'
import { getVisualRarity, RARITY_CARD_TONE } from '../lib/rarityColors'

type CrateCardProps = {
  entry: CrateEntry
  winner?: boolean
  size?: number
  /** Icon-only card for full-section mobile reels. */
  compact?: boolean
}

function CrateCard({ entry, winner = false, size = CARD_SIZE, compact = false }: CrateCardProps) {
  const tone = RARITY_CARD_TONE[getVisualRarity(entry)]
  const iconSize = Math.round(size * (compact ? 0.78 : 0.58))

  if (compact) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center transition-transform ${
          winner ? 'z-20 scale-[1.04]' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <img
          src={entry.icon}
          alt={entry.name}
          loading="eager"
          decoding="sync"
          style={{ width: iconSize, height: iconSize }}
          className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.75)]"
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-lg border-2 bg-wilds-900/90 p-2.5 transition-transform ${tone.border} ${
        winner ? 'z-20 scale-[1.06]' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(201,162,77,0.35) 0px, rgba(201,162,77,0.35) 1px, transparent 1px, transparent 10px)',
        }}
      />
      <div className="relative flex flex-1 items-center justify-center">
        <img
          src={entry.icon}
          alt={entry.name}
          loading="eager"
          decoding="sync"
          style={{ width: iconSize, height: iconSize }}
          className="relative z-10 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
          draggable={false}
        />
      </div>
      <span
        className={`relative w-full truncate rounded border px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide ${tone.chip}`}
      >
        {entry.name}
      </span>
    </div>
  )
}

export default CrateCard
