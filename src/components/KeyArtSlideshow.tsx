import { useEffect, useRef, useState } from 'react'
import { KEY_ART_SLIDES } from '../data/keyArtUrls'

/** Total time each slide is the primary focus (pan + overlap fade). */
const SLIDE_CYCLE_MS = 11_000
/** Crossfade overlap — begins this long before the cycle ends. */
const FADE_DURATION_MS = 3_400
/** Pan animation runs the full cycle so movement continues through the fade. */
const PAN_DURATION_MS = SLIDE_CYCLE_MS

type KeyArtSlideshowProps = {
  className?: string
}

function KeyArtSlideshow({ className = '' }: KeyArtSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const [activationCounts, setActivationCounts] = useState<number[]>(() =>
    KEY_ART_SLIDES.map((_, index) => (index === 0 ? 1 : 0)),
  )
  const skipInitialActivationRef = useRef(true)
  const cycleTimerRef = useRef<number | null>(null)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const scheduleCycle = () => {
      cycleTimerRef.current = window.setTimeout(() => {
        setActiveIndex((current) => {
          setExitingIndex(current)
          const next = (current + 1) % KEY_ART_SLIDES.length

          if (fadeTimerRef.current !== null) {
            window.clearTimeout(fadeTimerRef.current)
          }
          fadeTimerRef.current = window.setTimeout(() => {
            setExitingIndex(null)
          }, FADE_DURATION_MS)

          return next
        })

        scheduleCycle()
      }, SLIDE_CYCLE_MS - FADE_DURATION_MS)
    }

    scheduleCycle()

    return () => {
      if (cycleTimerRef.current !== null) window.clearTimeout(cycleTimerRef.current)
      if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current)
    }
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
        const isExiting = index === exitingIndex
        const isVisible = isActive || isExiting
        const hasPlayed = activationCounts[index] > 0
        const panDirection = index % 2 === 0 ? 'ltr' : 'rtl'

        let layerState: 'active' | 'exiting' | 'hidden' = 'hidden'
        if (isActive) layerState = 'active'
        else if (isExiting) layerState = 'exiting'

        return (
          <div
            key={slide.url}
            className="key-art-slide-layer"
            data-state={layerState}
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
                  animationDuration: `${PAN_DURATION_MS}ms`,
                  animationPlayState: isVisible ? 'running' : 'paused',
                }}
                decoding="async"
                draggable={false}
              />
            ) : null}
          </div>
        )
      })}
      <div className="key-art-slideshow-dim" />
      <div className="key-art-slideshow-vignette" />
      <div className="key-art-slideshow-scrim" />
    </div>
  )
}

export default KeyArtSlideshow
