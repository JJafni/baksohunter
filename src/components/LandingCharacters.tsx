import { motion } from 'motion/react'
import hunterFemale from '../assets/landing/hunter-female.webp'
import hunterMale from '../assets/landing/hunter-male.webp'
import { useMouseParallax } from '../hooks/useMouseParallax'

const ENTRANCE_TRANSITION = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
}

function LandingCharacters() {
  const { x, y } = useMouseParallax(0.05)
  const offsetX = x * 7
  const offsetY = y * 4

  return (
    <motion.div
      className="landing-characters"
      aria-hidden="true"
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ENTRANCE_TRANSITION, delay: 0.2 }}
    >
      <div
        className="landing-characters-inner"
        style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` }}
      >
        <div className="landing-character-frame landing-character-frame--male">
          <img
            src={hunterMale}
            alt=""
            className="landing-character landing-character--male"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="landing-character-frame landing-character-frame--female">
          <img
            src={hunterFemale}
            alt=""
            className="landing-character landing-character--female"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default LandingCharacters
