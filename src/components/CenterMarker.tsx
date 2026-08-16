import type { Rarity } from '../data/types'

type CenterMarkerProps = {
  active: boolean
  rarity?: Rarity
}

const RARITY_COLOR: Record<Rarity, string> = {
  normal: 'rgba(56,189,248,0.95)',
  tempered: 'rgba(244,63,94,0.95)',
  'arch-tempered': 'rgba(251,191,36,0.95)',
}

function CenterMarker({ active, rarity = 'normal' }: CenterMarkerProps) {
  const color = RARITY_COLOR[rarity]
  const idleColor = 'rgba(148,163,184,0.55)'

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
      <div
        className="absolute -inset-x-10 top-1/2 h-[160px] -translate-y-1/2 transition-opacity duration-700"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: active ? 0.5 : 0,
          filter: 'blur(10px)',
        }}
      />
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

export default CenterMarker
