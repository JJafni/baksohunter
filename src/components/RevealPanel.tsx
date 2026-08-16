import type { CrateEntry, Rarity } from '../data/types'
import { motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { useRevealDisplayResult } from '../hooks/useRevealDisplayResult'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'

const REVEAL_FADE_IN = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
const REVEAL_FADE_OUT = { duration: 0, ease: 'linear' as const }

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
  const displayedResult = useRevealDisplayResult(result, visible)
  const show = visible && displayedResult !== null
  const rarityLabel =
    show && displayedResult.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(displayedResult.slug)
      ? 'Elder Dragon'
      : show
        ? rarityLabels[displayedResult.rarity]
        : ''
  const isMobile = variant === 'mobile'
  const isLongName = show && displayedResult.name.length >= 8
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
          transition={show ? REVEAL_FADE_IN : REVEAL_FADE_OUT}
          className={`w-full ${alignClass} flex flex-col`}
        >
          {show && displayedResult ? (
            <>
              <h2
                className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClass}`}
              >
                {displayedResult.name}
              </h2>
              <p
                className={`mt-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${RARITY_TEXT[getVisualRarity(displayedResult)]}`}
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
            {displayedResult.name}
          </h2>
          <p
            className={`mt-2.5 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm ${RARITY_TEXT[getVisualRarity(displayedResult)]}`}
          >
            {rarityLabel}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default RevealPanel
