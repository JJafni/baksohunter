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
}

export function StatefulButton({
  className,
  children,
  layoutId = 'crate-hunt-button',
  loadingLabels,
  icon = 'sword',
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
      animate(
        scope.current,
        { scale: 1.22 },
        { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      ),
      animate('.spin-ring', { opacity: 1, scale: 1 }, { duration: 0.35, ease: 'easeOut' }),
      animate('.button-icon', { opacity: 0, scale: 0.6 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.loader', { opacity: 1, scale: 1 }, { duration: 0.3, ease: 'easeOut' }),
    ])
  }

  const animateComplete = async () => {
    await Promise.all([
      animate(
        scope.current,
        { scale: 1 },
        { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      ),
      animate('.spin-ring', { opacity: 0, scale: 0.92 }, { duration: 0.3, ease: 'easeInOut' }),
      animate('.loader', { opacity: 0, scale: 0.6 }, { duration: 0.25, ease: 'easeInOut' }),
      animate('.button-icon', { opacity: 1, scale: 1 }, { duration: 0.3, ease: 'easeOut' }),
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

  return (
    <motion.button
      layoutId={layoutId}
      ref={scope}
      aria-busy={isLoading}
      disabled={isButtonDisabled}
      className={cn(
        'group relative flex w-full max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.12em] ring-offset-2 ring-offset-wilds-950 transition-colors duration-200',
        'border-[#9a7b3c] bg-[#2c261f] text-[#ede0c8] shadow-[0_0_18px_rgba(154,123,60,0.22)]',
        'enabled:cursor-pointer enabled:hover:border-[#b8954a] enabled:hover:bg-[#3a3228] enabled:hover:shadow-[0_0_24px_rgba(184,149,74,0.28)]',
        'disabled:cursor-not-allowed disabled:border-[#4a4234] disabled:bg-[#1a1714] disabled:text-[#7a7268] disabled:shadow-none disabled:hover:border-[#4a4234] disabled:hover:bg-[#1a1714] disabled:hover:shadow-none',
        isLoading && 'cursor-wait border-[#b8954a] shadow-[0_0_32px_rgba(184,149,74,0.35)]',
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.span
        className="spin-ring pointer-events-none absolute -inset-1 rounded-xl opacity-0"
        initial={{ opacity: 0, scale: 0.92 }}
        aria-hidden="true"
      >
        <span className="absolute inset-0 animate-[spin_0.9s_linear_infinite] rounded-xl border-2 border-[#d4b86a]/15 border-t-[#e4c878] border-r-[#d4b86a]/55" />
      </motion.span>

      <span className="button-content relative z-10 inline-flex items-center justify-center gap-1.5">
        <IconSlot icon={icon} loading={isLoading} />
        {useSpinLabels ? (
          <span className="relative inline-block overflow-hidden text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={String(label)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
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
      </span>
    </motion.button>
  )
}

function IconSlot({ icon, loading }: { icon: 'sword' | 'shield'; loading: boolean }) {
  return (
    <div
      className={`relative shrink-0 transition-[width,height] duration-300 ${loading ? 'h-6 w-6' : 'h-[18px] w-[18px]'}`}
      aria-hidden="true"
    >
      <motion.div className="button-icon absolute inset-0" initial={{ opacity: 1, scale: 1 }}>
        {icon === 'shield' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#d4b86a] transition-colors duration-200 group-disabled:text-[#5c5548]"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#d4b86a] transition-colors duration-200 group-disabled:text-[#5c5548]"
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
        initial={{ opacity: 0, scale: 0.6 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[spin_0.65s_linear_infinite] text-[#e4c878] transition-colors duration-200 group-disabled:text-[#5c5548]"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      </motion.div>
    </div>
  )
}
