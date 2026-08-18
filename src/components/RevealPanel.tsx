import { useEffect, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { getMonsterInfo } from '../data/monsterInfo'
import { AnimatePresence, motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getMonsterTitleUpdateLabel } from '../data/monsterTitleUpdates'
import { formatHuntStar, type HuntStar } from '../data/huntStars'
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
  layout?: 'stacked' | 'inline'
  showMonsterInfo?: boolean
  huntStar?: HuntStar | null
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
  layout = 'stacked',
  showMonsterInfo = false,
  huntStar = null,
}: RevealPanelProps) {
  const [infoOpen, setInfoOpen] = useState(false)
  const isMobile = variant === 'mobile'
  const useInlineLayout = layout === 'inline'
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
      return isLongName ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
    }
    return isLongName ? 'text-4xl sm:text-5xl lg:text-[3rem]' : 'text-5xl sm:text-6xl lg:text-[3.75rem]'
  }

  const inlineNameSizeClassFor = (entry: CrateEntry) => {
    const isLongName = entry.name.length >= 10
    if (isMobile) {
      return isLongName ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
    }
    return isLongName ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-6xl lg:text-7xl'
  }

  const revealContent = (entry: CrateEntry) => {
    const titleUpdateLabel = showMonsterInfo ? getMonsterTitleUpdateLabel(entry.slug) : null
    const rarityLabel = rarityLabelFor(entry, rarityLabels)
    const visualRarity = getVisualRarity(entry)

    if (useInlineLayout) {
      return (
        <div className="wilds-legibility-text flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          {monsterInfo ? <MonsterInfoButton onClick={() => setInfoOpen(true)} /> : null}
          <h2
            className={`font-black uppercase leading-none tracking-tight text-wilds-parchment ${inlineNameSizeClassFor(entry)}`}
          >
            {entry.name}
          </h2>
          {titleUpdateLabel ? (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.24em] text-wilds-gold-light/90 sm:text-[10px]">
              {titleUpdateLabel}
            </span>
          ) : null}
          {huntStar ? (
            <>
              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] sm:text-sm ${RARITY_TEXT[visualRarity]}`}
              >
                {rarityLabel}
              </p>
              <p className="text-base font-black tracking-[0.08em] text-wilds-gold-light sm:text-lg">
                {formatHuntStar(huntStar)}
              </p>
            </>
          ) : (
            <p
              className={`text-xs font-bold uppercase tracking-[0.18em] sm:text-sm ${RARITY_TEXT[visualRarity]}`}
            >
              {rarityLabel}
            </p>
          )}
          {monsterInfo ? (
            <MonsterInfoModal
              info={monsterInfo}
              icon={entry.icon}
              open={infoOpen}
              onClose={() => setInfoOpen(false)}
            />
          ) : null}
        </div>
      )
    }

    if (isMobile) {
      return (
        <div className="wilds-legibility-text flex flex-col items-center gap-1.5 text-center">
          <div className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 ${nameRowClass}`}>
            {monsterInfo ? (
              <MonsterInfoButton onClick={() => setInfoOpen(true)} />
            ) : null}
            <h2
              className={`font-black uppercase leading-none tracking-tight text-wilds-parchment ${nameSizeClassFor(entry)}`}
            >
              {entry.name}
            </h2>
            {titleUpdateLabel ? (
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.24em] text-wilds-gold-light/90 sm:text-[10px]">
                {titleUpdateLabel}
              </span>
            ) : null}
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 ${nameRowClass}`}>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs ${RARITY_TEXT[visualRarity]}`}
            >
              {rarityLabel}
            </p>
            {huntStar ? (
              <p className="text-sm font-black tracking-[0.08em] text-wilds-gold-light sm:text-base">
                {formatHuntStar(huntStar)}
              </p>
            ) : null}
          </div>
          {monsterInfo ? (
            <MonsterInfoModal
              info={monsterInfo}
              icon={entry.icon}
              open={infoOpen}
              onClose={() => setInfoOpen(false)}
            />
          ) : null}
        </div>
      )
    }

    return (
      <div className="wilds-legibility-text">
        <div className={`flex items-center gap-2 ${nameRowClass}`}>
          {monsterInfo ? <MonsterInfoButton onClick={() => setInfoOpen(true)} /> : null}
          <div className="flex items-center gap-2">
            <h2
              className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameSizeClassFor(entry)}`}
            >
              {entry.name}
            </h2>
            {titleUpdateLabel ? (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-wilds-gold-light/90 sm:text-xs">
                {titleUpdateLabel}
              </span>
            ) : null}
          </div>
        </div>
        <div className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 ${nameRowClass}`}>
          <p
            className={`text-sm font-bold uppercase tracking-[0.2em] sm:text-base ${RARITY_TEXT[visualRarity]}`}
          >
            {rarityLabel}
          </p>
          {huntStar ? (
            <p className="text-base font-black tracking-[0.08em] text-wilds-gold-light sm:text-lg">
              {formatHuntStar(huntStar)}
            </p>
          ) : null}
        </div>
        {monsterInfo ? (
          <MonsterInfoModal
            info={monsterInfo}
            icon={entry.icon}
            open={infoOpen}
            onClose={() => setInfoOpen(false)}
          />
        ) : null}
      </div>
    )
  }

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
              className={`w-full ${alignClass}`}
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
