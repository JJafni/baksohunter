import { cn } from '../../lib/utils'
import React from 'react'
import { motion, useAnimate } from 'motion/react'

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export function StatefulButton({ className, children, ...props }: StatefulButtonProps) {
  const [scope, animate] = useAnimate()

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
    if (props.disabled) return
    await animateLoading()
    await props.onClick?.(event)
    await animateComplete()
  }

  const { onClick, onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, ...buttonProps } = props

  return (
    <motion.button
      layout
      layoutId="crate-hunt-button"
      ref={scope}
      className={cn(
        'flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-[#9a7b3c] bg-[#2c261f] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#ede0c8] shadow-[0_0_18px_rgba(154,123,60,0.22)] ring-offset-2 ring-offset-stone-950 transition duration-200 hover:border-[#b8954a] hover:bg-[#3a3228] hover:shadow-[0_0_24px_rgba(184,149,74,0.28)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div layout className="flex items-center gap-2">
        <IconSlot />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

function IconSlot() {
  return (
    <div className="relative h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sword absolute inset-0 text-[#d4b86a]"
        initial={{ opacity: 1, scale: 1 }}
      >
        <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="loader pointer-events-none absolute inset-0 animate-spin text-[#d4b86a]"
        initial={{ opacity: 0, scale: 0.8 }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3a9 9 0 1 0 9 9" />
      </motion.svg>
    </div>
  )
}
