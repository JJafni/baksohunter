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
      subtitle="Weapons"
      poolCountLabel="Weapon Types in the pool"
      buttonLayoutId="weapon-crate-button"
      buttonLabels={{ open: 'Draw', again: 'Draw' }}
      rarityLabels={RARITY_LABELS}
      pool={WEAPON_POOL}
      pickRandom={pickRandomWeapon}
      reelSide="right"
    />
  )
}

export default WeaponCrateOpener
