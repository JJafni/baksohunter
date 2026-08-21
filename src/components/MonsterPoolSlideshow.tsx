import { useEffect, useMemo, useRef, useState } from 'react'
import type { CrateEntry } from '../data/types'
import { getMonsterGalleryImageUrl } from '../lib/monsterGalleryImages'
import { buildMonsterSlideshowDeck } from '../lib/monsterPoolSlideshow'

const SLIDE_CYCLE_MS = 5_200
const FADE_DURATION_MS = 1_200

type MonsterPoolSlideshowProps = {
  pool: CrateEntry[]
  className?: string
}

function MonsterPoolSlideImage({ entry }: { entry: CrateEntry }) {
  const [useIconFallback, setUseIconFallback] = useState(false)
  const galleryUrl = getMonsterGalleryImageUrl(entry.slug)
  const showHd = Boolean(galleryUrl) && !useIconFallback
  const imageUrl = showHd ? galleryUrl! : entry.icon

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
        if (showHd) setUseIconFallback(true)
      }}
      className="monster-pool-slide-image"
    />
  )
}

function MonsterPoolSlideshow({ pool, className = '' }: MonsterPoolSlideshowProps) {
  const deck = useMemo(() => buildMonsterSlideshowDeck(pool), [pool])
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
    <div className={`monster-pool-slideshow ${className}`.trim()} aria-hidden="true">
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
            className="monster-pool-slide-layer"
            data-state={layerState}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
          >
            {hasPlayed ? <MonsterPoolSlideImage entry={entry} /> : null}
          </div>
        )
      })}
      <div className="monster-pool-slideshow-dim" />
      <div className="monster-pool-slideshow-vignette" />
    </div>
  )
}

export default MonsterPoolSlideshow
