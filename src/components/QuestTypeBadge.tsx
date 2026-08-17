import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { QUEST_TYPE_REVEAL_DELAY_MS } from '../lib/crateConfig'
import { QUEST_TYPE_BY_ID, type QuestType } from '../data/questTypes'

const BADGE_MOTION = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

type QuestTypeBadgeProps = {
  questType: QuestType | null
  visible: boolean
  revealKey?: number
}

function QuestTypeBadge({ questType, visible, revealKey = 0 }: QuestTypeBadgeProps) {
  const [showBadge, setShowBadge] = useState(false)
  const quest = questType ? QUEST_TYPE_BY_ID[questType] : null

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
          className="pointer-events-none absolute top-0 right-0 z-20"
        >
          <div className="flex items-center gap-2 rounded-sm border border-wilds-gold/20 bg-wilds-950/75 px-2 py-1.5 backdrop-blur-sm sm:px-2.5 sm:py-2">
            <img
              src={quest.icon}
              alt=""
              width={28}
              height={28}
              className="size-6 shrink-0 object-contain sm:size-7"
              draggable={false}
            />
            <p className="font-bold uppercase tracking-[0.18em] text-wilds-gold-light text-xs sm:text-sm">
              {quest.label}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default QuestTypeBadge
