import type { CrateEntry } from '../data/types'
import { shufflePoolDeck } from './poolSlideshow'

/** Random weapon order for the idle weapon preview reel. */
export function buildWeaponSlideshowDeck(pool: CrateEntry[]): CrateEntry[] {
  return shufflePoolDeck(pool)
}
