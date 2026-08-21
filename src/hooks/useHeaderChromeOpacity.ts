import { useEffect, useState, type RefObject } from 'react'

const HEADER_HEIGHT_PX = 72

/** 0 at page top, 1 once the hunt section reaches the header. */
export function useHeaderChromeOpacity(
  scrollRootRef: RefObject<HTMLElement | null>,
  huntSectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const root = scrollRootRef.current
    const huntSection = huntSectionRef.current
    if (!root || !huntSection) return

    const update = () => {
      const fadeEnd = Math.max(huntSection.offsetTop - HEADER_HEIGHT_PX, 1)
      const next = Math.min(Math.max(root.scrollTop / fadeEnd, 0), 1)
      setOpacity(next)
    }

    update()
    root.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      root.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled, scrollRootRef, huntSectionRef])

  return opacity
}
