import { useEffect, useState } from 'react'
import type { CrateEntry } from '../data/types'

/** Keep the last revealed entry mounted so backdrop/inline images can fade out smoothly. */
export function useGalleryDisplayResult(result: CrateEntry | null, visible: boolean) {
  const [displayedResult, setDisplayedResult] = useState<CrateEntry | null>(null)

  useEffect(() => {
    if (visible && result) {
      setDisplayedResult(result)
    }
  }, [visible, result])

  return displayedResult
}
