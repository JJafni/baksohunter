import type { CrateEntry } from '../data/types'

/** Fisher–Yates shuffle for idle preview slideshow decks. */
export function shufflePoolDeck(pool: CrateEntry[]): CrateEntry[] {
  if (pool.length <= 1) return pool

  const deck = [...pool]
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
