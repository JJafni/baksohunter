type HeaderNavProps = {
  activeMode?: 'normal'
}

function HeaderNav({ activeMode = 'normal' }: HeaderNavProps) {
  return (
    <nav
      aria-label="Game mode"
      className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1 sm:gap-1.5"
    >
      <button
        type="button"
        aria-current={activeMode === 'normal' ? 'page' : undefined}
        className="cursor-default rounded-md border border-amber-400/60 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-300 sm:px-3 sm:text-[10px]"
      >
        Normal
      </button>
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 sm:px-3 sm:text-[10px]"
        title="Coming soon"
      >
        Curse Mode
        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] tracking-[0.08em] text-slate-500 sm:text-[9px]">
          Coming Soon
        </span>
      </span>
    </nav>
  )
}

export default HeaderNav
