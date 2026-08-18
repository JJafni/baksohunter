type MonstersPickerButtonProps = {
  onClick: () => void
  disabled?: boolean
  excludedCount?: number
}

function MonstersPickerButton({ onClick, disabled = false, excludedCount = 0 }: MonstersPickerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-haspopup="dialog"
      className="wilds-spin-matte flex h-full min-h-[50px] w-full items-center justify-center rounded-lg border-2 border-[#7a3030] px-2 py-3.5 text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-[#f0e0e0] transition enabled:cursor-pointer enabled:hover:border-[#9a4040] enabled:hover:text-[#faf0f0] disabled:cursor-not-allowed disabled:border-[#3a2020] disabled:text-[#7a6060] sm:text-xs sm:tracking-[0.1em]"
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
