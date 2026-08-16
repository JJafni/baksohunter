import { WEAPON_GALLERY_URLS } from '../data/weaponGalleryUrls'

export const WEAPON_GALLERY_SOURCE_URL =
  'https://nordic.ign.com/monster-hunter-wilds/90875/gallery/embed'

export function getWeaponGalleryImageUrl(slug: string): string | undefined {
  return WEAPON_GALLERY_URLS[slug]
}
