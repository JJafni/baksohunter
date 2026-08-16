import CrateOpener from './components/CrateOpener'
import WeaponCrateOpener from './components/WeaponCrateOpener'

function App() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(59,130,246,0.16),transparent_45%),radial-gradient(circle_at_100%_10%,rgba(249,115,22,0.12),transparent_40%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 26px)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black uppercase tracking-widest text-white">
            MH<span className="text-amber-400">Wilds</span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-slate-500 sm:inline">
            Crate Hunt
          </span>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Forbidden Lands</span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full flex-col items-center gap-16 lg:flex-row lg:justify-center lg:gap-3 xl:gap-4">
          <CrateOpener />
          <div className="hidden w-px self-stretch bg-white/10 lg:block" aria-hidden="true" />
          <WeaponCrateOpener />
        </div>
      </main>

      <footer className="relative z-10 px-6 py-6 text-center text-[11px] text-slate-600">
        Fan-made tool for Monster Hunter Wilds &middot; Monster &amp; weapon icons &copy; Capcom &middot; Not
        affiliated with Capcom or Psyonix
      </footer>
    </div>
  )
}

export default App
