import type { CrateEntry, Rarity } from './types'

export type HuntStar = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

const DEFAULT_STARS_BY_RARITY: Record<Rarity, HuntStar[]> = {
  normal: [1, 2, 3, 4, 5, 6, 7, 8],
  tempered: [5, 6, 7, 8, 9],
  'arch-tempered': [9, 10],
}

/** Stars that exist in Wilds for a given monster — flat list or per-rarity pools. */
type StarOverride = HuntStar[] | Partial<Record<Rarity, HuntStar[]>>

/**
 * Curated star pools per monster. Only listed difficulties can be rolled.
 * @see https://monsterhunterwiki.org — investigations & event quests
 */
const MONSTER_STAR_OVERRIDES: Record<string, StarOverride> = {
  // 10★ event only — no 7/8/9 tempered investigations (Just What the Doctor Ordered).
  rompopolo: { normal: [1, 2, 3, 4], tempered: [5, 10] },
  gogmazios: [10],
  'zoh-shia': [8, 9, 10],
  'omega-planetes': [9, 10],
  'guardian-arkveld': [7, 8],
  'guardian-doshaguma': [6, 7, 8],
  'guardian-ebony-odogaron': [6, 7, 8],
  'guardian-fulgur-anjanath': [6, 7, 8],
  'guardian-rathalos': [6, 7, 8],
  'jin-dahaad': { normal: [6, 7, 8], tempered: [7, 8, 9], 'arch-tempered': [10] },
  'nu-udra': { normal: [5, 6, 7, 8], tempered: [7, 8, 9], 'arch-tempered': [10] },
  'rey-dau': { normal: [4, 5, 6, 7, 8], tempered: [7, 8, 9], 'arch-tempered': [10] },
  'uth-duna': { normal: [4, 5, 6, 7, 8], tempered: [7, 8, 9], 'arch-tempered': [10] },
  arkveld: { normal: [6, 7, 8], tempered: [8, 9], 'arch-tempered': [10] },
}

function resolveOverride(override: StarOverride, rarity: Rarity): HuntStar[] | null {
  if (Array.isArray(override)) return override
  return override[rarity] ?? null
}

export function getStarsForMonster(entry: CrateEntry): HuntStar[] {
  const override = MONSTER_STAR_OVERRIDES[entry.slug]
  if (override) {
    const resolved = resolveOverride(override, entry.rarity)
    if (resolved?.length) return resolved
  }
  return DEFAULT_STARS_BY_RARITY[entry.rarity]
}

export function pickStarForMonster(entry: CrateEntry): HuntStar {
  const stars = getStarsForMonster(entry)
  return stars[Math.floor(Math.random() * stars.length)]!
}

export function formatHuntStar(star: HuntStar): string {
  return `${star}★`
}
