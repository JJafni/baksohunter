import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react'

type MobileTapSpinSectionProps = {
  ariaLabel: string
  disabled?: boolean
  onSpin: () => void
  className?: string
  style?: CSSProperties
  /** Show centered tap hint while the section is idle. */
  showHint?: boolean
  children: ReactNode
}

function isInteractiveTarget(target: EventTarget | null) {
  return Boolean(
    target instanceof Element &&
      target.closest('button, a, input, select, textarea, [role="dialog"], [data-no-tap-spin]'),
  )
}

function MobileTapSpinSection({
  ariaLabel,
  disabled = false,
  onSpin,
  className = '',
  style,
  showHint = false,
  children,
}: MobileTapSpinSectionProps) {
  const handleActivate = () => {
    if (disabled) return
    onSpin()
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled || isInteractiveTarget(event.target)) return
    onSpin()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleActivate()
    }
  }

  return (
    <section
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${className} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      style={style}
    >
      {showHint ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
          <p className="wilds-legibility-text max-w-[12rem] text-center text-[11px] font-bold uppercase leading-snug tracking-[0.18em] text-wilds-parchment/75 sm:text-xs">
            Tap to spin
          </p>
        </div>
      ) : null}
      {children}
    </section>
  )
}

export default MobileTapSpinSection
