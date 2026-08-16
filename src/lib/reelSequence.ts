import type { CrateEntry } from '../data/types'

/** Cards show the monster/weapon name — avoid back-to-back repeats of the same identity. */
function identityKey(entry: CrateEntry): string {
  return entry.slug
}

function pickEntryForSlug(pool: CrateEntry[], slug: string): CrateEntry {
  const entries = pool.filter((entry) => identityKey(entry) === slug)
  return entries[Math.floor(Math.random() * entries.length)]!
}

function uniqueSlugs(pool: CrateEntry[]): string[] {
  return [...new Set(pool.map(identityKey))]
}

function pickSlug(slugs: string[], exclude: Set<string>): string {
  const allowed = slugs.filter((slug) => !exclude.has(slug))
  if (allowed.length === 0) {
    throw new Error('No slug available for reel sequence slot')
  }
  return allowed[Math.floor(Math.random() * allowed.length)]!
}

/** Builds a reel sequence with no back-to-back duplicate monster/weapon identities. */
export function buildReelSequence(
  pool: CrateEntry[],
  target: CrateEntry,
  length: number,
  centerIndex: number,
): CrateEntry[] {
  if (pool.length === 0) return []
  if (length <= 0) return []

  const slugs = uniqueSlugs(pool)
  if (slugs.length === 1) {
    return Array.from({ length }, () => pickEntryForSlug(pool, slugs[0]!))
  }

  const sequence: CrateEntry[] = new Array(length)
  sequence[centerIndex] = target
  const targetSlug = identityKey(target)

  // Fill backward from the winner so the slot above never repeats it.
  for (let i = centerIndex - 1; i >= 0; i--) {
    const nextSlug = identityKey(sequence[i + 1]!)
    const exclude = new Set([nextSlug])
    if (i === centerIndex - 1) exclude.add(targetSlug)
    const slug = pickSlug(slugs, exclude)
    sequence[i] = pickEntryForSlug(pool, slug)
  }

  // Fill forward from the winner so the slot below never repeats it.
  for (let i = centerIndex + 1; i < length; i++) {
    const prevSlug = identityKey(sequence[i - 1]!)
    const exclude = new Set([prevSlug])
    if (i === centerIndex + 1) exclude.add(targetSlug)
    const slug = pickSlug(slugs, exclude)
    sequence[i] = pickEntryForSlug(pool, slug)
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
