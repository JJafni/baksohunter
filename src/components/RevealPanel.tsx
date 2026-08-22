import { useEffect, useState } from 'react'
import type { CrateEntry, Rarity } from '../data/types'
import { getMonsterInfo } from '../data/monsterInfo'
import { AnimatePresence, motion } from 'motion/react'
import { ELDER_DRAGON_SLUGS } from '../data/monsters'
import { getMonsterTitleUpdateLabel } from '../data/monsterTitleUpdates'
import { formatHuntStar, type HuntStar } from '../data/huntStars'
import { getVisualRarity, RARITY_TEXT_CLASS } from '../lib/rarityColors'
import MonsterInfoModal from './MonsterInfoModal'
import QuestTypeBadge from './QuestTypeBadge'
import type { QuestType } from '../data/questTypes'

const REVEAL_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }
const METADATA_LAYOUT_MOTION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

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
  questType?: QuestType | null
  questTypeVisible?: boolean
  /** When set, replaces the entry name on reveal (e.g. specific monster weapon). */
  nameOverride?: string | null
  /** Show eye toggle beside monster type metadata (monster overlay hunts). */
  showImmersiveToggle?: boolean
  onHideOverlayChrome?: () => void
  /** Tighter mobile overlay layout — smaller type, no full-height stretch. */
  compact?: boolean
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
      className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-wilds-gold/30 bg-wilds-850/80 text-wilds-gold-light transition hover:border-wilds-gold/50 hover:bg-wilds-800 hover:text-wilds-parchment sm:size-8"
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

function ImmersiveHideButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Hide controls for full image view"
      onClick={onClick}
      className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-wilds-gold/30 bg-wilds-850/80 text-wilds-gold-light transition hover:border-wilds-gold/50 hover:bg-wilds-800 hover:text-wilds-parchment sm:size-8"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-3.5 sm:size-4">
        <path
          d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.25" fill="currentColor" />
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
  questType = null,
  questTypeVisible = false,
  nameOverride = null,
  showImmersiveToggle = false,
  onHideOverlayChrome,
  compact = false,
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
    const label = nameOverride ?? entry.name
    const isLongName = label.length >= 8
    if (compact) {
      return isLongName ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
    }
    if (isMobile) {
      return isLongName ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
    }
    return isLongName ? 'text-4xl sm:text-5xl lg:text-[3rem]' : 'text-5xl sm:text-6xl lg:text-[3.75rem]'
  }

  const inlineNameSizeClassFor = (entry: CrateEntry) => {
    const label = nameOverride ?? entry.name
    const isLongName = label.length >= 10
    if (compact) {
      return isLongName ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
    }
    if (isMobile) {
      return isLongName ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
    }
    return isLongName ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-6xl lg:text-7xl'
  }

  const metadataRow = (visualRarity: ReturnType<typeof getVisualRarity>, rarityLabel: string) => (
    <motion.div
      layout
      transition={METADATA_LAYOUT_MOTION}
      className={`inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 ${nameRowClass}`}
    >
      {questType ? (
        <QuestTypeBadge
          questType={questType}
          visible={questTypeVisible}
          revealKey={revealKey}
          variant="inline"
          iconOnly={isMobile}
        />
      ) : null}
      <motion.span layout transition={METADATA_LAYOUT_MOTION} className="inline-flex items-center gap-x-1.5">
        {rarityLabel ? (
          <span
            className={`font-bold uppercase tracking-[0.14em] ${isMobile ? 'text-[10px] sm:text-xs' : 'text-sm sm:text-base'} ${RARITY_TEXT[visualRarity]}`}
          >
            {rarityLabel}
          </span>
        ) : null}
        {huntStar ? (
          <span
            className={`font-black tracking-[0.08em] text-wilds-gold-light ${isMobile ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
          >
            {formatHuntStar(huntStar)}
          </span>
        ) : null}
        {showImmersiveToggle && onHideOverlayChrome ? (
          <ImmersiveHideButton onClick={onHideOverlayChrome} />
        ) : null}
      </motion.span>
    </motion.div>
  )

  const nameRow = (entry: CrateEntry, titleUpdateLabel: string | null, nameClass: string) => {
    const displayName = nameOverride ?? entry.name
    const showWeaponIcon = useInlineLayout && !showMonsterInfo

    return (
    <div className={`inline-flex max-w-full items-center gap-2 sm:gap-3 ${nameRowClass}`}>
      {monsterInfo ? <MonsterInfoButton onClick={() => setInfoOpen(true)} /> : null}
      {showWeaponIcon ? (
        <img
          src={entry.icon}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={`shrink-0 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] ${
            isMobile ? 'size-12 sm:size-14' : 'size-12 sm:size-14 lg:size-16'
          }`}
        />
      ) : null}
      <h2
        className={`font-black uppercase leading-[0.95] tracking-tight text-wilds-parchment ${nameClass}`}
      >
        {displayName}
      </h2>
      {titleUpdateLabel ? (
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.24em] text-wilds-gold-light/90 sm:text-[10px]">
          {titleUpdateLabel}
        </span>
      ) : null}
    </div>
    )
  }

  const revealContent = (entry: CrateEntry) => {
    const titleUpdateLabel = showMonsterInfo ? getMonsterTitleUpdateLabel(entry.slug) : null
    const rarityLabel = rarityLabelFor(entry, rarityLabels)
    const visualRarity = getVisualRarity(entry)
    const hasMetadata = Boolean(questType || huntStar || rarityLabel)

    if (useInlineLayout) {
      return (
        <div className="wilds-legibility-text flex flex-col items-center gap-1.5 text-center">
          {nameRow(entry, titleUpdateLabel, inlineNameSizeClassFor(entry))}
          {hasMetadata ? metadataRow(visualRarity, rarityLabel) : null}
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
        <div className={`wilds-legibility-text flex flex-col items-center text-center ${compact ? 'gap-1' : 'gap-1.5'}`}>
          {nameRow(entry, titleUpdateLabel, nameSizeClassFor(entry))}
          {hasMetadata ? metadataRow(visualRarity, rarityLabel) : null}
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
        {nameRow(entry, titleUpdateLabel, nameSizeClassFor(entry))}
        {hasMetadata ? <div className="mt-2">{metadataRow(visualRarity, rarityLabel)}</div> : null}
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
          ? `w-full px-2 ${compact ? 'py-0' : 'h-full px-2'} ${alignClass}`
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
