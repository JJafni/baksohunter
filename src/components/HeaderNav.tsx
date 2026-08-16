type HeaderNavProps = {
  activeMode?: 'normal'
}

function HeaderNav({ activeMode = 'normal' }: HeaderNavProps) {
  return (
    <nav
      aria-label="Game mode"
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 p-1.5 sm:gap-2"
    >
      <button
        type="button"
        aria-current={activeMode === 'normal' ? 'page' : undefined}
        className="cursor-default rounded-md border border-amber-400/60 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-300 sm:px-4 sm:py-2 sm:text-xs"
      >
        Normal
      </button>
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 sm:px-4 sm:py-2 sm:text-xs"
        title="Coming soon"
      >
        Curse Mode
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] tracking-[0.08em] text-slate-500 sm:text-[10px]">
          Coming Soon
        </span>
      </span>
    </nav>
  )
}

export default HeaderNav
