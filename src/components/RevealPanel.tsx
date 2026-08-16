import type { CrateEntry, Rarity } from '../data/types'

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  rarityLabels: Record<Rarity, string>
}

const RARITY_TEXT: Record<Rarity, string> = {
  normal: 'text-sky-400',
  tempered: 'text-rose-400',
  'arch-tempered': 'text-amber-400',
}

function RevealPanel({ result, visible, rarityLabels }: RevealPanelProps) {
  const show = visible && result !== null

  return (
    <div className="flex min-h-[5.5rem] w-full max-w-[320px] items-center justify-center text-center">
      {show ? (
        <div className="animate-hunt-reveal-enter">
          <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
            {result.name}
          </h2>
          <p className={`mt-2 text-sm font-bold uppercase tracking-[0.25em] ${RARITY_TEXT[result.rarity]}`}>
            {rarityLabels[result.rarity]}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
