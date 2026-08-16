import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { backgroundSlides } from '../data/backgroundSlides'

const SLIDE_INTERVAL_MS = 18_000
const FADE_DURATION_S = 5

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
          className={`absolute inset-[-12%] bg-cover bg-center bg-no-repeat will-change-transform ${
            slide.direction === 'left' ? 'animate-bg-pan-left' : 'animate-bg-pan-right'
          }`}
          style={{ backgroundImage: `url(${slide.src})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION_S, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  )
}

export default BackgroundSlideshow
