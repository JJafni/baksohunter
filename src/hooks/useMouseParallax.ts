import { useEffect, useRef, useState } from 'react'

export type ParallaxOffset = {
  x: number
  y: number
}

const EMIT_EPSILON = 0.002

/** Normalized mouse position smoothed for subtle parallax (-1 … 1 on each axis). */
export function useMouseParallax(smoothing = 0.1): ParallaxOffset {
  const target = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const current = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const lastEmitted = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      target.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    let frame = 0
    const tick = () => {
      current.current = {
        x: current.current.x + (target.current.x - current.current.x) * smoothing,
        y: current.current.y + (target.current.y - current.current.y) * smoothing,
      }

      const dx = Math.abs(current.current.x - lastEmitted.current.x)
      const dy = Math.abs(current.current.y - lastEmitted.current.y)
      if (dx > EMIT_EPSILON || dy > EMIT_EPSILON) {
        lastEmitted.current = { ...current.current }
        setOffset({ x: current.current.x, y: current.current.y })
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.cancelAnimationFrame(frame)
    }
  }, [smoothing])

  return offset
}
