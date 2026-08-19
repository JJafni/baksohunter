import { motion } from 'motion/react'
import { WILDS_BACKDROP_OVERLAY } from '../lib/wildsTheme'

function GalleryBackdropOverlay({
  revealed,
  emphasized,
}: {
  revealed: boolean
  emphasized: boolean
}) {
  const opacity = !revealed ? 1 : emphasized ? 1 : 0.45

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-[1] ${WILDS_BACKDROP_OVERLAY}`}
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    />
  )
}

export default GalleryBackdropOverlay
