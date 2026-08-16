import CrateHunt from './CrateHunt'
import { MONSTER_POOL, pickRandomMonster } from '../data/monsters'
import type { Rarity } from '../data/types'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Large Monster',
  tempered: 'Tempered Large Monster',
  'arch-tempered': 'Arch-Tempered Large Monster',
}

function CrateOpener() {
  return (
    <CrateHunt
      heading="Hunting"
      subtitle="Crate · Large Monsters"
      poolCountLabel="Large, Tempered & Arch-Tempered Monsters in the pool"
      buttonLayoutId="monster-crate-button"
      buttonLabels={{ open: 'Open Crate', again: 'Hunt Again' }}
      rarityLabels={RARITY_LABELS}
      pool={MONSTER_POOL}
      pickRandom={pickRandomMonster}
    />
  )
}

export default CrateOpener
