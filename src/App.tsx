import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AppSkeleton from './components/AppSkeleton'
import CrateOpener from './components/CrateOpener'
import type { CrateHuntContext } from './components/CrateHunt'
import HeaderNav from './components/HeaderNav'
import MonsterGalleryImage from './components/MonsterGalleryImage'
import WeaponCrateOpener from './components/WeaponCrateOpener'
import WeaponGalleryImage from './components/WeaponGalleryImage'
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

function GalleryBackdropOverlay({
  revealed,
  emphasized,
}: {
  revealed: boolean
  emphasized: boolean
}) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-slate-950/80"
        initial={false}
        animate={{ opacity: revealed ? 0.45 : 1 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-slate-950/92 via-slate-950/78 to-slate-950/90"
        initial={false}
        animate={{ opacity: emphasized ? 1 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
    </>
  )
}

function HuntLayout({
  monsterHunt,
  onMonsterHuntChange,
  weaponHunt,
  onWeaponHuntChange,
}: {
  monsterHunt: CrateHuntContext
  onMonsterHuntChange: (ctx: CrateHuntContext) => void
  weaponHunt: CrateHuntContext
  onWeaponHuntChange: (ctx: CrateHuntContext) => void
}) {
  const monsterGalleryEmphasized =
    monsterHunt.phase === 'revealed' && monsterHunt.spinnerUiVisible
  const weaponGalleryEmphasized = weaponHunt.phase === 'revealed' && weaponHunt.spinnerUiVisible

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-0">
      <section className="relative flex min-h-0 w-full justify-center lg:overflow-hidden lg:border-r lg:border-white/10">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <MonsterGalleryImage
            result={monsterHunt.result}
            visible={monsterHunt.phase === 'revealed'}
            emphasized={monsterGalleryEmphasized}
            variant="backdrop"
          />
          <GalleryBackdropOverlay
            revealed={monsterHunt.phase === 'revealed'}
            emphasized={monsterGalleryEmphasized}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center lg:px-8 lg:py-5">
          <CrateOpener onHuntChange={onMonsterHuntChange} />
        </div>
      </section>

      <section className="relative flex min-h-0 w-full justify-center lg:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <WeaponGalleryImage
            result={weaponHunt.result}
            visible={weaponHunt.phase === 'revealed'}
            emphasized={weaponGalleryEmphasized}
            variant="backdrop"
          />
          <GalleryBackdropOverlay
            revealed={weaponHunt.phase === 'revealed'}
            emphasized={weaponGalleryEmphasized}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center lg:px-8 lg:py-5">
          <WeaponCrateOpener onHuntChange={onWeaponHuntChange} />
        </div>
      </section>
    </div>
  )
}

function AppContent() {
  const [monsterHunt, setMonsterHunt] = useState<CrateHuntContext>({
    result: null,
    phase: 'idle',
    spinnerUiVisible: true,
  })
  const [weaponHunt, setWeaponHunt] = useState<CrateHuntContext>({
    result: null,
    phase: 'idle',
    spinnerUiVisible: true,
  })

  return (
    <>
      <header className="relative z-10 flex shrink-0 items-center justify-between px-6 py-6 sm:px-10 lg:py-4">
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

      <main className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:overflow-hidden lg:px-0 lg:py-0">
        <HuntLayout
          monsterHunt={monsterHunt}
          onMonsterHuntChange={setMonsterHunt}
          weaponHunt={weaponHunt}
          onWeaponHuntChange={setWeaponHunt}
        />
      </main>

      <footer className="relative z-10 shrink-0 px-6 py-6 text-center text-[11px] text-slate-600 lg:py-3">
        Fan-made tool for Monster Hunter Wilds &middot; Monster &amp; weapon icons &copy; Capcom &middot; Not
        affiliated with Capcom or Psyonix
      </footer>
    </>
  )
}

function App() {
  const { ready, progress } = useAppReady()

  return (
    <div className="relative flex min-h-svh flex-col bg-slate-950 text-slate-100 max-lg:overflow-x-hidden lg:h-svh lg:min-h-0 lg:overflow-hidden">
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
            className="relative flex min-h-svh flex-col max-lg:min-h-svh lg:h-full lg:min-h-0 lg:overflow-hidden"
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
