import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react'

type MobileTapSpinSectionProps = {
  ariaLabel: string
  disabled?: boolean
  onSpin: () => void
  className?: string
  style?: CSSProperties
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
      {children}
    </section>
  )
}

export default MobileTapSpinSection
