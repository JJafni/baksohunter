import { useEffect, useState } from 'react'
import { KEY_ART_SLIDES } from '../data/keyArtUrls'

const SLIDE_DURATION_MS = 11_000
const FADE_DURATION_MS = 2_800

type KeyArtSlideshowProps = {
  className?: string
}

function KeyArtSlideshow({ className = '' }: KeyArtSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [fadeKey, setFadeKey] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current)
        setFadeKey((key) => key + 1)
        return (current + 1) % KEY_ART_SLIDES.length
      })
    }, SLIDE_DURATION_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (previousIndex === null) return

    const timer = window.setTimeout(() => {
      setPreviousIndex(null)
    }, FADE_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [previousIndex, fadeKey])

  const slidesToRender =
    previousIndex === null
      ? [{ index: activeIndex, visible: true, animating: true }]
      : [
          { index: previousIndex, visible: false, animating: false },
          { index: activeIndex, visible: true, animating: true },
        ]

  return (
    <div className={`key-art-slideshow ${className}`.trim()} aria-hidden="true">
      {slidesToRender.map(({ index, visible, animating }) => {
        const slide = KEY_ART_SLIDES[index]
        return (
          <div
            key={`${index}-${animating ? fadeKey : 'hold'}`}
            className={`key-art-slide-layer ${visible ? 'key-art-slide-layer--visible' : 'key-art-slide-layer--hidden'}`}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
          >
            <img
              src={slide.url}
              alt=""
              className={`key-art-slide-image ${animating ? 'key-art-slide-image--pan' : ''}`}
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
