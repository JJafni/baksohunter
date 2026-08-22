import { motion } from 'motion/react'
import type { CrateEntry } from '../data/types'
import { RARITY_BACKGROUND_GLOW, type VisualRarity } from '../lib/rarityColors'

type MobileHuntResultIconProps = {
  entry: CrateEntry
  visible: boolean
  visualRarity?: VisualRarity
  /** Larger icon for full-section mobile columns. */
  large?: boolean
}

const APPEAR_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

function MobileHuntResultIcon({
  entry,
  visible,
  visualRarity = 'normal',
  large = false,
}: MobileHuntResultIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={APPEAR_TRANSITION}
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
        className={
          large
            ? 'relative z-10 max-h-[min(52vw,42vh)] max-w-[min(70vw,88%)] object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.65)]'
            : 'relative z-10 size-36 object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.65)] sm:size-40'
        }
      />
    </motion.div>
  )
}

export default MobileHuntResultIcon
