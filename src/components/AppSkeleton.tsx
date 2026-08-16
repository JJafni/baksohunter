import type { CSSProperties } from 'react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import {
  MOBILE_REEL_HEIGHT,
  MOBILE_REEL_MAX_WIDTH,
  REEL_WIDTH,
  VIEWPORT_HEIGHT,
} from '../lib/crateConfig'

function SkeletonBlock({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />
}

function HuntColumnSkeleton({
  reelHeight,
  isMobile,
}: {
  reelHeight: number
  isMobile: boolean
}) {
  const columnWidth = isMobile ? '100%' : REEL_WIDTH

  return (
    <div
      className="flex shrink-0 flex-col items-stretch"
      style={{ width: columnWidth, maxWidth: isMobile ? MOBILE_REEL_MAX_WIDTH : REEL_WIDTH }}
    >
      <SkeletonBlock className="mb-4 h-14 w-full rounded-lg sm:mb-5" />
      <SkeletonBlock className="w-full rounded-2xl" style={{ height: reelHeight }} />
      <SkeletonBlock className="mt-6 h-12 w-full rounded-lg" />
    </div>
  )
}

function AppSkeleton() {
  const isMobile = useIsMobileLayout()
  const reelHeight = isMobile ? MOBILE_REEL_HEIGHT : VIEWPORT_HEIGHT

  return (
    <div className="relative z-20 flex min-h-svh flex-col bg-slate-950">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
            <div className="flex justify-center lg:justify-end lg:pr-6 xl:pr-10">
              {isMobile ? (
                <HuntColumnSkeleton reelHeight={reelHeight} isMobile={isMobile} />
              ) : (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-[5.75rem] shrink-0 sm:w-[6.25rem]" aria-hidden="true" />
                  <HuntColumnSkeleton reelHeight={reelHeight} isMobile={isMobile} />
                  <div className="w-[150px] shrink-0 sm:w-[185px]" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="hidden w-px shrink-0 self-stretch bg-white/10 lg:mx-6 lg:block xl:mx-10" aria-hidden="true" />

            <div className="flex justify-center lg:justify-start lg:pl-6 xl:pl-10">
              {isMobile ? (
                <HuntColumnSkeleton reelHeight={reelHeight} isMobile={isMobile} />
              ) : (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-[150px] shrink-0 sm:w-[185px]" aria-hidden="true" />
                  <HuntColumnSkeleton reelHeight={reelHeight} isMobile={isMobile} />
                  <div className="w-[5.75rem] shrink-0 sm:w-[6.25rem]" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AppSkeleton
