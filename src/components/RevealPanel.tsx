import { useEffect, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { getMonsterInfo } from '../data/monsterInfo'
import { AnimatePresence, motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'
import MonsterInfoModal from './MonsterInfoModal'

const REVEAL_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

type RevealPanelProps = {
  result: CrateEntry | null
  visible: boolean
  revealKey?: number
  rarityLabels: Record<Rarity, string>
  align?: 'left' | 'right' | 'center'
  variant?: 'desktop' | 'mobile'
  showMonsterInfo?: boolean
}

const RARITY_TEXT = RARITY_TEXT_CLASS

function rarityLabelFor(entry: CrateEntry, rarityLabels: Record<Rarity, string>) {
  if (entry.rarity === 'normal' && ELDER_DRAGON_SLUGS.has(entry.slug)) {
    return 'Elder Dragon'
  }
  return rarityLabels[entry.rarity]
}

function MonsterInfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="View monster info"
      onClick={onClick}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-wilds-gold/30 bg-wilds-850/80 text-wilds-gold-light transition hover:border-wilds-gold/50 hover:bg-wilds-800 hover:text-wilds-parchment sm:size-8"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5 sm:size-4">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          fill="currentColor"
          d="M9.2 8.4h1.6V14H9.2V8.4zm0-2.4h1.6V6H9.2V3.6z"
        />
      </svg>
    </button>
  )
}

function RevealPanel({
  result,
  visible,
  revealKey = 0,
  rarityLabels,
  align = 'left',
  variant = 'desktop',
  showMonsterInfo = false,
}: RevealPanelProps) {
  const [infoOpen, setInfoOpen] = useState(false)
  const isMobile = variant === 'mobile'
  const monsterInfo = result && showMonsterInfo ? getMonsterInfo(result.slug) : undefined

  useEffect(() => {
    setInfoOpen(false)
  }, [revealKey, result?.slug])

  const alignClass =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  const nameRowClass =
    align === 'center'
      ? 'justify-center'
      : align === 'right'
        ? 'justify-end'
        : 'justify-start'

  const nameSizeClassFor = (entry: CrateEntry) => {
    const isLongName = entry.name.length >= 8
    if (isMobile) {
      return isLongName ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
    }
    return isLongName ? 'text-3xl sm:text-4xl lg:text-[2.75rem]' : 'text-4xl sm:text-5xl lg:text-[3.25rem]'
  }

  const revealContent = (entry: CrateEntry) => (
    <>
      <div className={`flex items-center gap-2 ${nameRowClass}`}>
        {monsterInfo ? <MonsterInfoButton onClick={() => setInfoOpen(true)} /> : null}
        <h2
          className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClassFor(entry)}`}
        >
          {entry.name}
        </h2>
      </div>
      <p
        className={`${isMobile ? 'mt-2 text-xs sm:text-sm' : 'mt-2.5 text-xs sm:text-sm'} font-bold uppercase tracking-[0.2em] ${RARITY_TEXT[getVisualRarity(entry)]}`}
      >
        {rarityLabelFor(entry, rarityLabels)}
      </p>
      {monsterInfo ? (
        <MonsterInfoModal info={monsterInfo} open={infoOpen} onClose={() => setInfoOpen(false)} />
      ) : null}
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
