export type Rarity = 'normal' | 'tempered' | 'arch-tempered'

export type CrateEntry = {
  slug: string
  name: string
  rarity: Rarity
  icon: string
}
