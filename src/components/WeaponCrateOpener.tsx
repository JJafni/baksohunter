import type { CrateHuntContext } from './CrateHunt'
import CrateHunt from './CrateHunt'
import WeaponGalleryImage from './WeaponGalleryImage'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import type { Rarity } from '../data/types'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: 'Weapon Type',
  tempered: 'Weapon Type',
  'arch-tempered': 'Weapon Type',
}

type WeaponCrateOpenerProps = {
  onHuntChange?: (ctx: CrateHuntContext) => void
}

function WeaponCrateOpener({ onHuntChange }: WeaponCrateOpenerProps) {
  const isMobile = useIsMobileLayout()
  const overlayMode = !isMobile && Boolean(onHuntChange)

  return (
    <CrateHunt
      poolCountLabel="Weapon Types in the pool"
      buttonLayoutId="weapon-crate-button"
      buttonLabels={{ open: 'DRAW', again: 'DRAW' }}
      rarityLabels={RARITY_LABELS}
      pool={WEAPON_POOL}
      pickRandom={pickRandomWeapon}
      reelSide="right"
      spinLabels={['Drawing']}
      buttonIcon="shield"
      buttonSurface="shiny"
      externalGallery={overlayMode}
      overlayMode={overlayMode}
      onHuntChange={onHuntChange}
      belowReel={
        isMobile
          ? ({ result, phase }) => (
              <WeaponGalleryImage
                result={result}
                visible={phase === 'revealed'}
                emphasized={false}
              />
            )
          : undefined
      }
    />
  )
}

export default WeaponCrateOpener
