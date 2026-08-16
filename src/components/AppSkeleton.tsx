import type { CSSProperties } from 'react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
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
      <SkeletonBlock className="w-full rounded-2xl" style={{ height: MOBILE_REEL_HEIGHT }} />
      {showGallery ? <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl" /> : null}
      <SkeletonBlock className="h-14 w-full rounded-lg" />
      <SkeletonBlock className="h-10 w-full max-w-md rounded-lg" />
      <SkeletonBlock className="h-12 w-full rounded-lg" />
    </div>
  )
}

function AppSkeleton({ progress }: { progress: number }) {
  const isMobile = useIsMobileLayout()
  const percent = Math.round(progress * 100)

  return (
    <div className="relative z-20 flex min-h-svh flex-col bg-slate-950 max-lg:overflow-x-hidden lg:h-svh lg:min-h-0 lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-white/5">
        <div
          className="h-full bg-amber-400/80 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <main className="flex min-h-0 flex-1 flex-col items-center overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:overflow-hidden lg:px-0 lg:py-0">
        {isMobile ? (
          <div className="grid w-full max-w-6xl grid-cols-1 gap-8">
            <div className="flex justify-center">
              <HuntColumnSkeleton showGallery />
            </div>
            <div className="flex justify-center">
              <HuntColumnSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-0 w-full max-w-[1400px] grid-cols-2">
            <div className="border-r border-white/10 p-6">
              <SkeletonBlock className="h-full min-h-[320px] w-full rounded-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-8 p-8">
              <HuntColumnSkeleton />
              <HuntColumnSkeleton />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AppSkeleton
