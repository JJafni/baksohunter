import { useEffect, useRef, useState } from 'react'
import { KEY_ART_SLIDES } from '../data/keyArtUrls'

const SLIDE_DURATION_MS = 11_000
const FADE_DURATION_MS = 2_800

type KeyArtSlideshowProps = {
  className?: string
}

function KeyArtSlideshow({ className = '' }: KeyArtSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activationCounts, setActivationCounts] = useState<number[]>(() =>
    KEY_ART_SLIDES.map((_, index) => (index === 0 ? 1 : 0)),
  )
  const skipInitialActivationRef = useRef(true)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % KEY_ART_SLIDES.length)
    }, SLIDE_DURATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (skipInitialActivationRef.current) {
      skipInitialActivationRef.current = false
      return
    }

    setActivationCounts((counts) => {
      const next = [...counts]
      next[activeIndex] += 1
      return next
    })
  }, [activeIndex])

  return (
    <div className={`key-art-slideshow ${className}`.trim()} aria-hidden="true">
      {KEY_ART_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex
        const hasPlayed = activationCounts[index] > 0
        const panDirection = index % 2 === 0 ? 'ltr' : 'rtl'

        return (
          <div
            key={slide.url}
            className="key-art-slide-layer"
            data-active={isActive ? 'true' : 'false'}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
          >
            {hasPlayed ? (
              <img
                key={`${index}-${activationCounts[index]}`}
                src={slide.url}
                alt=""
                referrerPolicy="no-referrer"
                className={`key-art-slide-image key-art-slide-image--pan-${panDirection}`}
                style={{
                  animationDuration: `${SLIDE_DURATION_MS}ms`,
                  animationPlayState: isActive ? 'running' : 'paused',
                }}
                decoding="async"
                draggable={false}
              />
            ) : null}
          </div>
        )
      })}
      <div className="key-art-slideshow-vignette" />
      <div className="key-art-slideshow-scrim" />
    </div>
  )
}

export default KeyArtSlideshow
