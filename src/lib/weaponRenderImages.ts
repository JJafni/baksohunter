import weaponRenders from '../data/weaponRenders.json'

export const WIKI_WEAPON_RENDER_SOURCE_URL =
  'https://monsterhunterwiki.org/wiki/Category:MHWilds_Weapon_Renders'

type WeaponRender = {
  name: string
  file: string
}

const renders = weaponRenders as Record<string, WeaponRender[]>

export function wikiWeaponRenderUrl(file: string): string {
  const wikiFileName = file.replace(/ /g, '_')
  return `https://monsterhunterwiki.org/wiki/Special:FilePath/${encodeURIComponent(wikiFileName)}`
}

export function pickRandomWeaponRender(
  weaponSlug: string,
): { name: string; file: string; url: string } | null {
  const pool = renders[weaponSlug]
  if (!pool?.length) {
    return null
  }

  const render = pool[Math.floor(Math.random() * pool.length)]!
  return {
    ...render,
    url: wikiWeaponRenderUrl(render.file),
  }
}
