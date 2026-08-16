import { backgroundSlides } from '../data/backgroundSlides'
import { MONSTER_POOL } from '../data/monsters'
import { WEAPON_POOL } from '../data/weapons'

export function getAppAssetUrls(): string[] {
  const iconUrls = new Set<string>()
  const backgroundUrls = new Set<string>()

  for (const entry of MONSTER_POOL) {
    iconUrls.add(entry.icon)
  }

  for (const entry of WEAPON_POOL) {
    iconUrls.add(entry.icon)
  }

  for (const slide of backgroundSlides) {
    backgroundUrls.add(slide.src)
  }

  return [...iconUrls, ...backgroundUrls]
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

let preloadPromise: Promise<void> | null = null

export function preloadAppAssets(onProgress?: (progress: number) => void): Promise<void> {
  if (preloadPromise) {
    return preloadPromise.then(() => onProgress?.(1))
  }

  preloadPromise = (async () => {
    const urls = getAppAssetUrls()

    if (urls.length === 0) {
      onProgress?.(1)
      return
    }

    let loaded = 0

    await Promise.all(
      urls.map(async (url) => {
        await preloadImage(url)
        loaded += 1
        onProgress?.(loaded / urls.length)
      }),
    )
  })()

  return preloadPromise
}
