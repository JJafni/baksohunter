export type MonsterEntry = {
  slug: string
  name: string
  tempered: boolean
  icon: string
}

const iconModules = import.meta.glob<string>('../assets/monsters/*.webp', {
  eager: true,
  import: 'default',
})

function icon(slug: string, tempered: boolean): string {
  const key = `../assets/monsters/${slug}${tempered ? '-tempered' : ''}.webp`
  const url = iconModules[key]
  if (!url) {
    throw new Error(`Missing monster icon for "${key}"`)
  }
  return url
}

type BaseMonster = {
  slug: string
  name: string
  /** Whether a Tempered variant icon exists for this monster. */
  hasTempered: boolean
}

// Every base-game Large Monster in Monster Hunter Wilds, including
// Guardian constructs, which are treated as Large Monsters for hunts.
const BASE_MONSTERS: BaseMonster[] = [
  { slug: 'ajarakan', name: 'Ajarakan', hasTempered: true },
  { slug: 'arkveld', name: 'Arkveld', hasTempered: true },
  { slug: 'balahara', name: 'Balahara', hasTempered: true },
  { slug: 'blangonga', name: 'Blangonga', hasTempered: true },
  { slug: 'chatacabra', name: 'Chatacabra', hasTempered: true },
  { slug: 'congalala', name: 'Congalala', hasTempered: true },
  { slug: 'doshaguma', name: 'Doshaguma', hasTempered: true },
  { slug: 'gore-magala', name: 'Gore Magala', hasTempered: true },
  { slug: 'gravios', name: 'Gravios', hasTempered: true },
  { slug: 'guardian-arkveld', name: 'Guardian Arkveld', hasTempered: false },
  { slug: 'guardian-doshaguma', name: 'Guardian Doshaguma', hasTempered: true },
  { slug: 'guardian-ebony-odogaron', name: 'Guardian Ebony Odogaron', hasTempered: true },
  { slug: 'guardian-fulgur-anjanath', name: 'Guardian Fulgur Anjanath', hasTempered: true },
  { slug: 'guardian-rathalos', name: 'Guardian Rathalos', hasTempered: true },
  { slug: 'gypceros', name: 'Gypceros', hasTempered: true },
  { slug: 'hirabami', name: 'Hirabami', hasTempered: true },
  { slug: 'jin-dahaad', name: 'Jin Dahaad', hasTempered: true },
  { slug: 'lagiacrus', name: 'Lagiacrus', hasTempered: true },
  { slug: 'lala-barina', name: 'Lala Barina', hasTempered: true },
  { slug: 'mizutsune', name: 'Mizutsune', hasTempered: true },
  { slug: 'nerscylla', name: 'Nerscylla', hasTempered: true },
  { slug: 'nu-udra', name: 'Nu Udra', hasTempered: true },
  { slug: 'omega-planetes', name: 'Omega Planetes', hasTempered: true },
  { slug: 'quematrice', name: 'Quematrice', hasTempered: true },
  { slug: 'rathalos', name: 'Rathalos', hasTempered: true },
  { slug: 'rathian', name: 'Rathian', hasTempered: true },
  { slug: 'rey-dau', name: 'Rey Dau', hasTempered: true },
  { slug: 'rompopolo', name: 'Rompopolo', hasTempered: true },
  { slug: 'seregios', name: 'Seregios', hasTempered: true },
  { slug: 'uth-duna', name: 'Uth Duna', hasTempered: true },
  { slug: 'xu-wu', name: 'Xu Wu', hasTempered: true },
  { slug: 'yian-kut-ku', name: 'Yian Kut-Ku', hasTempered: true },
  { slug: 'zoh-shia', name: 'Zoh Shia', hasTempered: false },
  { slug: 'gogmazios', name: 'Gogmazios', hasTempered: false },
]

export const MONSTER_POOL: MonsterEntry[] = BASE_MONSTERS.flatMap((m) => {
  const entries: MonsterEntry[] = [
    { slug: m.slug, name: m.name, tempered: false, icon: icon(m.slug, false) },
  ]
  if (m.hasTempered) {
    entries.push({ slug: m.slug, name: m.name, tempered: true, icon: icon(m.slug, true) })
  }
  return entries
})

export function pickRandomMonster(): MonsterEntry {
  return MONSTER_POOL[Math.floor(Math.random() * MONSTER_POOL.length)]
}
