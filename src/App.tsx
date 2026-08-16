import BackgroundSlideshow from './components/BackgroundSlideshow'
import CrateOpener from './components/CrateOpener'
import WeaponCrateOpener from './components/WeaponCrateOpener'

function App() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-slate-950 text-slate-100">
      <BackgroundSlideshow />
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950/65"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.55)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(59,130,246,0.08),transparent_45%),radial-gradient(circle_at_100%_10%,rgba(249,115,22,0.06),transparent_40%)]"
        aria-hidden="true"
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

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <div className="flex items-start justify-center overflow-visible lg:justify-end lg:pr-6 xl:pr-10">
            <CrateOpener />
          </div>
          <div className="hidden w-px shrink-0 self-stretch bg-white/10 lg:mx-6 lg:block xl:mx-10" aria-hidden="true" />
          <div className="flex items-start justify-center overflow-visible lg:justify-start lg:pl-6 xl:pl-10">
            <WeaponCrateOpener />
          </div>
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
