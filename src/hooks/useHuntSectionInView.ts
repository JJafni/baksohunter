import { useEffect, useState, type RefObject } from 'react'

/** True once the hunt section has scrolled up under the sticky header. */
export function useHuntSectionInView(
  scrollRootRef: RefObject<HTMLElement | null>,
  huntSectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [huntChromeVisible, setHuntChromeVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const root = scrollRootRef.current
    const target = huntSectionRef.current
    if (!root || !target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHuntChromeVisible(entry.isIntersecting)
      },
      {
        root,
        threshold: 0,
        rootMargin: '-72px 0px 0px 0px',
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled, scrollRootRef, huntSectionRef])

  return huntChromeVisible
}
