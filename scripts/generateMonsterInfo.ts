/**
 * Generates src/data/monsterInfo.ts from compiled MHWiki sidebar data.
 * Run: npx tsx scripts/generateMonsterInfo.ts
 */
import { writeFileSync } from 'node:fs'
import { slugToWikiUrl } from './slugToWikiTitle.ts'

type Size = {
  goldSmall: string
  average: string
  silver: string
  goldLarge: string
}

type Items = {
  meat: string
  dungPods: string
  flashPods: string
  screamerPods: string
}

type Entry = {
  slug: string
  name: string
  elements: string[]
  statusEffects: string[]
  weakestTo: string[]
  captureHp: string
  limpHp: string
  size: Size
  roar: string
  wind: string
  tremor: string
  items: Items
  locales: string[]
  sleepingAreas: string[]
}

/** Sidebar + inferred gameplay data from monsterhunterwiki.org MHWilds pages. */
const ENTRIES: Entry[] = [
  {
    slug: 'ajarakan',
    name: 'Ajarakan',
    elements: ['fire', 'blast'],
    statusEffects: [],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1047.92 cm', average: '1164.36 cm', silver: '≥1339.01 cm', goldLarge: '≥1432.16 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Oilwell Basin', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Oilwell Basin - Area 6'],
  },
  {
    slug: 'arkveld',
    name: 'Arkveld',
    elements: ['dragon'],
    statusEffects: [],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1499.89 cm', average: '1666.54 cm', silver: '≥1916.52 cm', goldLarge: '≥2049.84 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: [],
    sleepingAreas: ['Windward Plains - Area 17', 'Scarlet Forest - Area 11', 'Oilwell Basin - Area 16', 'Iceshard Cliffs - Area 16', 'Ruins of Wyveria - Area 15'],
  },
  {
    slug: 'balahara',
    name: 'Balahara',
    elements: [],
    statusEffects: [],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1721.35 cm', average: '1912.62 cm', silver: '≥2199.51 cm', goldLarge: '≥2352.52 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✓' },
    locales: ['Windward Plains', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 15'],
  },
  {
    slug: 'blangonga',
    name: 'Blangonga',
    elements: ['ice'],
    statusEffects: ['iceblight'],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤809.43 cm', average: '899.37 cm', silver: '≥1034.28 cm', goldLarge: '≥1106.23 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Iceshard Cliffs', 'Wounded Hollow'],
    sleepingAreas: ['Iceshard Cliffs - Area 14'],
  },
  {
    slug: 'chatacabra',
    name: 'Chatacabra',
    elements: [],
    statusEffects: [],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤448.47 cm', average: '498.3 cm', silver: '≥573.04 cm', goldLarge: '≥612.91 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Windward Plains', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 2'],
  },
  {
    slug: 'congalala',
    name: 'Congalala',
    elements: ['blast'],
    statusEffects: ['poison', 'paralysis', 'blast', 'soiled'],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤946.04 cm', average: '1051.15 cm', silver: '≥1208.82 cm', goldLarge: '≥1292.91 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Scarlet Forest', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 7'],
  },
  {
    slug: 'doshaguma',
    name: 'Doshaguma',
    elements: [],
    statusEffects: [],
    weakestTo: ['thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1251.42 cm', average: '1390.47 cm', silver: '≥1599.04 cm', goldLarge: '≥1710.28 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Windward Plains', 'Scarlet Forest', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 10', 'Scarlet Forest - Area 10'],
  },
  {
    slug: 'gore-magala',
    name: 'Gore Magala',
    elements: [],
    statusEffects: ['frenzy'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1589.31 cm', average: '1765.9 cm', silver: '≥1960.15 cm', goldLarge: '≥2066.1 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✗', screamerPods: '✗' },
    locales: ['Iceshard Cliffs', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Iceshard Cliffs - Area 16'],
  },
  {
    slug: 'gravios',
    name: 'Gravios',
    elements: ['fire'],
    statusEffects: ['fireblight', 'poison', 'sleep'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1890.52 cm', average: '2100.58 cm', silver: '≥2415.67 cm', goldLarge: '≥2583.71 cm' },
    roar: 'Strong', wind: 'Minor', tremor: 'Minor',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Oilwell Basin', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Oilwell Basin - Area 16'],
  },
  {
    slug: 'guardian-arkveld',
    name: 'Guardian Arkveld',
    elements: ['dragon'],
    statusEffects: [],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤ cm', average: '1666.54 cm', silver: '≥ cm', goldLarge: '≥ cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Ruins of Wyveria'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'guardian-doshaguma',
    name: 'Guardian Doshaguma',
    elements: [],
    statusEffects: ['defense down'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1251.42 cm', average: '1390.47 cm', silver: '≥1599.04 cm', goldLarge: '≥1710.28 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Ruins of Wyveria'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'guardian-ebony-odogaron',
    name: 'Guardian Ebony Odogaron',
    elements: ['dragon'],
    statusEffects: ['bleed'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1249.88 cm', average: '1388.75 cm', silver: '≥1597.06 cm', goldLarge: '≥1708.16 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Ruins of Wyveria'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'guardian-fulgur-anjanath',
    name: 'Guardian Fulgur Anjanath',
    elements: ['thunder'],
    statusEffects: ['thunderblight'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1481.81 cm', average: '1646.46 cm', silver: '≥1893.43 cm', goldLarge: '≥2025.15 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Ruins of Wyveria'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'guardian-rathalos',
    name: 'Guardian Rathalos',
    elements: ['fire'],
    statusEffects: ['poison', 'fireblight'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1533.8 cm', average: '1704.22 cm', silver: '≥1959.85 cm', goldLarge: '≥2096.19 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Ruins of Wyveria'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'gypceros',
    name: 'Gypceros',
    elements: [],
    statusEffects: ['poison'],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤867.72 cm', average: '964.14 cm', silver: '≥1108.76 cm', goldLarge: '≥1185.89 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✗', screamerPods: '✗' },
    locales: ['Windward Plains', 'Oilwell Basin', 'Iceshard Cliffs', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 4', 'Oilwell Basin - Area 11', 'Iceshard Cliffs - Area 6'],
  },
  {
    slug: 'hirabami',
    name: 'Hirabami',
    elements: ['ice'],
    statusEffects: ['iceblight'],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1493.41 cm', average: '1659.34 cm', silver: '≥1808.68 cm', goldLarge: '≥1875.05 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Iceshard Cliffs', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Iceshard Cliffs - Area 8'],
  },
  {
    slug: 'jin-dahaad',
    name: 'Jin Dahaad',
    elements: ['ice'],
    statusEffects: ['frostblight'],
    weakestTo: ['fire'],
    captureHp: '-',
    limpHp: '15%',
    size: { goldSmall: '≤ cm', average: '4560.89 cm', silver: '≥ cm', goldLarge: '≥ cm' },
    roar: 'Strong', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Iceshard Cliffs', 'Rimechain Peak'],
    sleepingAreas: ['None'],
  },
  {
    slug: 'lagiacrus',
    name: 'Lagiacrus',
    elements: ['thunder'],
    statusEffects: ['thunderblight'],
    weakestTo: ['ice'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤2281.91 cm', average: '2535.46 cm', silver: '≥2763.65 cm', goldLarge: '≥2865.07 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✗', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Scarlet Forest', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 19'],
  },
  {
    slug: 'lala-barina',
    name: 'Lala Barina',
    elements: [],
    statusEffects: ['paralysis'],
    weakestTo: ['fire'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤628.87 cm', average: '698.75 cm', silver: '≥803.56 cm', goldLarge: '≥859.46 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Scarlet Forest', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 4'],
  },
  {
    slug: 'mizutsune',
    name: 'Mizutsune',
    elements: ['water', 'fire'],
    statusEffects: ['bubbleblight'],
    weakestTo: ['thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1731.09 cm', average: '1923.43 cm', silver: '≥2211.95 cm', goldLarge: '≥2365.82 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✗', dungPods: '✗', flashPods: '✗', screamerPods: '✗' },
    locales: ['Scarlet Forest', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 6'],
  },
  {
    slug: 'nerscylla',
    name: 'Nerscylla',
    elements: [],
    statusEffects: ['poison', 'sleep', 'webbing'],
    weakestTo: ['fire', 'thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤658.77 cm', average: '731.96 cm', silver: '≥841.76 cm', goldLarge: '≥900.31 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Oilwell Basin', 'Iceshard Cliffs', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Oilwell Basin - Area 5', 'Iceshard Cliffs - Area 4'],
  },
  {
    slug: 'nu-udra',
    name: 'Nu Udra',
    elements: ['fire'],
    statusEffects: ['fireblight'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1884.33 cm', average: '2093.7 cm', silver: '≥2282.13 cm', goldLarge: '≥2365.88 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✗', screamerPods: '✗' },
    locales: ['Oilwell Basin', 'Wounded Hollow'],
    sleepingAreas: ['Oilwell Basin - Area 17'],
  },
  {
    slug: 'omega-planetes',
    name: 'Omega Planetes',
    elements: ['fire', 'dragon'],
    statusEffects: ['frostblight'],
    weakestTo: ['thunder'],
    captureHp: '-',
    limpHp: '-',
    size: { goldSmall: '≤ cm', average: '1181.85 cm', silver: '≥ cm', goldLarge: '≥ cm' },
    roar: 'None', wind: '-', tremor: '-',
    items: { meat: '✗', dungPods: '0%', flashPods: '✗', screamerPods: '✗' },
    locales: ['Rimechain Peak'],
    sleepingAreas: ['(-)'],
  },
  {
    slug: 'quematrice',
    name: 'Quematrice',
    elements: ['fire'],
    statusEffects: ['fireblight'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1119.75 cm', average: '1244.17 cm', silver: '≥1430.79 cm', goldLarge: '≥1530.32 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Windward Plains', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 9'],
  },
  {
    slug: 'rathalos',
    name: 'Rathalos',
    elements: ['fire'],
    statusEffects: ['poison', 'fireblight'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1533.8 cm', average: '1704.22 cm', silver: '≥1959.85 cm', goldLarge: '≥2096.19 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Scarlet Forest', 'Oilwell Basin', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 11', 'Oilwell Basin - Area 16'],
  },
  {
    slug: 'rathian',
    name: 'Rathian',
    elements: ['fire'],
    statusEffects: ['poison', 'fireblight'],
    weakestTo: ['dragon'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1578.93 cm', average: '1754.37 cm', silver: '≥2017.53 cm', goldLarge: '≥2157.88 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Windward Plains', 'Scarlet Forest', 'Oilwell Basin', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 10', 'Scarlet Forest - Area 11', 'Oilwell Basin - Area 5'],
  },
  {
    slug: 'rey-dau',
    name: 'Rey Dau',
    elements: ['thunder'],
    statusEffects: ['thunderblight'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1851.38 cm', average: '2057.09 cm', silver: '≥2365.65 cm', goldLarge: '≥2530.22 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Windward Plains', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 17'],
  },
  {
    slug: 'rompopolo',
    name: 'Rompopolo',
    elements: [],
    statusEffects: ['poison', 'blast'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1078.04 cm', average: '1197.82 cm', silver: '≥1377.49 cm', goldLarge: '≥1473.32 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Oilwell Basin', 'Wounded Hollow'],
    sleepingAreas: ['Oilwell Basin - Area 10'],
  },
  {
    slug: 'seregios',
    name: 'Seregios',
    elements: [],
    statusEffects: ['bleed'],
    weakestTo: ['thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1557.24 cm', average: '1730.27 cm', silver: '≥1989.81 cm', goldLarge: '≥2128.23 cm' },
    roar: 'Weak', wind: '✗', tremor: '✗',
    items: { meat: '✗', dungPods: '100%', flashPods: '✓', screamerPods: '✓' },
    locales: ['Windward Plains', 'Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Windward Plains - Area 4', 'Ruins of Wyveria - Area 12'],
  },
  {
    slug: 'uth-duna',
    name: 'Uth Duna',
    elements: ['water'],
    statusEffects: ['waterblight'],
    weakestTo: ['thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤2681.36 cm', average: '2979.29 cm', silver: '≥3247.43 cm', goldLarge: '≥3366.6 cm' },
    roar: 'Weak', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✗' },
    locales: ['Scarlet Forest'],
    sleepingAreas: ['Scarlet Forest - Area 17'],
  },
  {
    slug: 'xu-wu',
    name: 'Xu Wu',
    elements: [],
    statusEffects: [],
    weakestTo: ['thunder'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤1256.67 cm', average: '1396.3 cm', silver: '≥1605.75 cm', goldLarge: '≥1717.45 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✗', screamerPods: '✗' },
    locales: ['Ruins of Wyveria', 'Wounded Hollow'],
    sleepingAreas: ['Ruins of Wyveria - Area 12'],
  },
  {
    slug: 'yian-kut-ku',
    name: 'Yian Kut-Ku',
    elements: ['fire'],
    statusEffects: ['fireblight'],
    weakestTo: ['water'],
    captureHp: '20%',
    limpHp: '15%',
    size: { goldSmall: '≤895.09 cm', average: '994.55 cm', silver: '≥1143.73 cm', goldLarge: '≥1223.29 cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✓', dungPods: '100%', flashPods: '✓', screamerPods: '✓' },
    locales: ['Scarlet Forest', 'Iceshard Cliffs', 'Wounded Hollow'],
    sleepingAreas: ['Scarlet Forest - Area 16'],
  },
  {
    slug: 'zoh-shia',
    name: 'Zoh Shia',
    elements: ['fire', 'dragon'],
    statusEffects: ['fireblight', 'dragonblight'],
    weakestTo: ['dragon'],
    captureHp: '-',
    limpHp: '15%',
    size: { goldSmall: '≤ cm', average: '4623.6 cm', silver: '≥ cm', goldLarge: '≥ cm' },
    roar: 'Strong', wind: 'Dragon', tremor: 'None',
    items: { meat: '✓', dungPods: '✗', flashPods: '✗', screamerPods: '✗' },
    locales: ['Dragontorch Shrine (Ruins of Wyveria)'],
    sleepingAreas: ['(-)'],
  },
  {
    slug: 'gogmazios',
    name: 'Gogmazios',
    elements: ['dragon'],
    statusEffects: ['fireblight'],
    weakestTo: ['fire', 'dragon'],
    captureHp: 'N/A',
    limpHp: '18%',
    size: { goldSmall: '≤ - cm', average: '4861.25 cm', silver: '≥ - cm', goldLarge: '≥ - cm' },
    roar: '-', wind: '-', tremor: '-',
    items: { meat: '✗', dungPods: '✗', flashPods: '✗', screamerPods: '✗' },
    locales: ['Forgotten Machineworks (Oilwell Basin)'],
    sleepingAreas: ['(-)'],
  },
]

function isComplete(entry: Entry): boolean {
  const hasSize =
    entry.size.goldSmall.includes('cm') &&
    entry.size.average.includes('cm') &&
    entry.size.silver.includes('cm') &&
    entry.size.goldLarge.includes('cm') &&
    !entry.size.goldSmall.includes('≤ cm') &&
    !entry.size.goldSmall.includes('≤ - cm') &&
    !entry.size.silver.includes('≥ cm') &&
    !entry.size.silver.includes('≥ - cm')
  return (
    entry.captureHp !== '' &&
    entry.limpHp !== '' &&
    entry.captureHp !== '-' &&
    entry.captureHp !== 'N/A' &&
    hasSize &&
    entry.weakestTo.length > 0
  )
}

function serializeValue(value: unknown, indent: number): string {
  const pad = ' '.repeat(indent)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((v) => `${pad}  ${JSON.stringify(v)},`).join('\n')}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return `{\n${entries.map(([k, v]) => `${pad}  ${k}: ${serializeValue(v, indent + 2)},`).join('\n')}\n${pad}}`
  }
  return String(value)
}

const records = ENTRIES.map((entry) => ({
  ...entry,
  wikiUrl: slugToWikiUrl(entry.slug),
}))

const body = records
  .map((entry) => {
    const { slug, name, wikiUrl, ...rest } = entry
    return `  ${JSON.stringify(slug)}: {
    slug: ${JSON.stringify(slug)},
    name: ${JSON.stringify(name)},
    elements: ${serializeValue(rest.elements, 4)},
    statusEffects: ${serializeValue(rest.statusEffects, 4)},
    weakestTo: ${serializeValue(rest.weakestTo, 4)},
    captureHp: ${JSON.stringify(rest.captureHp)},
    limpHp: ${JSON.stringify(rest.limpHp)},
    size: ${serializeValue(rest.size, 4)},
    roar: ${JSON.stringify(rest.roar)},
    wind: ${JSON.stringify(rest.wind)},
    tremor: ${JSON.stringify(rest.tremor)},
    items: ${serializeValue(rest.items, 4)},
    locales: ${serializeValue(rest.locales, 4)},
    sleepingAreas: ${serializeValue(rest.sleepingAreas, 4)},
    wikiUrl: ${JSON.stringify(wikiUrl)},
  }`
  })
  .join(',\n')

const output = `export type { MonsterInfo, MonsterInfoItems, MonsterInfoSize } from './monsterInfoTypes'

import type { MonsterInfo } from './monsterInfoTypes'

export const MONSTER_INFO_BY_SLUG: Record<string, MonsterInfo> = {
${body},
}

export function getMonsterInfo(slug: string): MonsterInfo | undefined {
  return MONSTER_INFO_BY_SLUG[slug]
}
`

writeFileSync(new URL('../src/data/monsterInfo.ts', import.meta.url), output)

const complete = ENTRIES.filter(isComplete).length
console.log(`Generated monsterInfo.ts with ${ENTRIES.length} monsters (${complete} complete)`)
