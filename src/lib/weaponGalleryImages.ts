import { WEAPON_GALLERY_URLS } from '../data/weaponGalleryUrls'
import { LOCAL_WEAPON_GALLERY } from './localGalleryAssets'

export const WEAPON_GALLERY_SOURCE_URL =
  'https://nordic.ign.com/monster-hunter-wilds/90875/gallery/embed'

export function getWeaponGalleryImageUrl(slug: string): string | undefined {
  return LOCAL_WEAPON_GALLERY[slug] ?? WEAPON_GALLERY_URLS[slug]
}
