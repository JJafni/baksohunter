import type { CrateEntry } from '../data/types'

function entryKey(entry: CrateEntry): string {
  return `${entry.slug}:${entry.rarity}`
}

function pickNonConsecutive(pool: CrateEntry[], avoid: CrateEntry[]): CrateEntry {
  const avoidKeys = new Set(avoid.map(entryKey))
  const candidates = pool.filter((entry) => !avoidKeys.has(entryKey(entry)))

  const choices = candidates.length > 0 ? candidates : pool
  return choices[Math.floor(Math.random() * choices.length)]
}

/** Builds a reel sequence with no back-to-back duplicate entries. */
export function buildReelSequence(pool: CrateEntry[], target: CrateEntry, length: number, centerIndex: number): CrateEntry[] {
  const sequence: CrateEntry[] = new Array(length)

  for (let i = 0; i < length; i++) {
    if (i === centerIndex) {
      sequence[i] = target
      continue
    }

    const avoid: CrateEntry[] = []
    if (i > 0) avoid.push(sequence[i - 1])
    if (i === centerIndex - 1) avoid.push(target)
    if (i === centerIndex + 1) avoid.push(target)

    sequence[i] = pickNonConsecutive(pool, avoid)
  }

  return sequence
}
