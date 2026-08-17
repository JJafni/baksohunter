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
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden="true">
      <AnimatePresence mode="wait">
        {showBadge && quest ? (
          <motion.div
            key={`${quest.id}-${revealKey}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={BADGE_MOTION}
            className="absolute top-0 right-0"
          >
            <div className="flex items-center gap-1.5 rounded-sm border border-wilds-gold/20 bg-wilds-950/75 px-1.5 py-1 backdrop-blur-sm">
              <img
                src={quest.icon}
                alt=""
                width={16}
                height={16}
                className="block size-4 shrink-0 object-contain"
                draggable={false}
              />
              <p className="font-bold uppercase leading-none tracking-[0.16em] text-wilds-gold-light text-[10px] sm:text-[11px]">
                {quest.label}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default QuestTypeBadge
