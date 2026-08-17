export type MonsterInfoItemEffect = string

export type MonsterInfoSize = {
  goldSmall: string
  average: string
  silver: string
  goldLarge: string
}

export type MonsterInfoItems = {
  meat: MonsterInfoItemEffect
  dungPods: MonsterInfoItemEffect
  flashPods: MonsterInfoItemEffect
  screamerPods: MonsterInfoItemEffect
}

/** Gameplay sidebar data from MHWiki monster pages. */
export type MonsterInfo = {
  slug: string
  name: string
  elements: string[]
  statusEffects: string[]
  weakestTo: string[]
  captureHp: string
  limpHp: string
  size: MonsterInfoSize
  roar: string
  wind: string
  tremor: string
  items: MonsterInfoItems
  locales: string[]
  sleepingAreas: string[]
  wikiUrl: string
}
