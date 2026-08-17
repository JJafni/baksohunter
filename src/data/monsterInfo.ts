export type { MonsterInfo, MonsterInfoItems, MonsterInfoSize } from './monsterInfoTypes'

import type { MonsterInfo } from './monsterInfoTypes'

export const MONSTER_INFO_BY_SLUG: Record<string, MonsterInfo> = {
  "ajarakan": {
    slug: "ajarakan",
    name: "Ajarakan",
    elements: [
      "fire",
      "blast",
    ],
    statusEffects: [],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1047.92 cm",
      average: "1164.36 cm",
      silver: "≥1339.01 cm",
      goldLarge: "≥1432.16 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Oilwell Basin",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Oilwell Basin - Area 6",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Ajarakan_(MHWilds)",
  },
  "arkveld": {
    slug: "arkveld",
    name: "Arkveld",
    elements: [
      "dragon",
    ],
    statusEffects: [],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1499.89 cm",
      average: "1666.54 cm",
      silver: "≥1916.52 cm",
      goldLarge: "≥2049.84 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [],
    sleepingAreas: [
      "Windward Plains - Area 17",
      "Scarlet Forest - Area 11",
      "Oilwell Basin - Area 16",
      "Iceshard Cliffs - Area 16",
      "Ruins of Wyveria - Area 15",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Arkveld_(MHWilds)",
  },
  "balahara": {
    slug: "balahara",
    name: "Balahara",
    elements: [],
    statusEffects: [],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1721.35 cm",
      average: "1912.62 cm",
      silver: "≥2199.51 cm",
      goldLarge: "≥2352.52 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✓",
    },
    locales: [
      "Windward Plains",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 15",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Balahara_(MHWilds)",
  },
  "blangonga": {
    slug: "blangonga",
    name: "Blangonga",
    elements: [
      "ice",
    ],
    statusEffects: [
      "iceblight",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤809.43 cm",
      average: "899.37 cm",
      silver: "≥1034.28 cm",
      goldLarge: "≥1106.23 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Iceshard Cliffs",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Iceshard Cliffs - Area 14",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Blangonga_(MHWilds)",
  },
  "chatacabra": {
    slug: "chatacabra",
    name: "Chatacabra",
    elements: [],
    statusEffects: [],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤448.47 cm",
      average: "498.3 cm",
      silver: "≥573.04 cm",
      goldLarge: "≥612.91 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 2",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Chatacabra_(MHWilds)",
  },
  "congalala": {
    slug: "congalala",
    name: "Congalala",
    elements: [
      "blast",
    ],
    statusEffects: [
      "poison",
      "paralysis",
      "blast",
      "soiled",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤946.04 cm",
      average: "1051.15 cm",
      silver: "≥1208.82 cm",
      goldLarge: "≥1292.91 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 7",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Congalala_(MHWilds)",
  },
  "doshaguma": {
    slug: "doshaguma",
    name: "Doshaguma",
    elements: [],
    statusEffects: [],
    weakestTo: [
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1251.42 cm",
      average: "1390.47 cm",
      silver: "≥1599.04 cm",
      goldLarge: "≥1710.28 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Scarlet Forest",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 10",
      "Scarlet Forest - Area 10",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Doshaguma_(MHWilds)",
  },
  "gore-magala": {
    slug: "gore-magala",
    name: "Gore Magala",
    elements: [],
    statusEffects: [
      "frenzy",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1589.31 cm",
      average: "1765.9 cm",
      silver: "≥1960.15 cm",
      goldLarge: "≥2066.1 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Iceshard Cliffs",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Iceshard Cliffs - Area 16",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Gore_Magala_(MHWilds)",
  },
  "gravios": {
    slug: "gravios",
    name: "Gravios",
    elements: [
      "fire",
    ],
    statusEffects: [
      "fireblight",
      "poison",
      "sleep",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1890.52 cm",
      average: "2100.58 cm",
      silver: "≥2415.67 cm",
      goldLarge: "≥2583.71 cm",
    },
    roar: "Strong",
    wind: "Minor",
    tremor: "Minor",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Oilwell Basin",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Oilwell Basin - Area 16",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Gravios_(MHWilds)",
  },
  "guardian-arkveld": {
    slug: "guardian-arkveld",
    name: "Guardian Arkveld",
    elements: [
      "dragon",
    ],
    statusEffects: [],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤ cm",
      average: "1666.54 cm",
      silver: "≥ cm",
      goldLarge: "≥ cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Guardian_Arkveld_(MHWilds)",
  },
  "guardian-doshaguma": {
    slug: "guardian-doshaguma",
    name: "Guardian Doshaguma",
    elements: [],
    statusEffects: [
      "defense down",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1251.42 cm",
      average: "1390.47 cm",
      silver: "≥1599.04 cm",
      goldLarge: "≥1710.28 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Guardian_Doshaguma_(MHWilds)",
  },
  "guardian-ebony-odogaron": {
    slug: "guardian-ebony-odogaron",
    name: "Guardian Ebony Odogaron",
    elements: [
      "dragon",
    ],
    statusEffects: [
      "bleed",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1249.88 cm",
      average: "1388.75 cm",
      silver: "≥1597.06 cm",
      goldLarge: "≥1708.16 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Guardian_Ebony_Odogaron_(MHWilds)",
  },
  "guardian-fulgur-anjanath": {
    slug: "guardian-fulgur-anjanath",
    name: "Guardian Fulgur Anjanath",
    elements: [
      "thunder",
    ],
    statusEffects: [
      "thunderblight",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1481.81 cm",
      average: "1646.46 cm",
      silver: "≥1893.43 cm",
      goldLarge: "≥2025.15 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Guardian_Fulgur_Anjanath_(MHWilds)",
  },
  "guardian-rathalos": {
    slug: "guardian-rathalos",
    name: "Guardian Rathalos",
    elements: [
      "fire",
    ],
    statusEffects: [
      "poison",
      "fireblight",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1533.8 cm",
      average: "1704.22 cm",
      silver: "≥1959.85 cm",
      goldLarge: "≥2096.19 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Guardian_Rathalos_(MHWilds)",
  },
  "gypceros": {
    slug: "gypceros",
    name: "Gypceros",
    elements: [],
    statusEffects: [
      "poison",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤867.72 cm",
      average: "964.14 cm",
      silver: "≥1108.76 cm",
      goldLarge: "≥1185.89 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Oilwell Basin",
      "Iceshard Cliffs",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 4",
      "Oilwell Basin - Area 11",
      "Iceshard Cliffs - Area 6",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Gypceros_(MHWilds)",
  },
  "hirabami": {
    slug: "hirabami",
    name: "Hirabami",
    elements: [
      "ice",
    ],
    statusEffects: [
      "iceblight",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1493.41 cm",
      average: "1659.34 cm",
      silver: "≥1808.68 cm",
      goldLarge: "≥1875.05 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Iceshard Cliffs",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Iceshard Cliffs - Area 8",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Hirabami_(MHWilds)",
  },
  "jin-dahaad": {
    slug: "jin-dahaad",
    name: "Jin Dahaad",
    elements: [
      "ice",
    ],
    statusEffects: [
      "frostblight",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "-",
    limpHp: "15%",
    size: {
      goldSmall: "≤ cm",
      average: "4560.89 cm",
      silver: "≥ cm",
      goldLarge: "≥ cm",
    },
    roar: "Strong",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Iceshard Cliffs",
      "Rimechain Peak",
    ],
    sleepingAreas: [
      "None",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Jin_Dahaad_(MHWilds)",
  },
  "lagiacrus": {
    slug: "lagiacrus",
    name: "Lagiacrus",
    elements: [
      "thunder",
    ],
    statusEffects: [
      "thunderblight",
    ],
    weakestTo: [
      "ice",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤2281.91 cm",
      average: "2535.46 cm",
      silver: "≥2763.65 cm",
      goldLarge: "≥2865.07 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✗",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 19",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Lagiacrus_(MHWilds)",
  },
  "lala-barina": {
    slug: "lala-barina",
    name: "Lala Barina",
    elements: [],
    statusEffects: [
      "paralysis",
    ],
    weakestTo: [
      "fire",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤628.87 cm",
      average: "698.75 cm",
      silver: "≥803.56 cm",
      goldLarge: "≥859.46 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 4",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Lala_Barina_(MHWilds)",
  },
  "mizutsune": {
    slug: "mizutsune",
    name: "Mizutsune",
    elements: [
      "water",
      "fire",
    ],
    statusEffects: [
      "bubbleblight",
    ],
    weakestTo: [
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1731.09 cm",
      average: "1923.43 cm",
      silver: "≥2211.95 cm",
      goldLarge: "≥2365.82 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✗",
      dungPods: "✗",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 6",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Mizutsune_(MHWilds)",
  },
  "nerscylla": {
    slug: "nerscylla",
    name: "Nerscylla",
    elements: [],
    statusEffects: [
      "poison",
      "sleep",
      "webbing",
    ],
    weakestTo: [
      "fire",
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤658.77 cm",
      average: "731.96 cm",
      silver: "≥841.76 cm",
      goldLarge: "≥900.31 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Oilwell Basin",
      "Iceshard Cliffs",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Oilwell Basin - Area 5",
      "Iceshard Cliffs - Area 4",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Nerscylla_(MHWilds)",
  },
  "nu-udra": {
    slug: "nu-udra",
    name: "Nu Udra",
    elements: [
      "fire",
    ],
    statusEffects: [
      "fireblight",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1884.33 cm",
      average: "2093.7 cm",
      silver: "≥2282.13 cm",
      goldLarge: "≥2365.88 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Oilwell Basin",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Oilwell Basin - Area 17",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Nu_Udra_(MHWilds)",
  },
  "omega-planetes": {
    slug: "omega-planetes",
    name: "Omega Planetes",
    elements: [
      "fire",
      "dragon",
    ],
    statusEffects: [
      "frostblight",
    ],
    weakestTo: [
      "thunder",
    ],
    captureHp: "-",
    limpHp: "-",
    size: {
      goldSmall: "≤ cm",
      average: "1181.85 cm",
      silver: "≥ cm",
      goldLarge: "≥ cm",
    },
    roar: "None",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✗",
      dungPods: "0%",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Rimechain Peak",
    ],
    sleepingAreas: [
      "(-)",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Omega_Planetes_(MHWilds)",
  },
  "quematrice": {
    slug: "quematrice",
    name: "Quematrice",
    elements: [
      "fire",
    ],
    statusEffects: [
      "fireblight",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1119.75 cm",
      average: "1244.17 cm",
      silver: "≥1430.79 cm",
      goldLarge: "≥1530.32 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 9",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Quematrice_(MHWilds)",
  },
  "rathalos": {
    slug: "rathalos",
    name: "Rathalos",
    elements: [
      "fire",
    ],
    statusEffects: [
      "poison",
      "fireblight",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1533.8 cm",
      average: "1704.22 cm",
      silver: "≥1959.85 cm",
      goldLarge: "≥2096.19 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
      "Oilwell Basin",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 11",
      "Oilwell Basin - Area 16",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Rathalos_(MHWilds)",
  },
  "rathian": {
    slug: "rathian",
    name: "Rathian",
    elements: [
      "fire",
    ],
    statusEffects: [
      "poison",
      "fireblight",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1578.93 cm",
      average: "1754.37 cm",
      silver: "≥2017.53 cm",
      goldLarge: "≥2157.88 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Scarlet Forest",
      "Oilwell Basin",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 10",
      "Scarlet Forest - Area 11",
      "Oilwell Basin - Area 5",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Rathian_(MHWilds)",
  },
  "rey-dau": {
    slug: "rey-dau",
    name: "Rey Dau",
    elements: [
      "thunder",
    ],
    statusEffects: [
      "thunderblight",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1851.38 cm",
      average: "2057.09 cm",
      silver: "≥2365.65 cm",
      goldLarge: "≥2530.22 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Windward Plains",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 17",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Rey_Dau_(MHWilds)",
  },
  "rompopolo": {
    slug: "rompopolo",
    name: "Rompopolo",
    elements: [],
    statusEffects: [
      "poison",
      "blast",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1078.04 cm",
      average: "1197.82 cm",
      silver: "≥1377.49 cm",
      goldLarge: "≥1473.32 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Oilwell Basin",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Oilwell Basin - Area 10",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Rompopolo_(MHWilds)",
  },
  "seregios": {
    slug: "seregios",
    name: "Seregios",
    elements: [],
    statusEffects: [
      "bleed",
    ],
    weakestTo: [
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1557.24 cm",
      average: "1730.27 cm",
      silver: "≥1989.81 cm",
      goldLarge: "≥2128.23 cm",
    },
    roar: "Weak",
    wind: "✗",
    tremor: "✗",
    items: {
      meat: "✗",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✓",
    },
    locales: [
      "Windward Plains",
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Windward Plains - Area 4",
      "Ruins of Wyveria - Area 12",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Seregios_(MHWilds)",
  },
  "uth-duna": {
    slug: "uth-duna",
    name: "Uth Duna",
    elements: [
      "water",
    ],
    statusEffects: [
      "waterblight",
    ],
    weakestTo: [
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤2681.36 cm",
      average: "2979.29 cm",
      silver: "≥3247.43 cm",
      goldLarge: "≥3366.6 cm",
    },
    roar: "Weak",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✗",
    },
    locales: [
      "Scarlet Forest",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 17",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Uth_Duna_(MHWilds)",
  },
  "xu-wu": {
    slug: "xu-wu",
    name: "Xu Wu",
    elements: [],
    statusEffects: [],
    weakestTo: [
      "thunder",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤1256.67 cm",
      average: "1396.3 cm",
      silver: "≥1605.75 cm",
      goldLarge: "≥1717.45 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Ruins of Wyveria",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Ruins of Wyveria - Area 12",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Xu_Wu_(MHWilds)",
  },
  "yian-kut-ku": {
    slug: "yian-kut-ku",
    name: "Yian Kut-Ku",
    elements: [
      "fire",
    ],
    statusEffects: [
      "fireblight",
    ],
    weakestTo: [
      "water",
    ],
    captureHp: "20%",
    limpHp: "15%",
    size: {
      goldSmall: "≤895.09 cm",
      average: "994.55 cm",
      silver: "≥1143.73 cm",
      goldLarge: "≥1223.29 cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✓",
      dungPods: "100%",
      flashPods: "✓",
      screamerPods: "✓",
    },
    locales: [
      "Scarlet Forest",
      "Iceshard Cliffs",
      "Wounded Hollow",
    ],
    sleepingAreas: [
      "Scarlet Forest - Area 16",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Yian_Kut-Ku_(MHWilds)",
  },
  "zoh-shia": {
    slug: "zoh-shia",
    name: "Zoh Shia",
    elements: [
      "fire",
      "dragon",
    ],
    statusEffects: [
      "fireblight",
      "dragonblight",
    ],
    weakestTo: [
      "dragon",
    ],
    captureHp: "-",
    limpHp: "15%",
    size: {
      goldSmall: "≤ cm",
      average: "4623.6 cm",
      silver: "≥ cm",
      goldLarge: "≥ cm",
    },
    roar: "Strong",
    wind: "Dragon",
    tremor: "None",
    items: {
      meat: "✓",
      dungPods: "✗",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Dragontorch Shrine (Ruins of Wyveria)",
    ],
    sleepingAreas: [
      "(-)",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Zoh_Shia_(MHWilds)",
  },
  "gogmazios": {
    slug: "gogmazios",
    name: "Gogmazios",
    elements: [
      "dragon",
    ],
    statusEffects: [
      "fireblight",
    ],
    weakestTo: [
      "fire",
      "dragon",
    ],
    captureHp: "N/A",
    limpHp: "18%",
    size: {
      goldSmall: "≤ - cm",
      average: "4861.25 cm",
      silver: "≥ - cm",
      goldLarge: "≥ - cm",
    },
    roar: "-",
    wind: "-",
    tremor: "-",
    items: {
      meat: "✗",
      dungPods: "✗",
      flashPods: "✗",
      screamerPods: "✗",
    },
    locales: [
      "Forgotten Machineworks (Oilwell Basin)",
    ],
    sleepingAreas: [
      "(-)",
    ],
    wikiUrl: "https://monsterhunterwiki.org/wiki/Gogmazios_(MHWilds)",
  },
}

export function getMonsterInfo(slug: string): MonsterInfo | undefined {
  return MONSTER_INFO_BY_SLUG[slug]
}
