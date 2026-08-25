import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const htmlPath = join(
  root,
  'node_modules/@designcodeio/threeui/lib-dist/assets/synthralos-halftone.html',
)
const outDir = join(root, 'public/koi')
const dataPath = join(root, 'src/data/koiCards.ts')

const KOI_CARD_META = [
  {
    id: 0,
    name: 'Kōhaku',
    slug: 'kohaku',
    kanji: '紅白',
    panel: '#1f1a14',
    ink: '#ede4d3',
    accent: '#b8653a',
    cursedEffect: 'Raise the hunt by one star — your next draw must use a higher star rating.',
    blessedEffect: 'Lower the hunt by one star — your next draw may use a lower star rating (minimum ★1).',
  },
  {
    id: 1,
    name: 'Shūsui',
    slug: 'shusui',
    kanji: '秋翠',
    panel: '#171410',
    ink: '#ede4d3',
    accent: '#6b7f52',
    cursedEffect: 'Blade bound — your weapon roll must be Great Sword, Long Sword, or Dual Blades.',
    blessedEffect: 'Flow state — reroll the weapon once after your draw if you dislike the result.',
  },
  {
    id: 2,
    name: 'Utsuri',
    slug: 'utsuri',
    kanji: '写り',
    panel: '#2a231b',
    ink: '#ede4d3',
    accent: '#c9a24d',
    cursedEffect: 'Shadow quarry — draw two monsters and hunt the higher-rarity target.',
    blessedEffect: 'Still hunt — keep your monster result and skip the weapon spin this round.',
  },
]

function extractVideoUrls(html) {
  const match = html.match(/const VIDEO_DATA = \[([\s\S]*?)\];/)
  if (!match) throw new Error('[extract-koi-videos] VIDEO_DATA not found')

  const urls = [...match[1].matchAll(/"(data:video\/mp4;base64,[^"]+)"/g)].map((entry) => entry[1])
  if (urls.length < KOI_CARD_META.length) {
    throw new Error(`[extract-koi-videos] Expected ${KOI_CARD_META.length} videos, found ${urls.length}`)
  }

  return urls.slice(0, KOI_CARD_META.length)
}

function extractMottos(html) {
  const names = KOI_CARD_META.map((meta) => meta.name)
  const mottos = []

  for (const name of names) {
    const pattern = new RegExp(
      `data-name="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?<p class="copy"[^>]*>([\\s\\S]*?)<\\/p>`,
    )
    const match = html.match(pattern)
    if (!match) throw new Error(`[extract-koi-videos] Motto not found for ${name}`)

    mottos.push(
      match[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
  }

  return mottos
}

export function extractKoiVideos() {
  if (!existsSync(htmlPath)) {
    console.warn('[extract-koi-videos] threeui asset missing; run npm install first.')
    return
  }

  const html = readFileSync(htmlPath, 'utf8')
  const urls = extractVideoUrls(html)
  const mottos = extractMottos(html)

  mkdirSync(outDir, { recursive: true })

  const cards = KOI_CARD_META.map((meta, index) => {
    const base64 = urls[index].replace(/^data:video\/mp4;base64,/, '')
    const fileName = `${meta.slug}.mp4`
    writeFileSync(join(outDir, fileName), Buffer.from(base64, 'base64'))
    return {
      ...meta,
      motto: mottos[index],
      videoSrc: `/koi/${fileName}`,
    }
  })

  const source = `import type { KoiCardId } from '../lib/koiCurseBridge'

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

export const KOI_CARDS: KoiCardDefinition[] = ${JSON.stringify(cards, null, 2)}

export const KOI_CARD_BY_ID: Record<KoiCardId, KoiCardDefinition> = {
  0: KOI_CARDS[0],
  1: KOI_CARDS[1],
  2: KOI_CARDS[2],
}
`

  writeFileSync(dataPath, source)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  extractKoiVideos()
}
