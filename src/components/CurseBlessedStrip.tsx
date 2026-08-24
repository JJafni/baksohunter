import { VIEWPORT_HEIGHT } from '../lib/crateConfig'

const SECTION_BORDER = 'border-wilds-gold/15'

function CurseBlessedStrip() {
  return (
    <div
      className={`curse-blessed-strip grid w-full shrink-0 grid-cols-2 border-t ${SECTION_BORDER} bg-wilds-950/92 backdrop-blur-md`}
      style={{ minHeight: VIEWPORT_HEIGHT }}
      aria-label="Curse mode modifiers"
    >
      <section
        className={`flex min-h-full flex-col border-r ${SECTION_BORDER} bg-gradient-to-b from-rose-950/40 to-wilds-950/85 px-4 py-4 sm:px-6 sm:py-5`}
      >
        <h3 className="wilds-legibility-text shrink-0 text-center text-[10px] font-black uppercase tracking-[0.22em] text-rose-300/90 sm:text-xs">
          Cursed
        </h3>
        <div className="mt-3 flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed border-rose-400/25 bg-wilds-950/40 px-3 py-6">
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.14em] text-wilds-muted/80 sm:text-[10px]">
            Coming soon
          </p>
        </div>
      </section>

      <section className="flex min-h-full flex-col bg-gradient-to-b from-amber-950/30 to-wilds-950/85 px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="wilds-legibility-text shrink-0 text-center text-[10px] font-black uppercase tracking-[0.22em] text-wilds-gold-light/90 sm:text-xs">
          Blessed
        </h3>
        <div className="mt-3 flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed border-wilds-gold/25 bg-wilds-950/40 px-3 py-6">
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.14em] text-wilds-muted/80 sm:text-[10px]">
            Coming soon
          </p>
        </div>
      </section>
    </div>
  )
}

export default CurseBlessedStrip
