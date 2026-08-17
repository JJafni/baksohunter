const weaponGalleryModules = import.meta.glob<string>('../assets/gallery/weapons/*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

const monsterGalleryModules = import.meta.glob<string>('../assets/gallery/monsters/*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
})

function slugFromGalleryPath(path: string): string {
  const filename = path.split('/').pop() ?? ''
  return filename.replace(/\.(png|webp|jpe?g)$/i, '')
}

function modulesToRecord(modules: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [slugFromGalleryPath(path), url]),
  )
}

export const LOCAL_WEAPON_GALLERY = modulesToRecord(weaponGalleryModules)
export const LOCAL_MONSTER_GALLERY = modulesToRecord(monsterGalleryModules)

export function hasLocalWeaponGallery(slug: string): boolean {
  return slug in LOCAL_WEAPON_GALLERY
}

export function hasLocalMonsterGallery(slug: string): boolean {
  return slug in LOCAL_MONSTER_GALLERY
}
