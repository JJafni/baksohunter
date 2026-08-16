import type { CSSProperties } from 'react'
import { useIsMobileLayout } from '../hooks/useIsMobileLayout'
import { MOBILE_REEL_HEIGHT, REEL_WIDTH, VIEWPORT_HEIGHT } from '../lib/crateConfig'

type AppSkeletonProps = {
  progress: number
}

function SkeletonBlock({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />
}

function HuntColumnSkeleton({
  showFilters,
  reelHeight,
  blockWidth,
}: {
  showFilters: boolean
  reelHeight: number | string
  blockWidth: number | string
}) {
  return (
    <div className="flex w-full max-w-[620px] flex-col items-center gap-4 lg:w-fit lg:max-w-none">
      <div className="flex flex-col items-center gap-2 text-center">
        <SkeletonBlock className="h-8 w-28 sm:h-10 sm:w-32" />
        <SkeletonBlock className="h-5 w-36 sm:h-6 sm:w-44" />
      </div>

      {showFilters ? (
        <div className="flex w-full max-w-[620px] flex-col items-center gap-2">
          <SkeletonBlock className="h-3 w-20" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-7 w-16 sm:w-[4.5rem]" />
            ))}
          </div>
        </div>
      ) : null}

      <SkeletonBlock
        className="rounded-2xl"
        style={{ width: blockWidth, height: reelHeight }}
      />

      <SkeletonBlock className="h-12 w-full rounded-lg" style={{ maxWidth: blockWidth }} />

      <SkeletonBlock className="h-3 w-32" />
    </div>
  )
}

function AppSkeleton({ progress }: AppSkeletonProps) {
  const isMobile = useIsMobileLayout()
  const blockWidth = isMobile ? '100%' : REEL_WIDTH
  const reelHeight = isMobile ? MOBILE_REEL_HEIGHT : VIEWPORT_HEIGHT
  const percent = Math.round(progress * 100)

  return (
    <div className="relative z-20 flex min-h-svh flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-white/5">
        <div
          className="h-full bg-amber-400/80 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-6 w-28" />
          <SkeletonBlock className="hidden h-3 w-20 sm:block" />
        </div>
        <SkeletonBlock className="h-3 w-24" />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <div className="flex items-start justify-center lg:justify-end lg:pr-6 xl:pr-10">
            <HuntColumnSkeleton showFilters reelHeight={reelHeight} blockWidth={blockWidth} />
          </div>

          <div className="hidden w-px shrink-0 self-stretch bg-white/10 lg:mx-6 lg:block xl:mx-10" aria-hidden="true" />

          <div className="flex items-start justify-center lg:justify-start lg:pl-6 xl:pl-10">
            <HuntColumnSkeleton showFilters={false} reelHeight={reelHeight} blockWidth={blockWidth} />
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
          Loading hunt assets {percent}%
        </p>
      </main>

      <footer className="px-6 py-6 text-center">
        <SkeletonBlock className="mx-auto h-3 w-64 max-w-full" />
      </footer>
    </div>
  )
}

export default AppSkeleton
