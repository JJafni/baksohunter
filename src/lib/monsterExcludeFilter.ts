import type { MonsterEntry } from '../data/monsters'

export type MonsterExcludeState = ReadonlySet<string>

export function filterPoolByExcluded(pool: MonsterEntry[], excluded: MonsterExcludeState): MonsterEntry[] {
  if (excluded.size === 0) return pool
  return pool.filter((entry) => !excluded.has(entry.slug))
}

export function toggleMonsterExcluded(excluded: MonsterExcludeState, slug: string): MonsterExcludeState {
  const next = new Set(excluded)
  if (next.has(slug)) next.delete(slug)
  else next.add(slug)
  return next
}

export function clearMonsterExclusions(): MonsterExcludeState {
  return new Set()
}

/** One row per species — prefers the base large-monster icon. */
export function uniqueMonsterSpecies(pool: MonsterEntry[]): MonsterEntry[] {
  const bySlug = new Map<string, MonsterEntry>()
  for (const entry of pool) {
    const existing = bySlug.get(entry.slug)
    if (!existing || entry.rarity === 'normal') {
      bySlug.set(entry.slug, entry.rarity === 'normal' ? entry : (existing ?? entry))
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name))
}
