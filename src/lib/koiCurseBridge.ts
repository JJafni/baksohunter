export const KOI_DRAG_MESSAGE = 'threeui-koi-drag'
export const KOI_DROP_MESSAGE = 'threeui-koi-drop'

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

export type ResolvedKoiCard = {
  key: string
  id: KoiCardId
  name: string
  fate: KoiFate
}

const KOI_ACCENT: Record<KoiCardId, string> = {
  0: '#c95c3f',
  1: '#b8664d',
  2: '#bc744b',
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
