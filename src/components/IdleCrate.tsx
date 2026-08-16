import { MOBILE_REEL_HEIGHT, REEL_WIDTH } from '../lib/crateConfig'
import type { ReelOrientation } from './Reel'

type IdleCrateProps = {
  spinning?: boolean
  orientation?: ReelOrientation
}

function IdleCrate({ spinning = false, orientation = 'vertical' }: IdleCrateProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`relative flex items-center justify-center transition-opacity duration-500 ${
        spinning ? 'opacity-40' : 'opacity-100'
      } ${isHorizontal ? 'h-full w-full' : ''}`}
      style={
        isHorizontal
          ? { width: '100%', height: MOBILE_REEL_HEIGHT }
          : { width: REEL_WIDTH, height: REEL_WIDTH }
      }
    >
      <div className="absolute inset-0 rounded-3xl border-2 border-wilds-gold/45 bg-gradient-to-br from-wilds-gold/15 via-wilds-900/70 to-wilds-950 shadow-[0_0_40px_10px_rgba(201,162,77,0.18)]" />
      <div
        className="absolute inset-3 rounded-2xl opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(201,162,77,0.35) 0px, rgba(201,162,77,0.35) 1px, transparent 1px, transparent 12px)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        className="relative h-20 w-20 text-wilds-gold-light drop-shadow-[0_0_18px_rgba(201,162,77,0.5)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      >
        <path d="M20 78 C 28 55, 30 40, 26 20" />
        <path d="M40 82 C 46 58, 47 38, 44 15" />
        <path d="M60 82 C 58 58, 58 38, 62 15" />
        <path d="M80 78 C 74 55, 72 40, 76 20" />
      </svg>
    </div>
  )
}

export default IdleCrate
