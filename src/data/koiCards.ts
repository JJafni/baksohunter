import type { KoiCardId } from '../lib/koiCurseBridge'



export type KoiCardDefinition = {

  id: KoiCardId

  name: string

  slug: string

  videoSrc: string

  motto: string

  kanji: string

  panel: string

  ink: string

  accent: string

  cursedEffect: string

  blessedEffect: string

}



export const KOI_CARDS: KoiCardDefinition[] = [
  {
    "id": 0,
    "name": "Kōhaku",
    "slug": "kohaku",
    "kanji": "紅白",
    "panel": "#1f1a14",
    "ink": "#ede4d3",
    "accent": "#b8653a",
    "cursedEffect": "Raise the hunt by one star — your next draw must use a higher star rating.",
    "blessedEffect": "Lower the hunt by one star — your next draw may use a lower star rating (minimum ★1).",
    "motto": "Move like water, keep the fire quiet.",
    "videoSrc": "/koi/kohaku.mp4"
  },
  {
    "id": 1,
    "name": "Shūsui",
    "slug": "shusui",
    "kanji": "秋翠",
    "panel": "#171410",
    "ink": "#ede4d3",
    "accent": "#6b7f52",
    "cursedEffect": "Blade bound — your weapon roll must be Great Sword, Long Sword, or Dual Blades.",
    "blessedEffect": "Flow state — reroll the weapon once after your draw if you dislike the result.",
    "motto": "Two currents meet without noise.",
    "videoSrc": "/koi/shusui.mp4"
  },
  {
    "id": 2,
    "name": "Utsuri",
    "slug": "utsuri",
    "kanji": "写り",
    "panel": "#2a231b",
    "ink": "#ede4d3",
    "accent": "#c9a24d",
    "cursedEffect": "Shadow quarry — draw two monsters and hunt the higher-rarity target.",
    "blessedEffect": "Still hunt — keep your monster result and skip the weapon spin this round.",
    "motto": "Let stillness carry what remains.",
    "videoSrc": "/koi/utsuri.mp4"
  }
]



export const KOI_CARD_BY_ID: Record<KoiCardId, KoiCardDefinition> = {

  0: KOI_CARDS[0],

  1: KOI_CARDS[1],

  2: KOI_CARDS[2],

}

