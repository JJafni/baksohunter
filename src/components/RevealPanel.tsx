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
      className={`flex min-h-[5.5rem] w-[120px] shrink-0 items-center sm:w-[140px] ${
        align === 'right' ? 'justify-end text-right' : 'justify-start text-left'
      }`}
    >
      {show ? (
        <div className="animate-hunt-reveal-enter">
          <h2 className="text-xl font-black uppercase leading-tight tracking-tight text-white sm:text-2xl">
            {result.name}
          </h2>
          <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs ${RARITY_TEXT[result.rarity]}`}>
            {rarityLabels[result.rarity]}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
