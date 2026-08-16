import type { CrateEntry, Rarity } from '../data/types'

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  rarityLabels: Record<Rarity, string>
  align?: 'left' | 'right' | 'center'
}

const RARITY_TEXT: Record<Rarity, string> = {
  normal: 'text-sky-400',
  tempered: 'text-rose-400',
  'arch-tempered': 'text-amber-400',
}

function RevealPanel({ result, visible, rarityLabels, align = 'left' }: RevealPanelProps) {
  const show = visible && result !== null
  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  return (
    <div
      className={`flex min-h-[4rem] shrink-0 flex-col justify-center sm:min-h-[6rem] ${
        align === 'center' ? 'w-full max-w-[620px]' : 'w-[150px] sm:w-[185px]'
      } ${alignClass}`}
    >
      {show ? (
        <div className="animate-hunt-reveal-enter">
          <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {result.name}
          </h2>
          <p className={`mt-2.5 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${RARITY_TEXT[result.rarity]}`}>
            {rarityLabels[result.rarity]}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
