import CrateHunt from './CrateHunt'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import type { Rarity } from '../data/types'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Weapon Type',
  tempered: 'Weapon Type',
  'arch-tempered': 'Weapon Type',
}

function WeaponCrateOpener() {
  return (
    <CrateHunt
      heading="Forging"
      subtitle="Crate · Weapons"
      poolCountLabel="Weapon Types in the pool"
      buttonLayoutId="weapon-crate-button"
      buttonLabels={{ open: 'Open Crate', again: 'Forge Again' }}
      rarityLabels={RARITY_LABELS}
      pool={WEAPON_POOL}
      pickRandom={pickRandomWeapon}
      infoSide="left"
    />
  )
}

export default WeaponCrateOpener
