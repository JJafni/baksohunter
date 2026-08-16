import { backgroundSlides } from '../data/backgroundSlides'
import { MONSTER_POOL } from '../data/monsters'
import { WEAPON_POOL } from '../data/weapons'

export function getAppAssetUrls(): string[] {
  const urls = new Set<string>()

  for (const slide of backgroundSlides) {
    urls.add(slide.src)
  }

  for (const entry of MONSTER_POOL) {
    urls.add(entry.icon)
  }

  for (const entry of WEAPON_POOL) {
    urls.add(entry.icon)
  }

  return [...urls]
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export async function preloadAppAssets(onProgress?: (progress: number) => void): Promise<void> {
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
}
