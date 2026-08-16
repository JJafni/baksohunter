import { MONSTER_GALLERY_URLS } from '../data/monsterGalleryUrls'

export const MONSTER_GALLERY_SOURCE_URL = 'https://monsterhunterwiki.org/wiki/MHWilds/Image_Gallery'

export function getMonsterGalleryImageUrl(slug: string): string | undefined {
  return MONSTER_GALLERY_URLS[slug]
}
