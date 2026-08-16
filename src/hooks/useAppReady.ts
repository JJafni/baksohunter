import { useEffect, useState } from 'react'
import { preloadAppAssets } from '../lib/preloadAssets'

export function useAppReady() {
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false

    preloadAppAssets((value) => {
      if (!cancelled) {
        setProgress(value)
      }
    }).then(() => {
      if (!cancelled) {
        setProgress(1)
        setReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { ready, progress }
}
