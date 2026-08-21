import HeaderNav from './HeaderNav'

type AppHeaderProps = {
  huntChromeVisible: boolean
}

function AppHeader({ huntChromeVisible }: AppHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 lg:py-4">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b backdrop-blur-sm transition-[opacity,background-color,border-color] duration-500 ease-in-out ${
          huntChromeVisible
            ? 'border-wilds-gold/10 bg-wilds-950/60 opacity-100'
            : 'border-transparent bg-transparent opacity-0'
        }`}
      />
      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`text-lg font-black uppercase tracking-widest ${
              huntChromeVisible ? 'text-wilds-parchment' : 'text-wilds-parchment wilds-legibility-text'
            }`}
          >
            MH<span className="text-wilds-gold-light">Wilds</span>
          </span>
          <span
            className={`hidden text-xs uppercase tracking-[0.3em] sm:inline ${
              huntChromeVisible ? 'text-wilds-muted' : 'text-wilds-parchment/80 wilds-legibility-text'
            }`}
          >
            Faith Hunt
          </span>
        </div>
        <HeaderNav activeMode="normal" />
      </div>
    </header>
  )
}

export default AppHeader
