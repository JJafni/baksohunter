import type { CrateEntry, Rarity } from '../data/types'
import { AnimatePresence, motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'

const REVEAL_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  revealKey?: number
  rarityLabels: Record<Rarity, string>
  align?: 'left' | 'right' | 'center'
  variant?: 'desktop' | 'mobile'
}

const RARITY_TEXT = RARITY_TEXT_CLASS

function rarityLabelFor(entry: CrateEntry, rarityLabels: Record<Rarity, string>) {
  if (entry.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(entry.slug)) {
    return 'Elder Dragon'
  }
  return rarityLabels[entry.rarity]
}

function RevealPanel({
  result,
  visible,
  revealKey = 0,
  rarityLabels,
  align = 'left',
  variant = 'desktop',
}: RevealPanelProps) {
  const isMobile = variant === 'mobile'
  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  const nameSizeClassFor = (entry: CrateEntry) => {
    const isLongName = entry.name.length >= 8
    if (isMobile) {
      return isLongName ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
    }
    return isLongName ? 'text-3xl sm:text-4xl lg:text-[2.75rem]' : 'text-4xl sm:text-5xl lg:text-[3.25rem]'
  }

  const revealContent = (entry: CrateEntry) => (
    <>
      <h2
        className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClassFor(entry)}`}
      >
        {entry.name}
      </h2>
      <p
        className={`${isMobile ? 'mt-2 text-xs sm:text-sm' : 'mt-2.5 text-xs sm:text-sm'} font-bold uppercase tracking-[0.2em] ${RARITY_TEXT[getVisualRarity(entry)]}`}
      >
        {rarityLabelFor(entry, rarityLabels)}
      </p>
    </>
  )

  return (
    <div
      className={`flex shrink-0 flex-col justify-center ${
        isMobile
          ? `h-full w-full px-2 ${alignClass}`
          : `min-h-[4rem] sm:min-h-[6rem] ${align === 'center' ? 'w-full max-w-[620px]' : 'w-[150px] sm:w-[185px]'} ${alignClass}`
      }`}
    >
      {isMobile ? (
        <AnimatePresence mode="wait">
          {visible && result ? (
            <motion.div
              key={`${result.slug}-${revealKey}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={REVEAL_MOTION}
              className={`w-full ${alignClass} flex flex-col`}
            >
              {revealContent(result)}
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : visible && result ? (
        <div className="animate-hunt-reveal-enter">{revealContent(result)}</div>
      ) : null}
    </div>
  )
}

export default RevealPanel
