import type { CrateEntry } from '../data/types'

/** Only expose the reveal title while visible so re-spin does not flash the prior result. */
export function useRevealDisplayResult(result: CrateEntry | null, visible: boolean) {
  if (!visible || !result) return null
  return result
}
