import { useEffect, useMemo, useRef, useState } from 'react'
import type { CrateEntry } from '../data/types'
import { shufflePoolDeck } from '../lib/poolSlideshow'

const SLIDE_CYCLE_MS = 5_200
const FADE_DURATION_MS = 1_200

type PoolSlideshowProps = {
  pool: CrateEntry[]
  buildDeck?: (pool: CrateEntry[]) => CrateEntry[]
  resolveImageUrl: (entry: CrateEntry) => string | undefined
  className?: string
}

function PoolSlideImage({
  entry,
  resolveImageUrl,
}: {
  entry: CrateEntry
  resolveImageUrl: (entry: CrateEntry) => string | undefined
}) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const galleryUrl = resolveImageUrl(entry)
  const showGallery = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showGallery ? galleryUrl! : entry.icon

  useEffect(() => {
    setUseIconFallback(false)
  }, [entry.slug])

  return (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => {
        if (showGallery) setUseIconFallback(true)
      }}
      className="pool-slide-image"
    />
  )
}

function PoolSlideshow({
  pool,
  buildDeck = shufflePoolDeck,
  resolveImageUrl,
  className = '',
}: PoolSlideshowProps) {
  const deck = useMemo(() => buildDeck(pool), [pool, buildDeck])
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const [activationCounts, setActivationCounts] = useState<number[]>(() =>
    deck.map((_, index) => (index === 0 ? 1 : 0)),
  )
  const skipInitialActivationRef = useRef(true)
  const cycleTimerRef = useRef<number | null>(null)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setActiveIndex(0)
    setExitingIndex(null)
    setActivationCounts(deck.map((_, index) => (index === 0 ? 1 : 0)))
    skipInitialActivationRef.current = true
  }, [deck])

  useEffect(() => {
    if (deck.length <= 1) return

    const scheduleCycle = () => {
      cycleTimerRef.current = window.setTimeout(() => {
        setActiveIndex((current) => {
          setExitingIndex(current)
          const next = (current + 1) % deck.length

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
  }, [deck])

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

  if (deck.length === 0) return null

  return (
    <div className={`pool-slideshow ${className}`.trim()} aria-hidden="true">
      {deck.map((entry, index) => {
        const isActive = index === activeIndex
        const isExiting = index === exitingIndex
        const hasPlayed = activationCounts[index] > 0

        let layerState: 'active' | 'exiting' | 'hidden' = 'hidden'
        if (isActive) layerState = 'active'
        else if (isExiting) layerState = 'exiting'

        return (
          <div
            key={entry.slug}
            className="pool-slide-layer"
            data-state={layerState}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
          >
            {hasPlayed ? (
              <PoolSlideImage entry={entry} resolveImageUrl={resolveImageUrl} />
            ) : null}
          </div>
        )
      })}
      <div className="pool-slideshow-dim" />
      <div className="pool-slideshow-vignette" />
    </div>
  )
}

export default PoolSlideshow
