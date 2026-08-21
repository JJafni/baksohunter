import type { CrateEntry } from '../data/types'
import { uniqueMonsterSpecies } from './monsterExcludeFilter'

/** Fisher–Yates shuffle — one random species order for the idle preview reel. */
export function buildMonsterSlideshowDeck(pool: CrateEntry[]): CrateEntry[] {
  const species = uniqueMonsterSpecies(pool)
  if (species.length <= 1) return species

  const deck = [...species]
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
