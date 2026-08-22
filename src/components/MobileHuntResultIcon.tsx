import { motion } from 'motion/react'
import type { CrateEntry } from '../data/types'
import { RARITY_BACKGROUND_GLOW, type VisualRarity } from '../lib/rarityColors'

type MobileHuntResultIconProps = {
  entry: CrateEntry
  visible: boolean
  visualRarity?: VisualRarity
}

function MobileHuntResultIcon({ entry, visible, visualRarity = 'normal' }: MobileHuntResultIconProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative flex items-center justify-center"
      aria-hidden={!visible}
    >
      <div
        className="pointer-events-none absolute inset-0 scale-150 opacity-70 blur-2xl"
        style={{ background: RARITY_BACKGROUND_GLOW[visualRarity] }}
        aria-hidden="true"
      />
      <img
        src={entry.icon}
        alt=""
        draggable={false}
        className="relative z-10 size-36 object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.65)] sm:size-40"
      />
    </motion.div>
  )
}

export default MobileHuntResultIcon
