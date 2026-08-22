import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { QUEST_TYPE_REVEAL_DELAY_MS } from '../lib/crateConfig'
import { QUEST_TYPE_BY_ID, type QuestType } from '../data/questTypes'

const BADGE_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }
const INLINE_BADGE_MOTION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

type QuestTypeBadgeProps = {
  questType: QuestType | null
  visible: boolean
  revealKey?: number
  variant?: 'overlay' | 'inline'
  /** When true, show only the quest icon (mobile space saving). */
  iconOnly?: boolean
}

function QuestTypeBadge({
  questType,
  visible,
  revealKey = 0,
  variant = 'overlay',
  iconOnly = false,
}: QuestTypeBadgeProps) {
  const [showBadge, setShowBadge] = useState(false)
  const quest = questType ? QUEST_TYPE_BY_ID[questType] : null
  const isInline = variant === 'inline'

  useEffect(() => {
    if (!visible || !questType) {
      setShowBadge(false)
      return
    }

    setShowBadge(false)
    const timer = window.setTimeout(() => setShowBadge(true), QUEST_TYPE_REVEAL_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [visible, questType, revealKey])

  return (
    <AnimatePresence mode="wait">
      {showBadge && quest ? (
        <motion.div
          key={`${quest.id}-${revealKey}`}
          initial={
            isInline
              ? { width: 0, opacity: 0, marginRight: 0 }
              : { opacity: 0, scale: 0.92 }
          }
          animate={
            isInline
              ? { width: 'auto', opacity: 1, marginRight: 8 }
              : { opacity: 1, scale: 1 }
          }
          exit={
            isInline
              ? { width: 0, opacity: 0, marginRight: 0 }
              : { opacity: 0, scale: 0.92 }
          }
          transition={isInline ? INLINE_BADGE_MOTION : BADGE_MOTION}
          className={
            isInline
              ? 'inline-flex shrink-0 overflow-hidden'
              : 'pointer-events-none absolute top-2 right-2 z-20'
          }
        >
          <div
            className={`flex items-center whitespace-nowrap rounded-sm border border-wilds-gold/20 bg-wilds-950/75 backdrop-blur-sm ${
              iconOnly
                ? 'p-1'
                : `gap-1.5 ${isInline ? 'px-2 py-1 sm:px-2.5 sm:py-1' : 'px-1.5 py-1 sm:px-2 sm:py-1.5'}`
            }`}
          >
            <img
              src={quest.icon}
              alt={iconOnly ? quest.label : ''}
              width={20}
              height={20}
              className={`shrink-0 object-contain ${iconOnly ? 'size-5' : isInline ? 'size-[18px] sm:size-5' : 'size-5 sm:size-[22px]'}`}
              draggable={false}
            />
            {iconOnly ? null : (
              <p
                className={`font-bold uppercase tracking-[0.16em] text-wilds-gold-light ${
                  isInline ? 'text-[11px] sm:text-xs' : 'text-[11px] sm:text-xs'
                }`}
              >
                {quest.label}
              </p>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default QuestTypeBadge
