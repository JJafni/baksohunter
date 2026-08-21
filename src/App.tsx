import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import AppSkeleton from './components/AppSkeleton'
import CrateOpener from './components/CrateOpener'
import type { CrateHuntContext } from './components/CrateHunt'
import CoopWeaponPanel, { PlayerCountToolbarSpacer } from './components/CoopWeaponPanel'
import GalleryBackdropOverlay from './components/GalleryBackdropOverlay'
import HeaderNav from './components/HeaderNav'
import LandingPage from './components/LandingPage'
import MonsterGalleryImage from './components/MonsterGalleryImage'
import WeaponGalleryImage from './components/WeaponGalleryImage'
import { useAppReady } from './hooks/useAppReady'

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
  weaponCoopMode,
  onWeaponCoopModeChange,
}: {
  monsterHunt: CrateHuntContext
  onMonsterHuntChange: (ctx: CrateHuntContext) => void
  weaponHunt: CrateHuntContext
  onWeaponHuntChange: (ctx: CrateHuntContext) => void
  weaponCoopMode: boolean
  onWeaponCoopModeChange: (coopMode: boolean) => void
}) {
  const monsterGalleryEmphasized =
    monsterHunt.phase === 'revealed' &&
    monsterHunt.spinnerUiVisible &&
    !monsterHunt.immersiveView
  const monsterGalleryImmersive = monsterHunt.phase === 'revealed' && Boolean(monsterHunt.immersiveView)
  const weaponGalleryEmphasized = weaponHunt.phase === 'revealed' && weaponHunt.spinnerUiVisible

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 gap-8 max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:gap-0 lg:grid-cols-2 lg:items-stretch lg:gap-0">
      <section className="relative flex min-h-0 w-full max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:border-b max-lg:border-wilds-gold/15 lg:items-stretch lg:justify-center lg:border-r lg:border-wilds-gold/15">
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
          <MonsterGalleryImage
            result={monsterHunt.result}
            visible={monsterHunt.phase === 'revealed'}
            emphasized={monsterGalleryEmphasized}
            variant="backdrop"
          />
          <GalleryBackdropOverlay
            revealed={monsterHunt.phase === 'revealed'}
            emphasized={monsterGalleryEmphasized}
            immersive={monsterGalleryImmersive}
          />
        </div>
        {monsterHunt.phase !== 'idle' ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
            <MonsterGalleryImage
              result={monsterHunt.result}
              visible={monsterHunt.phase === 'revealed'}
              emphasized={monsterGalleryEmphasized}
              variant="backdrop"
            />
            <GalleryBackdropOverlay
              revealed={monsterHunt.phase === 'revealed'}
              emphasized={monsterGalleryEmphasized}
              immersive={monsterGalleryImmersive}
            />
          </div>
        ) : null}

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-visible lg:px-8">
          <PlayerCountToolbarSpacer />
          <div className="flex h-full min-h-0 w-full flex-1 flex-col self-stretch">
            <CrateOpener onHuntChange={onMonsterHuntChange} />
          </div>
        </div>
      </section>

      <section className="relative flex min-h-0 w-full max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col lg:items-stretch lg:overflow-hidden">
        {!weaponCoopMode ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
        ) : null}

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col max-lg:flex-1 max-lg:self-stretch lg:p-0">
          <CoopWeaponPanel
            onHuntChange={onWeaponHuntChange}
            onCoopModeChange={onWeaponCoopModeChange}
          />
        </div>
      </section>
    </div>
  )
}

function AppContent() {
  const [monsterHunt, setMonsterHunt] = useState<CrateHuntContext>({
    result: null,
    questType: null,
    huntStar: null,
    phase: 'idle',
    spinnerUiVisible: true,
    immersiveView: false,
  })
  const [weaponHunt, setWeaponHunt] = useState<CrateHuntContext>({
    result: null,
    questType: null,
    huntStar: null,
    phase: 'idle',
    spinnerUiVisible: true,
  })
  const [weaponCoopMode, setWeaponCoopMode] = useState(false)

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

      <main className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-x-hidden max-lg:min-h-0 max-lg:px-0 max-lg:py-0 lg:min-h-0 lg:overflow-hidden lg:px-0 lg:py-0">
        <HuntLayout
          monsterHunt={monsterHunt}
          onMonsterHuntChange={setMonsterHunt}
          weaponHunt={weaponHunt}
          onWeaponHuntChange={setWeaponHunt}
          weaponCoopMode={weaponCoopMode}
          onWeaponCoopModeChange={setWeaponCoopMode}
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
  const huntSectionRef = useRef<HTMLElement>(null)

  const scrollToHunt = useCallback(() => {
    huntSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="relative h-svh min-h-svh overflow-y-auto overflow-x-hidden scroll-smooth bg-wilds-950 text-wilds-parchment">
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-wilds-950"
          >
            <AppSkeleton progress={progress} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {ready ? (
        <>
          <LandingPage onEnter={scrollToHunt} />

          <section
            ref={huntSectionRef}
            id="hunt-section"
            className="relative flex min-h-svh flex-col lg:h-svh"
          >
            <AppBackground />
            <div className="relative flex min-h-svh flex-col lg:h-full lg:min-h-0">
              <AppContent />
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default App
