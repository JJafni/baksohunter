type LoadingProgressBarProps = {
  progress: number
}

function LoadingProgressBar({ progress }: LoadingProgressBarProps) {
  const percent = Math.round(progress * 100)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-white/10"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading assets"
    >
      <div
        className="h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.65)] transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default LoadingProgressBar
