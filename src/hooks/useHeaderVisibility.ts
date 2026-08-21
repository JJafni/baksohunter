import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

const SCROLL_HIDE_THRESHOLD_PX = 8

export function useHeaderVisibility(
  scrollRootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [visible, setVisible] = useState(true)
  const [scrollTop, setScrollTop] = useState(0)
  const lastScrollTopRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const root = scrollRootRef.current
    if (!root) return

    const onScroll = () => {
      const nextScrollTop = root.scrollTop
      const lastScrollTop = lastScrollTopRef.current

      setScrollTop(nextScrollTop)

      if (nextScrollTop <= 0) {
        setVisible(true)
      } else if (nextScrollTop > lastScrollTop && nextScrollTop > SCROLL_HIDE_THRESHOLD_PX) {
        setVisible(false)
      }

      lastScrollTopRef.current = nextScrollTop
    }

    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })

    return () => root.removeEventListener('scroll', onScroll)
  }, [enabled, scrollRootRef])

  const show = useCallback(() => setVisible(true), [])

  return { visible, show, scrollTop }
}
