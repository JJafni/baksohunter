import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { backgroundSlides, type BackgroundSlideDirection } from '../data/backgroundSlides'

const SLIDE_INTERVAL_MS = 14_000
const FADE_DURATION_S = 5
const PAN_DURATION_S = 24

const slideVariants = {
  initial: (direction: BackgroundSlideDirection) => ({
    opacity: 0,
    x: direction === 'left' ? '6%' : '-6%',
  }),
  animate: (direction: BackgroundSlideDirection) => ({
    opacity: 1,
    x: direction === 'left' ? '-6%' : '6%',
    transition: {
      opacity: { duration: FADE_DURATION_S, ease: 'easeInOut' as const },
      x: { duration: PAN_DURATION_S, ease: 'linear' as const },
    },
  }),
  exit: (direction: BackgroundSlideDirection) => ({
    opacity: 0,
    x: direction === 'left' ? '-10%' : '10%',
    transition: {
      opacity: { duration: FADE_DURATION_S, ease: 'easeInOut' as const },
      x: { duration: FADE_DURATION_S, ease: 'linear' as const },
    },
  }),
}

function BackgroundSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % backgroundSlides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  const slide = backgroundSlides[index]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          custom={slide.direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-[-12%] bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: `url(${slide.src})`, scale: 1.12 }}
        />
      </AnimatePresence>
    </div>
  )
}

export default BackgroundSlideshow
