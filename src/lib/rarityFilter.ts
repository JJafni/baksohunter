import type { CrateEntry } from '../data/types'
import { ELDER_DRAGON_SLUGS, type MonsterEntry } from '../data/monsters'

export type MonsterPoolFilterState = {
  /** Base large monster hunts (non-tempered, non-elder-dragon). */
  large: boolean
  tempered: boolean
  'arch-tempered': boolean
  elderDragon: boolean
}

export const DEFAULT_MONSTER_POOL_FILTER: MonsterPoolFilterState = {
  large: true,
  tempered: true,
  'arch-tempered': true,
  elderDragon: true,
}

export function filterMonsterPool(pool: MonsterEntry[], filters: MonsterPoolFilterState): MonsterEntry[] {
  return pool.filter((entry) => {
    if (entry.rarity === 'tempered') return filters.tempered
    if (entry.rarity === 'arch-tempered') return filters['arch-tempered']
    if (entry.rarity === 'normal') {
      if (ELDER_DRAGON_SLUGS.has(entry.slug)) return filters.elderDragon
      return filters.large
    }
    return false
  })
}

export function pickRandomFromPool<T extends CrateEntry>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function formatPoolCountLabel(count: number): string {
  if (count === 0) return 'No monsters in pool'
  return `${count} monsters in the pool`
}
