type HeaderNavProps = {
  activeMode?: 'normal'
}

function HeaderNav({ activeMode = 'normal' }: HeaderNavProps) {
  return (
    <nav
      aria-label="Game mode"
      className="flex items-center gap-1.5 rounded-lg border border-wilds-gold/25 bg-wilds-900/70 p-1.5 shadow-[inset_0_1px_0_rgba(228,200,120,0.06)] sm:gap-2"
    >
      <button
        type="button"
        aria-current={activeMode === 'normal' ? 'page' : undefined}
        className="cursor-default rounded-md border border-wilds-gold/50 bg-wilds-gold/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-wilds-gold-light sm:px-4 sm:py-2 sm:text-xs"
      >
        Normal
      </button>
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-wilds-muted sm:px-4 sm:py-2 sm:text-xs"
        title="Coming soon"
      >
        Curse Mode
        <span className="rounded border border-wilds-gold/15 bg-wilds-850/80 px-2 py-0.5 text-[9px] tracking-[0.08em] text-wilds-muted sm:text-[10px]">
          Coming Soon
        </span>
      </span>
    </nav>
  )
}

export default HeaderNav
