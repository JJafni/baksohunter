import type { CSSProperties } from 'react'
import {
  MOBILE_REEL_HEIGHT,
  MOBILE_REEL_MAX_WIDTH,
} from '../lib/crateConfig'

function SkeletonBlock({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />
}

function HuntColumnSkeleton({ showGallery = false }: { showGallery?: boolean }) {
  return (
    <div
      className="flex w-full max-w-[620px] shrink-0 flex-col items-stretch gap-4"
      style={{ maxWidth: MOBILE_REEL_MAX_WIDTH }}
    >
      <SkeletonBlock className="h-14 w-full rounded-lg" />
      <SkeletonBlock className="w-full rounded-2xl" style={{ height: MOBILE_REEL_HEIGHT }} />
      {showGallery ? <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl" /> : null}
      <SkeletonBlock className="h-10 w-full max-w-md rounded-lg" />
      <SkeletonBlock className="h-12 w-full rounded-lg" />
    </div>
  )
}

function AppSkeleton({ progress }: { progress: number }) {
  const percent = Math.round(progress * 100)

  return (
    <div className="relative z-20 flex min-h-svh flex-col bg-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-white/5">
        <div
          className="h-full bg-amber-400/80 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <main className="flex flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="flex justify-center lg:justify-end">
            <HuntColumnSkeleton showGallery />
          </div>
          <div className="flex justify-center lg:justify-start">
            <HuntColumnSkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AppSkeleton
