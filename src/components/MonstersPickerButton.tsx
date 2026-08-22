type MonstersPickerButtonProps = {
  onClick: () => void
  disabled?: boolean
  excludedCount?: number
  /** Taller touch target for mobile stacked footer controls. */
  large?: boolean
}

function MonstersPickerButton({
  onClick,
  disabled = false,
  excludedCount = 0,
  large = false,
}: MonstersPickerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-haspopup="dialog"
      className={`flex h-full w-full items-center justify-center rounded-lg border border-wilds-gold/25 bg-wilds-950/75 px-2 text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-wilds-muted transition enabled:cursor-pointer enabled:hover:border-wilds-gold/40 enabled:hover:bg-wilds-900/90 enabled:hover:text-wilds-parchment disabled:cursor-not-allowed disabled:border-wilds-gold/10 disabled:bg-wilds-950/50 disabled:text-wilds-muted/50 sm:text-xs sm:tracking-[0.1em] ${
        large ? 'min-h-[100px] py-7' : 'min-h-[50px] py-3.5'
      }`}
    >
      <span className="relative">
        Monsters
        {excludedCount > 0 ? (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500/90 px-1 text-[9px] font-black text-white">
            {excludedCount}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default MonstersPickerButton
