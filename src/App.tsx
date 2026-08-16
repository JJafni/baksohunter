import { AnimatePresence, motion } from 'motion/react'
import AppSkeleton from './components/AppSkeleton'
import CrateOpener from './components/CrateOpener'
import HeaderNav from './components/HeaderNav'
import WeaponCrateOpener from './components/WeaponCrateOpener'
import { useAppReady } from './hooks/useAppReady'

function AppBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(59,130,246,0.16),transparent_45%),radial-gradient(circle_at_100%_10%,rgba(249,115,22,0.12),transparent_40%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 26px)',
        }}
        aria-hidden="true"
      />
    </>
  )
}

function AppContent() {
  return (
    <>
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black uppercase tracking-widest text-white">
            MH<span className="text-amber-400">Wilds</span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-slate-500 sm:inline">
            Faith Hunt
          </span>
        </div>
        <HeaderNav activeMode="normal" />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="flex justify-center lg:justify-end">
            <CrateOpener />
          </div>
          <div className="flex justify-center lg:justify-start">
            <WeaponCrateOpener />
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-6 text-center text-[11px] text-slate-600">
        Fan-made tool for Monster Hunter Wilds &middot; Monster &amp; weapon icons &copy; Capcom &middot; Not
        affiliated with Capcom or Psyonix
      </footer>
    </>
  )
}

function App() {
  const { ready, progress } = useAppReady()

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-slate-950 text-slate-100">
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 bg-slate-950"
          >
            <AppSkeleton progress={progress} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative flex min-h-svh flex-col"
          >
            <AppBackground />
            <AppContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
