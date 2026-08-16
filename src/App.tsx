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
import { WILDS_BACKDROP_OVERLAY } from './lib/wildsTheme'

function AppBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_-5%,rgba(107,127,82,0.22),transparent_42%),radial-gradient(circle_at_88%_15%,rgba(184,101,58,0.16),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(201,162,77,0.08),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 wilds-leather-texture opacity-80" aria-hidden="true" />
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
  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-0">
      <section className="relative flex min-h-0 w-full justify-center lg:overflow-hidden lg:border-r lg:border-wilds-gold/15">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <MonsterGalleryImage
            result={monsterHunt.result}
            visible={monsterHunt.phase === 'revealed'}
            variant="backdrop"
          />
          <div className={`pointer-events-none absolute inset-0 z-[1] ${WILDS_BACKDROP_OVERLAY}`} />
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
            variant="backdrop"
          />
          <div className={`pointer-events-none absolute inset-0 z-[1] ${WILDS_BACKDROP_OVERLAY}`} />
        </div>

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center lg:px-8 lg:py-5">
          <WeaponCrateOpener onHuntChange={onWeaponHuntChange} />
        </div>
      </section>
    </div>
  )
}

function AppContent() {
  const [monsterHunt, setMonsterHunt] = useState<CrateHuntContext>({ result: null, phase: 'idle' })
  const [weaponHunt, setWeaponHunt] = useState<CrateHuntContext>({ result: null, phase: 'idle' })

  return (
    <>
      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-wilds-gold/10 bg-wilds-950/60 px-6 py-6 backdrop-blur-sm sm:px-10 lg:py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black uppercase tracking-widest text-wilds-parchment">
            MH<span className="text-wilds-gold-light">Wilds</span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-wilds-muted sm:inline">
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

      <footer className="relative z-10 shrink-0 border-t border-wilds-gold/10 px-6 py-6 text-center text-[11px] text-wilds-muted lg:py-3">
        Fan-made tool for Monster Hunter Wilds &middot; Monster &amp; weapon icons &copy; Capcom &middot; Not
        affiliated with Capcom or Psyonix
      </footer>
    </>
  )
}

function App() {
  const { ready, progress } = useAppReady()

  return (
    <div className="relative flex min-h-svh flex-col bg-wilds-950 text-wilds-parchment max-lg:overflow-x-hidden lg:h-svh lg:min-h-0 lg:overflow-hidden">
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 bg-wilds-950"
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
