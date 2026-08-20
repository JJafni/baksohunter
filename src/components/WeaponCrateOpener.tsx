import type { CrateHuntContext } from './CrateHunt'
import CrateHunt from './CrateHunt'
import { WEAPON_POOL, pickRandomWeapon } from '../data/weapons'
import type { Rarity } from '../data/types'

const RARITY_LABELS: Record<Rarity, string> = {
  normal: '',
  tempered: '',
  'arch-tempered': '',
}

type WeaponCrateOpenerProps = {
  initialContext?: CrateHuntContext | null
  onHuntChange?: (ctx: CrateHuntContext) => void
}

function WeaponCrateOpener({ initialContext = null, onHuntChange }: WeaponCrateOpenerProps) {
  const overlayMode = Boolean(onHuntChange)

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <CrateHunt
        poolCountLabel=""
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
        overlaySpinnerCentered={overlayMode}
        revealNameAfterSpinnerFade={overlayMode}
        revealLayout="inline"
        initialContext={initialContext}
        onHuntChange={onHuntChange}
      />
    </div>
  )
}

export default WeaponCrateOpener
