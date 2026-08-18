import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { QUEST_TYPE_REVEAL_DELAY_MS } from '../lib/crateConfig'
import { QUEST_TYPE_BY_ID, type QuestType } from '../data/questTypes'

const BADGE_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

type QuestTypeBadgeProps = {
  questType: QuestType | null
  visible: boolean
  revealKey?: number
  variant?: 'overlay' | 'inline'
}

function QuestTypeBadge({
  questType,
  visible,
  revealKey = 0,
  variant = 'overlay',
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={BADGE_MOTION}
          className={isInline ? 'inline-flex shrink-0' : 'pointer-events-none absolute top-0 right-0 z-20'}
        >
          <div
            className={`flex items-center gap-1.5 rounded-sm border border-wilds-gold/20 bg-wilds-950/75 backdrop-blur-sm ${
              isInline ? 'px-1.5 py-0.5 sm:px-2 sm:py-1' : 'px-1.5 py-1 sm:px-2 sm:py-1.5'
            }`}
          >
            <img
              src={quest.icon}
              alt=""
              width={20}
              height={20}
              className={`shrink-0 object-contain ${isInline ? 'size-4 sm:size-[18px]' : 'size-5 sm:size-[22px]'}`}
              draggable={false}
            />
            <p
              className={`font-bold uppercase tracking-[0.16em] text-wilds-gold-light ${
                isInline ? 'text-[10px] sm:text-[11px]' : 'text-[11px] sm:text-xs'
              }`}
            >
              {quest.label}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default QuestTypeBadge
