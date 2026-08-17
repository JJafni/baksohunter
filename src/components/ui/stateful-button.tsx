import { cn } from '../../lib/utils'
import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'

export const SPIN_LABELS = [
  'Get ready...',
  'Cooked?',
  'Fingers crossed',
  'Picking',
  'GG',
]

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
  layoutId?: string
  /** When set, a random label is shown while loading. Omit for a static label. */
  loadingLabels?: string[]
  icon?: 'sword' | 'shield'
  /** Hunt uses sandblasted matte; Draw uses grey shiny gradient. */
  surface?: 'matte' | 'shiny'
}

export function StatefulButton({
  className,
  children,
  layoutId = 'crate-hunt-button',
  loadingLabels,
  icon = 'sword',
  surface = 'matte',
  disabled = false,
  ...props
}: StatefulButtonProps) {
  const [scope, animate] = useAnimate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingLabel, setLoadingLabel] = useState('')
  const loadingRef = useRef(false)
  const useSpinLabels = Boolean(loadingLabels?.length)

  const animateLoading = async () => {
    await Promise.all([
      animate('.button-icon', { opacity: 0, scale: 0.8 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.loader', { opacity: 1, scale: 1 }, { duration: 0.25, ease: 'easeInOut' }),
    ])
  }

  const animateComplete = async () => {
    await Promise.all([
      animate('.loader', { opacity: 0, scale: 0.8 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.button-icon', { opacity: 1, scale: 1 }, { duration: 0.25, ease: 'easeInOut' }),
    ])
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loadingRef.current) return

    loadingRef.current = true
    if (useSpinLabels) {
      setLoadingLabel(loadingLabels![Math.floor(Math.random() * loadingLabels!.length)])
    }
    setIsLoading(true)

    try {
      await animateLoading()
      await props.onClick?.(event)
      await animateComplete()
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }

  const { onClick, onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, ...buttonProps } = props
  const isButtonDisabled = disabled || isLoading
  const label = isLoading && useSpinLabels ? loadingLabel : children

  const isShiny = surface === 'shiny'

  const labelContent = (
    <>
      <IconSlot icon={icon} tone={isShiny ? 'silver' : 'gold'} />
      {useSpinLabels ? (
        <span className="relative inline-block overflow-hidden text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(label)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="block whitespace-nowrap"
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : (
        <span className="whitespace-nowrap">{children}</span>
      )}
    </>
  )

  return (
    <motion.button
      layoutId={layoutId}
      ref={scope}
      aria-busy={isLoading}
      disabled={isButtonDisabled}
      className={cn(
        'group relative flex w-full max-w-full items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold uppercase tracking-[0.12em] ring-offset-2 ring-offset-wilds-950 transition-[border-color,color,box-shadow,filter] duration-200',
        isShiny
          ? 'wilds-shiny-button gap-0 border-0 p-[1px] text-[#e5e5e5] enabled:cursor-pointer enabled:hover:text-white disabled:cursor-not-allowed disabled:text-[#6b6b6b]'
          : 'wilds-spin-matte gap-2 border-2 px-6 py-3.5 border-[#9a7b3c] text-[#ede0c8] enabled:cursor-pointer enabled:hover:border-[#b8954a] enabled:hover:text-[#f2e8d4] disabled:cursor-not-allowed disabled:border-[#4a4234] disabled:text-[#7a7268] disabled:hover:border-[#4a4234]',
        !isShiny && isLoading && 'cursor-wait enabled:hover:border-[#b8954a]',
        isShiny && isLoading && 'cursor-wait',
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      {isShiny ? (
        <span className="wilds-shiny-inner gap-2 px-6 py-3.5">{labelContent}</span>
      ) : (
        <span className="relative z-10 inline-flex items-center justify-center gap-1.5">{labelContent}</span>
      )}
    </motion.button>
  )
}

function IconSlot({ icon, tone }: { icon: 'sword' | 'shield'; tone: 'gold' | 'silver' }) {
  const iconClass =
    tone === 'silver'
      ? 'text-[#c8c8c8] transition-colors duration-200 group-disabled:text-[#5c5c5c]'
      : 'text-[#d4b86a] transition-colors duration-200 group-disabled:text-[#5c5548]'
  return (
    <div className="relative h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <motion.div className="button-icon absolute inset-0" initial={{ opacity: 1, scale: 1 }}>
        {icon === 'shield' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconClass}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconClass}
          >
            <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
            <path d="M13 19l6-6" />
            <path d="M16 16l4 4" />
            <path d="M19 21l2-2" />
          </svg>
        )}
      </motion.div>

      <motion.div
        className="loader pointer-events-none absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`animate-[spin_0.45s_linear_infinite] ${iconClass}`}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      </motion.div>
    </div>
  )
}
