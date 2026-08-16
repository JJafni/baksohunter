import type { CrateEntry } from './types'

const iconModules = import.meta.glob<string>('../assets/weapons/*.png', {
  eager: true,
  import: 'default',
})

function icon(slug: string): string {
  const key = `../assets/weapons/${slug}.png`
  const url = iconModules[key]
  if (!url) {
    throw new Error(`Missing weapon icon for "${key}"`)
  }
  return url
}

const BASE_WEAPONS = [
  { slug: 'great-sword', name: 'Great Sword' },
  { slug: 'long-sword', name: 'Long Sword' },
  { slug: 'sword-and-shield', name: 'Sword & Shield' },
  { slug: 'dual-blades', name: 'Dual Blades' },
  { slug: 'hammer', name: 'Hammer' },
  { slug: 'hunting-horn', name: 'Hunting Horn' },
  { slug: 'lance', name: 'Lance' },
  { slug: 'gunlance', name: 'Gunlance' },
  { slug: 'switch-axe', name: 'Switch Axe' },
  { slug: 'charge-blade', name: 'Charge Blade' },
  { slug: 'insect-glaive', name: 'Insect Glaive' },
  { slug: 'light-bowgun', name: 'Light Bowgun' },
  { slug: 'heavy-bowgun', name: 'Heavy Bowgun' },
  { slug: 'bow', name: 'Bow' },
] as const

export const WEAPON_POOL: CrateEntry[] = BASE_WEAPONS.map((weapon) => ({
  slug: weapon.slug,
  name: weapon.name,
  rarity: 'normal',
  icon: icon(weapon.slug),
}))

export function pickRandomWeapon(): CrateEntry {
  return WEAPON_POOL[Math.floor(Math.random() * WEAPON_POOL.length)]
}
