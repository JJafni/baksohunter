import { cn } from '../../lib/utils'
import React, { useRef, useState } from 'react'
import { motion, useAnimate } from 'motion/react'

const DEFAULT_LOADING_LABELS = [
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
  loadingLabels?: string[]
}

export function StatefulButton({
  className,
  children,
  layoutId = 'crate-hunt-button',
  loadingLabels = DEFAULT_LOADING_LABELS,
  disabled = false,
  ...props
}: StatefulButtonProps) {
  const [scope, animate] = useAnimate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingLabel, setLoadingLabel] = useState('')
  const loadingRef = useRef(false)

  const animateLoading = async () => {
    await Promise.all([
      animate('.sword', { opacity: 0, scale: 0.8 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.loader', { opacity: 1, scale: 1 }, { duration: 0.25, ease: 'easeInOut' }),
    ])
  }

  const animateComplete = async () => {
    await Promise.all([
      animate('.loader', { opacity: 0, scale: 0.8 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.sword', { opacity: 1, scale: 1 }, { duration: 0.25, ease: 'easeInOut' }),
    ])
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loadingRef.current) return

    loadingRef.current = true
    setLoadingLabel(loadingLabels[Math.floor(Math.random() * loadingLabels.length)])
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
  const showLoading = isLoading
  const isInactive = disabled && !showLoading

  return (
    <motion.button
      layout
      layoutId={layoutId}
      ref={scope}
      aria-busy={showLoading}
      disabled={isInactive}
      className={cn(
        'group flex w-max max-w-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] ring-offset-2 ring-offset-stone-950 transition duration-200',
        showLoading
          ? 'cursor-wait border-[#b8954a] bg-[#3a3228] text-[#ede0c8] shadow-[0_0_24px_rgba(184,149,74,0.28)]'
          : 'border-[#9a7b3c] bg-[#2c261f] text-[#ede0c8] shadow-[0_0_18px_rgba(154,123,60,0.22)] enabled:cursor-pointer enabled:hover:border-[#b8954a] enabled:hover:bg-[#3a3228] enabled:hover:shadow-[0_0_24px_rgba(184,149,74,0.28)] disabled:cursor-not-allowed disabled:border-[#4a4234] disabled:bg-[#1a1714] disabled:text-[#7a7268] disabled:shadow-none disabled:hover:border-[#4a4234] disabled:hover:bg-[#1a1714] disabled:hover:shadow-none',
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div layout className="flex shrink-0 items-center gap-2 whitespace-nowrap">
        <IconSlot loading={showLoading} />
        <motion.span layout className="whitespace-nowrap">
          {showLoading ? loadingLabel : children}
        </motion.span>
      </motion.div>
    </motion.button>
  )
}

function IconSlot({ loading }: { loading: boolean }) {
  return (
    <div className="relative h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <motion.div className="sword absolute inset-0" initial={{ opacity: 1, scale: 1 }}>
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
          className={cn(
            'text-[#d4b86a] transition-colors duration-200',
            loading ? 'text-[#d4b86a]' : 'group-disabled:text-[#5c5548]',
          )}
        >
          <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
        </svg>
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
          className="animate-[spin_0.45s_linear_infinite] text-[#d4b86a]"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      </motion.div>
    </div>
  )
}
