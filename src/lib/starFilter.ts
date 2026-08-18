import type { CrateEntry } from '../data/types'
import { getStarsForMonster, type HuntStar } from '../data/huntStars'

export type SelectableStar = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type HuntStarFilterState = {
  stars: Record<SelectableStar, boolean>
  lowRank: boolean
  highRank: boolean
}

export const SELECTABLE_STARS: SelectableStar[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const DEFAULT_HUNT_STAR_FILTER: HuntStarFilterState = {
  stars: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true },
  lowRank: true,
  highRank: true,
}

/** Stars allowed by rank toggles + explicitly selected star buttons only. */
export function getEffectiveStarFilter(filter: HuntStarFilterState): HuntStar[] {
  const selected = SELECTABLE_STARS.filter((s) => filter.stars[s])
  const allowed = new Set<HuntStar>()

  if (filter.lowRank) {
    for (const s of selected) {
      if (s <= 4) allowed.add(s)
    }
  }
  if (filter.highRank) {
    for (const s of selected) {
      if (s >= 5) allowed.add(s)
    }
  }

  return [...allowed].sort((a, b) => a - b)
}

export function isDefaultStarFilter(filter: HuntStarFilterState): boolean {
  return (
    filter.lowRank &&
    filter.highRank &&
    SELECTABLE_STARS.every((s) => filter.stars[s])
  )
}

export function filterPoolByStars<T extends CrateEntry>(pool: T[], filter: HuntStarFilterState): T[] {
  const effective = getEffectiveStarFilter(filter)
  if (effective.length === 0) return []

  return pool.filter((entry) => {
    const entryStars = getStarsForMonster(entry)
    return entryStars.some((s) => effective.includes(s))
  })
}

export function pickStarForMonsterWithFilter(
  entry: CrateEntry,
  filter: HuntStarFilterState,
): HuntStar {
  const effective = getEffectiveStarFilter(filter)
  const matching = getStarsForMonster(entry).filter((s) => effective.includes(s))
  if (matching.length === 0) {
    throw new Error(`No stars match filter for ${entry.slug} (${entry.rarity})`)
  }
  return matching[Math.floor(Math.random() * matching.length)]!
}

export function formatStarFilterLabel(filter: HuntStarFilterState): string {
  if (isDefaultStarFilter(filter)) return 'All Stars'

  const effective = getEffectiveStarFilter(filter)
  if (effective.length === 0) return 'No Stars'
  if (effective.length === 1) return `${effective[0]}★`
  if (effective.length <= 3) return effective.map((s) => `${s}★`).join(', ')
  return `${effective.length} Stars`
}
