import { useEffect, useState } from 'react'
import { getMonsterInfo } from '../data/monsterInfo'
import MonsterInfoModal from './MonsterInfoModal'

type MonsterInfoButtonProps = {
  onClick: () => void
  className?: string
  size?: 'sm' | 'md'
}

export function MonsterInfoButton({
  onClick,
  className = '',
  size = 'sm',
}: MonsterInfoButtonProps) {
  const sizeClass = size === 'md' ? 'size-10 sm:size-11' : 'size-7 sm:size-8'
  const iconClass = size === 'md' ? 'size-5 sm:size-[1.35rem]' : 'size-3.5 sm:size-4'

  return (
    <button
      type="button"
      aria-label="View monster info"
      onClick={onClick}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-wilds-gold/30 bg-wilds-850/80 text-wilds-gold-light transition hover:border-wilds-gold/50 hover:bg-wilds-800 hover:text-wilds-parchment ${sizeClass} ${className}`}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className={iconClass}>
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path fill="currentColor" d="M9.2 8.4h1.6V14H9.2V8.4zm0-2.4h1.6V6H9.2V3.6z" />
      </svg>
    </button>
  )
}

type MonsterInfoTriggerProps = {
  slug: string
  icon: string
  visible: boolean
  revealKey?: number
  className?: string
  buttonSize?: 'sm' | 'md'
}

function MonsterInfoTrigger({
  slug,
  icon,
  visible,
  revealKey = 0,
  className = '',
  buttonSize = 'md',
}: MonsterInfoTriggerProps) {
  const [open, setOpen] = useState(false)
  const info = getMonsterInfo(slug)

  useEffect(() => {
    setOpen(false)
  }, [revealKey, slug])

  if (!info || !visible) return null

  return (
    <>
      <MonsterInfoButton
        size={buttonSize}
        className={className}
        onClick={() => setOpen(true)}
      />
      <MonsterInfoModal info={info} icon={icon} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default MonsterInfoTrigger
