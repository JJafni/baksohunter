import type { CrateEntry } from '../data/types'

/** Cards show the monster/weapon name — avoid back-to-back repeats of the same identity. */
function identityKey(entry: CrateEntry): string {
  return entry.slug
}

function pickFromPool(pool: CrateEntry[], excludeKeys: Set<string>): CrateEntry | null {
  const candidates = pool.filter((entry) => !excludeKeys.has(identityKey(entry)))
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]!
}

function blocksCenterNeighbor(pool: CrateEntry[], entry: CrateEntry, target: CrateEntry): boolean {
  const exclude = new Set([identityKey(entry), identityKey(target)])
  return pool.every((candidate) => exclude.has(identityKey(candidate)))
}

/** Builds a reel sequence with no back-to-back duplicate identities. */
export function buildReelSequence(
  pool: CrateEntry[],
  target: CrateEntry,
  length: number,
  centerIndex: number,
): CrateEntry[] {
  if (pool.length === 0) return []
  if (pool.length === 1) return Array.from({ length }, () => pool[0]!)

  const sequence: CrateEntry[] = new Array(length)
  sequence[centerIndex] = target
  const targetKey = identityKey(target)

  for (let i = 0; i < length; i++) {
    if (i === centerIndex) continue

    const exclude = new Set<string>()

    if (i > 0 && sequence[i - 1]) {
      exclude.add(identityKey(sequence[i - 1]!))
    }

    if (i === centerIndex - 1 || i === centerIndex + 1) {
      exclude.add(targetKey)
    }

    // Two-entry (or tight) pools: don't pick a decoy that forces the center neighbor to repeat the winner.
    if (i === centerIndex - 2) {
      for (const entry of pool) {
        if (blocksCenterNeighbor(pool, entry, target)) {
          exclude.add(identityKey(entry))
        }
      }
    }

    let picked = pickFromPool(pool, exclude)

    if (!picked) {
      const prevOnly = new Set<string>()
      if (i > 0 && sequence[i - 1]) {
        prevOnly.add(identityKey(sequence[i - 1]!))
      }
      if (i === centerIndex - 1 || i === centerIndex + 1) {
        prevOnly.add(targetKey)
      }
      picked = pickFromPool(pool, prevOnly)
    }

    sequence[i] = picked ?? pool[Math.floor(Math.random() * pool.length)]!
  }

  return sequence
}

export function hasConsecutiveDuplicates(sequence: CrateEntry[]): boolean {
  for (let i = 1; i < sequence.length; i++) {
    if (identityKey(sequence[i - 1]!) === identityKey(sequence[i]!)) {
      return true
    }
  }
  return false
}
