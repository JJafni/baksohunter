import type { CrateEntry, Rarity } from '../data/types'

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  rarityLabels: Record<Rarity, string>
  align?: 'left' | 'right'
}

const RARITY_TEXT: Record<Rarity, string> = {
  normal: 'text-sky-400',
  tempered: 'text-rose-400',
  'arch-tempered': 'text-amber-400',
}

function RevealPanel({ result, visible, rarityLabels, align = 'left' }: RevealPanelProps) {
  const show = visible && result !== null

  return (
    <div
      className={`flex min-h-[5.5rem] min-w-0 flex-1 max-w-[220px] items-center ${
        align === 'right' ? 'justify-end text-right' : 'justify-start text-left'
      }`}
    >
      {show ? (
        <div className="animate-hunt-reveal-enter">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
            {result.name}
          </h2>
          <p className={`mt-2 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm ${RARITY_TEXT[result.rarity]}`}>
            {rarityLabels[result.rarity]}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
