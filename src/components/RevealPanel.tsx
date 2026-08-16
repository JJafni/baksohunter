import type { CrateEntry, Rarity } from '../data/types'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  rarityLabels: Record<Rarity, string>
  align?: 'left' | 'right' | 'center'
  variant?: 'desktop' | 'mobile'
}

const RARITY_TEXT = RARITY_TEXT_CLASS

function RevealPanel({
  result,
  visible,
  rarityLabels,
  align = 'left',
  variant = 'desktop',
}: RevealPanelProps) {
  const show = visible && result !== null
  const rarityLabel =
    show && result.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(result.slug)
      ? 'Elder Dragon'
      : show
        ? rarityLabels[result.rarity]
        : ''
  const isMobile = variant === 'mobile'
  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  return (
    <div
      className={`flex shrink-0 flex-col justify-center ${
        isMobile
          ? 'w-full px-2 py-1'
          : `min-h-[4rem] sm:min-h-[6rem] ${align === 'center' ? 'w-full max-w-[620px]' : 'w-[150px] sm:w-[185px]'}`
      } ${alignClass}`}
    >
      {show ? (
        <div className={isMobile ? 'animate-hunt-reveal-enter-mobile' : 'animate-hunt-reveal-enter'}>
          <h2
            className={`font-black uppercase leading-[0.95] tracking-tight text-white ${
              isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem]'
            }`}
          >
            {result.name}
          </h2>
          <p
            className={`mt-2 font-bold uppercase tracking-[0.2em] ${isMobile ? 'text-[11px]' : 'mt-2.5 text-xs sm:text-sm'} ${RARITY_TEXT[getVisualRarity(result)]}`}
          >
            {rarityLabel}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
