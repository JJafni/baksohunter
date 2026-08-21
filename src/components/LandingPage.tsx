import { motion } from 'motion/react'
import KeyArtSlideshow from './KeyArtSlideshow'
import LandingAlma from './LandingAlma'
import LandingCharacters from './LandingCharacters'

type LandingPageProps = {
  onEnter: () => void
}

function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-wilds-950 text-wilds-parchment">
      <KeyArtSlideshow className="absolute inset-0" />

      <div className="relative z-10 flex min-h-svh flex-col">
        <main className="landing-hero flex-1">
          <LandingCharacters />
          <LandingAlma />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="landing-hero-content mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-wilds-gold-light wilds-legibility-text">
              Random Hunt Generator
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[0.08em] text-wilds-parchment wilds-legibility-text sm:text-5xl md:text-6xl">
              Spin Your Next
              <span className="mt-2 block text-wilds-gold-light">Wild Hunt</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-wilds-parchment/90 wilds-legibility-text sm:text-lg">
              Draw a random monster and weapon from the Wilds roster — solo or with friends in co-op weapon
              roulette.
            </p>

            <motion.button
              type="button"
              onClick={onEnter}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 cursor-pointer rounded-lg border border-wilds-gold/50 bg-wilds-gold/15 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-wilds-gold-light shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(228,200,120,0.18)] backdrop-blur-sm transition-colors hover:border-wilds-gold/70 hover:bg-wilds-gold/25"
            >
              Enter the Hunt
            </motion.button>
          </motion.div>
        </main>

        <footer className="relative z-10 shrink-0 px-6 py-5 text-center text-[10px] leading-relaxed text-wilds-parchment/70 wilds-legibility-text sm:px-10">
          Key art &copy; Capcom &middot; Images via{' '}
          <a
            href="https://monsterhunterwiki.org/wiki/MHWilds/Image_Gallery"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-wilds-gold/40 underline-offset-2 transition-colors hover:text-wilds-gold-light"
          >
            Monster Hunter Wiki
          </a>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
