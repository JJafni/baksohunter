import { getKeyArtUrls } from '../data/keyArtUrls'
import { MONSTER_POOL } from '../data/monsters'
import { getQuestTypeIconUrls } from '../data/questTypes'
import { WEAPON_POOL } from '../data/weapons'

export function getAppAssetUrls(): string[] {
  const urls = new Set<string>(getKeyArtUrls())

  for (const entry of MONSTER_POOL) {
    urls.add(entry.icon)
  }

  for (const entry of WEAPON_POOL) {
    urls.add(entry.icon)
  }

  for (const icon of getQuestTypeIconUrls()) {
    urls.add(icon)
  }

  return [...urls]
}

async function preloadImage(src: string): Promise<void> {
  const img = new Image()

  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })

  if (!img.complete) return

  try {
    if ('decode' in img) {
      await img.decode()
    }
  } catch {
    // Ignore decode failures; the asset is still fetched.
  }
}

let preloadProgress = 0
let preloadPromise: Promise<void> | null = null
const progressListeners = new Set<(progress: number) => void>()

function emitProgress(progress: number) {
  preloadProgress = progress
  progressListeners.forEach((listener) => listener(progress))
}

export function preloadAppAssets(onProgress?: (progress: number) => void): Promise<void> {
  if (onProgress) {
    progressListeners.add(onProgress)
    onProgress(preloadProgress)
  }

  if (!preloadPromise) {
    preloadPromise = (async () => {
      const urls = getAppAssetUrls()

      if (urls.length === 0) {
        emitProgress(1)
        return
      }

      let loaded = 0

      await Promise.all(
        urls.map(async (url) => {
          await preloadImage(url)
          loaded += 1
          emitProgress(loaded / urls.length)
        }),
      )

      emitProgress(1)
    })()
  }

  return preloadPromise.finally(() => {
    if (onProgress) {
      progressListeners.delete(onProgress)
    }
  })
}
