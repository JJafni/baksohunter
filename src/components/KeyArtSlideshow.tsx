import { useEffect, useState } from 'react'
import { KEY_ART_SLIDES } from '../data/keyArtUrls'

const SLIDE_DURATION_MS = 11_000
const FADE_DURATION_MS = 2_800

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

  return (
    <div className={`key-art-slideshow ${className}`.trim()} aria-hidden="true">
      {KEY_ART_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <div
            key={slide.url}
            className="key-art-slide-layer"
            data-active={isActive ? 'true' : 'false'}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
          >
            <img
              src={slide.url}
              alt=""
              referrerPolicy="no-referrer"
              className={`key-art-slide-image ${isActive ? 'key-art-slide-image--pan' : ''}`}
              style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
              decoding="async"
              draggable={false}
            />
          </div>
        )
      })}
      <div className="key-art-slideshow-vignette" />
      <div className="key-art-slideshow-scrim" />
    </div>
  )
}

export default KeyArtSlideshow
