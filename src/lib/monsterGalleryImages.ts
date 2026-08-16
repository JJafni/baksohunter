const WIKI_FILE_BASE = 'https://monsterhunterwiki.org/wiki/Special:FilePath/'

/** Overrides when the default MHWA render filename does not exist on the wiki. */
const RENDER_FILE_OVERRIDES: Record<string, string> = {
  'yian-kut-ku': 'MHWA-Yian Kut-Ku Render 001.webp',
  'jin-dahaad': 'MHWA-Jin Dahaad Render 001.webp',
  'gore-magala': 'MHWA-Gore Magala Render 001.webp',
  'lala-barina': 'MHWA-Lala Barina Render 001.webp',
  'nu-udra': 'MHWA-Nu Udra Render 001.webp',
  'omega-planetes': 'MHWilds-Omega Planetes Render 001.webp',
  'xu-wu': 'MHWA-Xu Wu Render 001.webp',
  'uth-duna': 'MHWA-Uth Duna Render 001.webp',
  'rey-dau': 'MHWA-Rey Dau Render 001.webp',
  'zoh-shia': 'MHWA-Zoh Shia Render 001.webp',
  'gogmazios': 'MHWA-Gogmazios Render 001.webp',
  'guardian-arkveld': 'MHWA-Guardian Arkveld Render 001.webp',
  'guardian-doshaguma': 'MHWA-Guardian Doshaguma Render 001.webp',
  'guardian-ebony-odogaron': 'MHWA-Guardian Ebony Odogaron Render 001.webp',
  'guardian-fulgur-anjanath': 'MHWA-Guardian Fulgur Anjanath Render 001.webp',
  'guardian-rathalos': 'MHWA-Guardian Rathalos Render 001.webp',
}

function defaultRenderFile(name: string): string {
  return `MHWA-${name} Render 001.webp`
}

export function getMonsterGalleryImageUrl(slug: string, name: string): string {
  const fileName = RENDER_FILE_OVERRIDES[slug] ?? defaultRenderFile(name)
  return `${WIKI_FILE_BASE}${encodeURIComponent(fileName)}`
}

export const MONSTER_GALLERY_SOURCE_URL = 'https://monsterhunterwiki.org/wiki/MHWilds/Image_Gallery'
