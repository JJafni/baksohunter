import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { KEY_ART_SLIDES } from '../data/keyArtUrls'

const SLIDE_DURATION_MS = 11_000
const FADE_DURATION_S = 2.8

type KeyArtSlideshowProps = {
  className?: string
}

function KeyArtSlideshow({ className = '' }: KeyArtSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % KEY_ART_SLIDES.length)
    }, SLIDE_DURATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  const slide = KEY_ART_SLIDES[activeIndex]

  return (
    <div className={`key-art-slideshow ${className}`.trim()} aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION_S, ease: 'easeInOut' }}
          className="key-art-slide-layer"
        >
          <img
            src={slide.url}
            alt=""
            className="key-art-slide-image key-art-slide-image--pan"
            style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
            decoding="async"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
      <div className="key-art-slideshow-vignette" />
      <div className="key-art-slideshow-scrim" />
    </div>
  )
}

export default KeyArtSlideshow
