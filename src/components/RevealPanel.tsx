import type { CrateEntry, Rarity } from '../data/types'

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  rarityLabels: Record<Rarity, string>
  reelSide: 'left' | 'right'
}

const RARITY_TEXT: Record<Rarity, string> = {
  normal: 'text-sky-400',
  tempered: 'text-rose-400',
  'arch-tempered': 'text-amber-400',
}

const SHORT_NAME_MAX_LEN = 12

function isShortName(name: string): boolean {
  return name.length <= SHORT_NAME_MAX_LEN
}

function revealAlign(reelSide: 'left' | 'right', name: string): 'left' | 'right' {
  const short = isShortName(name)
  if (reelSide === 'left') {
    return short ? 'right' : 'left'
  }
  return short ? 'left' : 'right'
}

function RevealPanel({ result, visible, rarityLabels, reelSide }: RevealPanelProps) {
  const show = visible && result !== null
  const align = result ? revealAlign(reelSide, result.name) : reelSide === 'left' ? 'left' : 'right'
  const compact = show && isShortName(result.name)

  return (
    <div
      className={`flex min-h-[6rem] shrink-0 flex-col justify-center ${
        compact ? 'w-auto' : 'w-[140px] sm:w-[170px]'
      } ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
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
