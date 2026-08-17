type QuestTypeToggleProps = {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  variant?: 'sidebar' | 'bar'
}

function QuestTypeToggle({ enabled, onChange, disabled = false, variant = 'sidebar' }: QuestTypeToggleProps) {
  const isBar = variant === 'bar'

  return (
    <div
      className={
        isBar
          ? 'flex w-full flex-col items-center gap-2'
          : 'flex w-[5.75rem] shrink-0 flex-col items-stretch gap-2 sm:w-[6.25rem]'
      }
    >
      <p className="text-center text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-wilds-muted sm:text-[10px]">
        Quest Type
      </p>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={enabled}
        onClick={() => onChange(!enabled)}
        className={`cursor-pointer rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase leading-tight tracking-[0.08em] transition sm:text-[10px] ${
          enabled
            ? 'border-wilds-gold/50 bg-wilds-gold/10 text-wilds-gold-light'
            : 'border-wilds-gold/15 bg-wilds-850/60 text-wilds-muted hover:border-wilds-gold/30 hover:text-wilds-parchment'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {enabled ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default QuestTypeToggle
