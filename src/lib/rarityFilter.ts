import type { CrateEntry, Rarity } from '../data/types'

export type RarityFilterState = Record<Rarity, boolean>

export const DEFAULT_RARITY_FILTER: RarityFilterState = {
  normal: true,
  tempered: true,
  'arch-tempered': true,
}

export function filterPoolByRarity<T extends CrateEntry>(pool: T[], filters: RarityFilterState): T[] {
  return pool.filter((entry) => filters[entry.rarity])
}

export function pickRandomFromPool<T extends CrateEntry>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatPoolCountLabel(count: number, filters: RarityFilterState): string {
  const enabled = (Object.entries(filters) as [Rarity, boolean][])
    .filter(([, on]) => on)
    .map(([rarity]) => {
      if (rarity === 'normal') return 'Large'
      if (rarity === 'tempered') return 'Tempered'
      return 'Arch-Tempered'
    })

  if (enabled.length === 0) return 'No monsters match the current filters'
  if (enabled.length === 3) return `${count} Large, Tempered & Arch-Tempered Monsters in the pool`

  const joined =
    enabled.length === 1 ? enabled[0] : enabled.length === 2 ? `${enabled[0]} & ${enabled[1]}` : enabled.join(', ')

  return `${count} ${joined} Monsters in the pool`
}
