import type { CSSProperties } from 'react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
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
      {showGallery ? <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl" /> : null}
      <SkeletonBlock className="h-12 w-full rounded-lg" />
      <SkeletonBlock className="h-10 w-full max-w-md rounded-lg" />
    </div>
  )
}

function AppSkeleton({ progress }: { progress: number }) {
  const isMobile = useIsMobileLayout()
  const percent = Math.round(progress * 100)

  return (
    <div className="relative z-20 flex min-h-svh flex-col bg-wilds-950 max-lg:overflow-x-hidden lg:h-svh lg:min-h-0 lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-wilds-gold/10">
        <div
          className="h-full bg-wilds-gold/80 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <main className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:overflow-hidden lg:px-0 lg:py-0">
        {isMobile ? (
          <div className="grid w-full grid-cols-1 gap-8">
            <div className="flex justify-center">
              <HuntColumnSkeleton showGallery />
            </div>
            <div className="flex justify-center">
              <HuntColumnSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-0 w-full grid-cols-2">
            <div className="relative border-r border-wilds-gold/15 p-6">
              <SkeletonBlock className="absolute inset-0 h-full w-full rounded-none opacity-40" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
                <SkeletonBlock className="h-12 w-full max-w-md rounded-lg" />
                <SkeletonBlock className="h-10 w-full max-w-sm rounded-lg" />
              </div>
            </div>
            <div className="relative p-6">
              <SkeletonBlock className="absolute inset-0 h-full w-full rounded-none opacity-40" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
                <SkeletonBlock className="h-12 w-full max-w-md rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AppSkeleton
