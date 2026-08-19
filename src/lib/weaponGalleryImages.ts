import { WEAPON_GALLERY_URLS } from '../data/weaponGalleryUrls'
import dualBladesGallery from '../assets/gallery/weapons/dual-blades.png'
import greatSwordGallery from '../assets/gallery/weapons/great-sword.png'
import { LOCAL_WEAPON_GALLERY } from './localGalleryAssets'

export const WEAPON_GALLERY_SOURCE_URL =
  'https://nordic.ign.com/monster-hunter-wilds/90875/gallery/embed'

/** Bundled showcase art — imported directly so Vite always hashes and ships the file. */
const BUNDLED_WEAPON_GALLERY: Record<string, string> = {
  'great-sword': greatSwordGallery,
  'dual-blades': dualBladesGallery,
}

export function getWeaponGalleryImageUrl(slug: string): string | undefined {
  return BUNDLED_WEAPON_GALLERY[slug] ?? LOCAL_WEAPON_GALLERY[slug] ?? WEAPON_GALLERY_URLS[slug]
}

export function hasBundledWeaponGallery(slug: string): boolean {
  return slug in BUNDLED_WEAPON_GALLERY || slug in LOCAL_WEAPON_GALLERY
}
