import type { VisualRarity } from '../lib/rarityColors'
import { RARITY_MARKER_COLOR } from '../lib/rarityColors'
import type { ReelOrientation } from './Reel'

type CenterMarkerProps = {
  active: boolean
  rarity?: VisualRarity
  orientation?: ReelOrientation
}

const RARITY_COLOR = RARITY_MARKER_COLOR

function CenterMarkerGlow({ active, rarity = 'normal', orientation = 'vertical' }: CenterMarkerProps) {
  const color = RARITY_COLOR[rarity]
  const isHorizontal = orientation === 'horizontal'

  if (isHorizontal) {
    return (
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 -translate-x-1/2">
        <div
          className="absolute top-1/2 -inset-y-10 left-1/2 w-[160px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700"
          style={{
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            opacity: active ? 0.5 : 0,
            filter: 'blur(10px)',
          }}
        />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2">
      <div
        className="absolute -inset-x-10 top-1/2 h-[160px] -translate-y-1/2 transition-opacity duration-700"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: active ? 0.5 : 0,
          filter: 'blur(10px)',
        }}
      />
    </div>
  )
}

function CenterMarkerFrame({ active, rarity = 'normal', orientation = 'vertical' }: CenterMarkerProps) {
  const color = RARITY_COLOR[rarity]
  const idleColor = 'rgba(138, 127, 110, 0.55)'
  const isHorizontal = orientation === 'horizontal'

  if (isHorizontal) {
    return (
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 -translate-x-1/2">
        <div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-500"
          style={{ backgroundColor: active ? color : idleColor }}
        />
        <div
          className="absolute -left-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-l-0 border-r-[13px] border-y-transparent transition-colors duration-500"
          style={{ borderRightColor: active ? color : idleColor }}
        />
        <div
          className="absolute -right-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-0 border-l-[13px] border-y-transparent transition-colors duration-500"
          style={{ borderLeftColor: active ? color : idleColor }}
        />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors duration-500"
        style={{ backgroundColor: active ? color : idleColor }}
      />
      <div
        className="absolute -left-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-l-0 border-r-[13px] border-y-transparent transition-colors duration-500"
        style={{ borderRightColor: active ? color : idleColor }}
      />
      <div
        className="absolute -right-3 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[9px] border-r-0 border-l-[13px] border-y-transparent transition-colors duration-500"
        style={{ borderLeftColor: active ? color : idleColor }}
      />
    </div>
  )
}

function CenterMarker(props: CenterMarkerProps) {
  return (
    <>
      <CenterMarkerGlow {...props} />
      <CenterMarkerFrame {...props} />
    </>
  )
}

export default CenterMarker
export { CenterMarkerGlow, CenterMarkerFrame }
