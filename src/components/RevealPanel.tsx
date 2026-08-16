import type { CrateEntry, Rarity } from '../data/types'
import { motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'

const REVEAL_FADE = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

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
  const isLongName = show && result.name.length >= 8
  const nameSizeClass = isMobile
    ? isLongName
      ? 'text-2xl sm:text-3xl'
      : 'text-3xl sm:text-4xl'
    : isLongName
      ? 'text-3xl sm:text-4xl lg:text-[2.75rem]'
      : 'text-4xl sm:text-5xl lg:text-[3.25rem]'
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
          ? `h-full w-full px-2 ${alignClass}`
          : `min-h-[4rem] sm:min-h-[6rem] ${align === 'center' ? 'w-full max-w-[620px]' : 'w-[150px] sm:w-[185px]'} ${alignClass}`
      }`}
    >
      {isMobile ? (
        <motion.div
          initial={false}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
          transition={REVEAL_FADE}
          className={`w-full ${alignClass} flex flex-col`}
        >
          {result ? (
            <>
              <h2
                className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClass}`}
              >
                {result.name}
              </h2>
              <p
                className={`mt-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${RARITY_TEXT[getVisualRarity(result)]}`}
              >
                {rarityLabel}
              </p>
            </>
          ) : null}
        </motion.div>
      ) : show ? (
        <div className="animate-hunt-reveal-enter">
          <h2
            className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClass}`}
          >
            {result.name}
          </h2>
          <p
            className={`mt-2.5 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${RARITY_TEXT[getVisualRarity(result)]}`}
          >
            {rarityLabel}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
