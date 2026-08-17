/** Title Update that first added each monster species to Monster Hunter Wilds. */
const MONSTER_TITLE_UPDATE_BY_SLUG: Record<string, 1 | 2 | 3 | 4> = {
  mizutsune: 1,
  lagiacrus: 2,
  seregios: 2,
  'omega-planetes': 3,
  gogmazios: 4,
}

export function getMonsterTitleUpdateLabel(slug: string): string | null {
  const tu = MONSTER_TITLE_UPDATE_BY_SLUG[slug]
  return tu ? `TU${tu}` : null
}
