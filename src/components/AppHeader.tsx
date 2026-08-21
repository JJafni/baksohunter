import HeaderNav from './HeaderNav'

type AppHeaderProps = {
  visible: boolean
  onShow: () => void
  chromeSolid: boolean
}

function HeaderRevealArrow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show header"
      className="fixed left-1/2 top-0 z-50 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-b-lg border border-t-0 border-wilds-gold/20 bg-wilds-950/80 px-4 py-1.5 text-wilds-gold-light shadow-[0_6px_20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors hover:border-wilds-gold/40 hover:bg-wilds-900/90 hover:text-wilds-parchment"
    >
      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3">
        <path d="M2 4.5 6 8.5 10 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </button>
  )
}

function AppHeader({ visible, onShow, chromeSolid }: AppHeaderProps) {
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-transform duration-300 ease-in-out sm:px-10 lg:py-4 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 border-b backdrop-blur-sm transition-colors duration-300 ${
            chromeSolid
              ? 'border-wilds-gold/10 bg-wilds-950/60'
              : 'border-transparent bg-transparent'
          }`}
        />
        <div className="relative flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-black uppercase tracking-widest ${
                chromeSolid ? 'text-wilds-parchment' : 'text-wilds-parchment wilds-legibility-text'
              }`}
            >
              MH<span className="text-wilds-gold-light">Wilds</span>
            </span>
            <span
              className={`hidden text-xs uppercase tracking-[0.3em] sm:inline ${
                chromeSolid ? 'text-wilds-muted' : 'text-wilds-parchment/80 wilds-legibility-text'
              }`}
            >
              Faith Hunt
            </span>
          </div>
          <HeaderNav activeMode="normal" />
        </div>
      </header>

      {!visible ? <HeaderRevealArrow onClick={onShow} /> : null}
    </>
  )
}

export default AppHeader
