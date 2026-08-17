import { MONSTER_GALLERY_URLS } from '../data/monsterGalleryUrls'
import { LOCAL_MONSTER_GALLERY } from './localGalleryAssets'

export const MONSTER_GALLERY_SOURCE_URL = 'https://monsterhunterwiki.org/wiki/MHWilds/Image_Gallery'

export function getMonsterGalleryImageUrl(slug: string): string | undefined {
  return LOCAL_MONSTER_GALLERY[slug] ?? MONSTER_GALLERY_URLS[slug]
}
