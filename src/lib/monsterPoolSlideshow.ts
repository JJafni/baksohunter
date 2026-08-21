import type { CrateEntry } from '../data/types'
import { uniqueMonsterSpecies } from './monsterExcludeFilter'
import { shufflePoolDeck } from './poolSlideshow'

/** One random species order for the idle monster preview reel. */
export function buildMonsterSlideshowDeck(pool: CrateEntry[]): CrateEntry[] {
  return shufflePoolDeck(uniqueMonsterSpecies(pool))
}
