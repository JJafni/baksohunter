import type { CrateEntry } from '../data/types'
import { ELDER_DRAGON_SLUGS, type MonsterEntry } from '../data/monsters'

/** User-facing pool filters for the monster hunt (no separate "Large" tier — all are large). */
export type MonsterPoolFilterState = {
  tempered: boolean
  'arch-tempered': boolean
  elderDragon: boolean
}

export const DEFAULT_MONSTER_POOL_FILTER: MonsterPoolFilterState = {
  tempered: true,
  'arch-tempered': true,
  elderDragon: true,
}

export function filterMonsterPool(pool: MonsterEntry[], filters: MonsterPoolFilterState): MonsterEntry[] {
  return pool.filter((entry) => {
    if (entry.rarity === 'tempered') return filters.tempered
    if (entry.rarity === 'arch-tempered') return filters['arch-tempered']
    if (entry.rarity === 'normal') {
      return filters.elderDragon && ELDER_DRAGON_SLUGS.has(entry.slug)
    }
    return false
  })
}

export function pickRandomFromPool<T extends CrateEntry>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatPoolCountLabel(count: number, filters: MonsterPoolFilterState): string {
  if (count === 0) return 'No monsters match the current filters'

  const parts: string[] = []
  if (filters.tempered) parts.push('Tempered')
  if (filters['arch-tempered']) parts.push('Arch-Tempered')
  if (filters.elderDragon) parts.push('Elder Dragon')

  if (parts.length === 0) return 'No monsters match the current filters'
  if (parts.length === 3) return `${count} Tempered, Arch-Tempered & Elder Dragon Monsters in the pool`

  const joined =
    parts.length === 1 ? parts[0] : parts.length === 2 ? `${parts[0]} & ${parts[1]}` : parts.join(', ')

  return `${count} ${joined} Monsters in the pool`
}
