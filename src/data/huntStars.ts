import type { CrateEntry, Rarity } from './types'

export type HuntStar = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Inclusive integer range helper for star pools. */
function stars(from: number, to: number): HuntStar[] {
  const out: HuntStar[] = []
  for (let n = from; n <= to; n++) out.push(n as HuntStar)
  return out
}

/**
 * Normal (non-tempered) investigation stars per monster.
 * Ranges follow LR → HR difficulty from Gamer Guides / Game8 monster unlock tables.
 * @see https://www.gamerguides.com/monster-hunter-wilds/guide/getting-started/gameplay/high-rank-and-tempered-monsters
 */
const NORMAL_STARS: Record<string, HuntStar[]> = {
  ajarakan: stars(2, 5),
  arkveld: [7],
  balahara: stars(1, 4),
  blangonga: [5],
  chatacabra: stars(1, 4),
  congalala: stars(1, 4),
  doshaguma: stars(1, 5),
  'gogmazios': [10],
  'gore-magala': [6],
  gravios: [5],
  'guardian-arkveld': [3],
  'guardian-doshaguma': stars(3, 5),
  'guardian-ebony-odogaron': stars(3, 5),
  'guardian-fulgur-anjanath': [5],
  'guardian-rathalos': stars(3, 5),
  gypceros: [4],
  hirabami: stars(2, 4),
  'jin-dahaad': stars(3, 6),
  lagiacrus: stars(5, 7),
  'lala-barina': stars(1, 4),
  mizutsune: stars(5, 7),
  nerscylla: stars(2, 4),
  'nu-udra': stars(3, 6),
  'omega-planetes': [8],
  quematrice: stars(1, 4),
  rathalos: [5],
  rathian: [4],
  'rey-dau': stars(2, 6),
  rompopolo: stars(2, 4),
  seregios: stars(5, 7),
  'uth-duna': stars(2, 6),
  'xu-wu': stars(3, 5),
  'yian-kut-ku': [4],
  'zoh-shia': [3, 6, 7, 8, 10],
}

/** Tempered tier 1 — 5★ investigations (Wyvern Sparks and Rose Thorns). */
const TEMPERED_TIER1 = [
  'balahara',
  'chatacabra',
  'congalala',
  'gypceros',
  'hirabami',
  'lala-barina',
  'nerscylla',
  'quematrice',
  'rathian',
  'rompopolo',
  'yian-kut-ku',
] as const

/** Tempered tier 2 — 6★ investigations (Storm-Cold Vortex). */
const TEMPERED_TIER2 = [
  'ajarakan',
  'blangonga',
  'doshaguma',
  'gravios',
  'guardian-doshaguma',
  'guardian-ebony-odogaron',
  'guardian-fulgur-anjanath',
  'guardian-rathalos',
  'rathalos',
  'xu-wu',
] as const

/** Tempered tier 3 — 7★ and 8★ investigations (What Lies Ahead). */
const TEMPERED_TIER3 = [
  'arkveld',
  'gore-magala',
  'jin-dahaad',
  'lagiacrus',
  'mizutsune',
  'nu-udra',
  'rey-dau',
  'seregios',
  'uth-duna',
] as const

/** HR 100+ 9★ investigation targets (Game8 9-star quest list + TU3 additions). */
const TEMPERED_9_STAR = [
  ...TEMPERED_TIER3,
  'ajarakan',
  'blangonga',
  'guardian-fulgur-anjanath',
] as const

/**
 * Tempered investigation stars per monster.
 * Based on Game8 / GameRiv tempered tiers, 9★ HR100 roster, and event-only stars.
 * @see https://game8.co/games/Monster-Hunter-Wilds/archives/499625
 * @see https://gameriv.com/monster-hunter-wilds-list-of-tempered-monsters/
 * @see https://game8.co/games/Monster-Hunter-Wilds/archives/543622
 */
const TEMPERED_STARS: Record<string, HuntStar[]> = (() => {
  const map: Record<string, HuntStar[]> = {}

  for (const slug of TEMPERED_TIER1) map[slug] = [5]
  for (const slug of TEMPERED_TIER2) map[slug] = [6]
  for (const slug of TEMPERED_TIER3) map[slug] = [7, 8]

  for (const slug of TEMPERED_9_STAR) {
    const base = map[slug] ?? []
    map[slug] = [...new Set([...base, 9])].sort((a, b) => a - b) as HuntStar[]
  }

  // 10★ event — no 7/8/9 tempered investigations (Just What the Doctor Ordered).
  map.rompopolo = [5, 10]
  // Planetes Protocol (Savage) — permanent 9★ event (TU3 FFXIV collab).
  map['omega-planetes'] = [9]

  return map
})()

/** Arch-tempered event quests are 10★ (Freedom from Solitude, Ruler of the Desert Kingdom, etc.). */
const ARCH_TEMPERED_STARS: Record<string, HuntStar[]> = {
  arkveld: [10],
  'jin-dahaad': [10],
  'nu-udra': [10],
  'rey-dau': [10],
  'uth-duna': [10],
}

const DEFAULT_STARS_BY_RARITY: Record<Rarity, HuntStar[]> = {
  normal: stars(1, 8),
  tempered: [5, 6, 7, 8, 9],
  'arch-tempered': [9, 10],
}

const STARS_BY_RARITY: Record<Rarity, Record<string, HuntStar[]>> = {
  normal: NORMAL_STARS,
  tempered: TEMPERED_STARS,
  'arch-tempered': ARCH_TEMPERED_STARS,
}

export function getStarsForMonster(entry: CrateEntry): HuntStar[] {
  const pool = STARS_BY_RARITY[entry.rarity][entry.slug]
  if (pool?.length) return pool
  return DEFAULT_STARS_BY_RARITY[entry.rarity]
}

export function pickStarForMonster(entry: CrateEntry): HuntStar {
  const starPool = getStarsForMonster(entry)
  return starPool[Math.floor(Math.random() * starPool.length)]!
}

export function formatHuntStar(star: HuntStar): string {
  return `${star}★`
}
