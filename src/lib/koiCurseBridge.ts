export const KOI_DRAG_MESSAGE = 'threeui-koi-drag'
export const KOI_DROP_MESSAGE = 'threeui-koi-drop'
export const KOI_SHUFFLE_MESSAGE = 'threeui-koi-shuffle'
export const KOI_SHUFFLE_RESULT_MESSAGE = 'threeui-koi-shuffle-result'
export const KOI_LIMITS_MESSAGE = 'threeui-koi-limits'

export const KOI_SHUFFLE_LIMIT = 2

export type KoiCardId = 0 | 1 | 2
export type KoiFate = 'cursed' | 'blessed'

export type KoiDragPayload = {
  type: typeof KOI_DRAG_MESSAGE
  cardId: KoiCardId
  cardName: string
  x: number
  y: number
  dx: number
  dy: number
}

export type KoiDropPayload = {
  type: typeof KOI_DROP_MESSAGE
  cardId: KoiCardId
  cardName: string
  x: number
  y: number
  dx: number
  dy: number
  committedDirection: number
}

export type KoiShuffleResultPayload = {
  type: typeof KOI_SHUFFLE_RESULT_MESSAGE
  ok: boolean
}

export type ResolvedKoiCard = {
  key: string
  id: KoiCardId
  name: string
  fate: KoiFate
}

export const KOI_FATE_LIMITS: Record<KoiFate, number> = {
  cursed: 3,
  blessed: 1,
}

const KOI_ACCENT: Record<KoiCardId, string> = {
  0: '#b8653a',
  1: '#6b7f52',
  2: '#c9a24d',
}

export function getKoiAccent(cardId: KoiCardId) {
  return KOI_ACCENT[cardId]
}

export function isKoiDragPayload(data: unknown): data is KoiDragPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as KoiDragPayload).type === KOI_DRAG_MESSAGE
  )
}

export function isKoiDropPayload(data: unknown): data is KoiDropPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as KoiDropPayload).type === KOI_DROP_MESSAGE
  )
}

export function isKoiShuffleResultPayload(data: unknown): data is KoiShuffleResultPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as KoiShuffleResultPayload).type === KOI_SHUFFLE_RESULT_MESSAGE
  )
}

export function getKoiFateFromDirection(committedDirection: number): KoiFate | null {
  if (committedDirection < 0) return 'cursed'
  if (committedDirection > 0) return 'blessed'
  return null
}

export function getKoiFateFromDrag(dx: number, dy: number, threshold = 52): KoiFate | null {
  const hasHorizontalIntent = Math.abs(dx) >= Math.abs(dy) * 0.75
  if (!hasHorizontalIntent || Math.abs(dx) < threshold) return null
  return dx < 0 ? 'cursed' : 'blessed'
}

export function countKoiFate(cards: ResolvedKoiCard[], fate: KoiFate) {
  return cards.filter(card => card.fate === fate).length
}

export function canAddKoiFate(cards: ResolvedKoiCard[], fate: KoiFate) {
  return countKoiFate(cards, fate) < KOI_FATE_LIMITS[fate]
}

export function getKoiFateLimitsState(cards: ResolvedKoiCard[]) {
  return {
    cursedFull: !canAddKoiFate(cards, 'cursed'),
    blessedFull: !canAddKoiFate(cards, 'blessed'),
  }
}

export function postKoiFateLimits(
  target: Window | null | undefined,
  cards: ResolvedKoiCard[],
) {
  if (!target) return

  target.postMessage(
    {
      type: KOI_LIMITS_MESSAGE,
      ...getKoiFateLimitsState(cards),
    },
    '*',
  )
}

export function tryAddResolvedKoiCard(
  cards: ResolvedKoiCard[],
  card: Omit<ResolvedKoiCard, 'key'>,
): ResolvedKoiCard[] {
  if (cards.some(existing => existing.id === card.id)) return cards
  if (!canAddKoiFate(cards, card.fate)) return cards

  return [
    ...cards,
    {
      ...card,
      key: `${card.fate}-${card.id}-${Date.now()}`,
    },
  ]
}
