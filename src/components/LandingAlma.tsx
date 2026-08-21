import { motion } from 'motion/react'
import almaRender from '../assets/landing/alma.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

const ENTRANCE_TRANSITION = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
}

function LandingAlma() {
  const { x, y } = useMouseParallax(0.05)
  const offsetX = x * 7
  const offsetY = y * 4

  return (
    <motion.div
      className="landing-alma"
      aria-hidden="true"
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ENTRANCE_TRANSITION, delay: 0.32 }}
    >
      <div
        className="landing-alma-inner"
        style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
      >
        <div className="landing-alma-frame">
          <img
            src={almaRender}
            alt=""
            className="landing-alma-image"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default LandingAlma
