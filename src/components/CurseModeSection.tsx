const SECTION_BORDER = 'border-wilds-gold/15'

function CurseModeSection() {
  return (
    <section
      className={`curse-mode-section shrink-0 border-t ${SECTION_BORDER} bg-wilds-950/92 backdrop-blur-md`}
      aria-label="Curse mode"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 bg-gradient-to-b from-rose-950/30 to-wilds-950/85 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="wilds-legibility-text text-center text-[10px] font-black uppercase tracking-[0.24em] text-rose-300/90 sm:text-xs">
          Curse Mode
        </h2>
        <div className="flex min-h-[5.5rem] items-center justify-center rounded-md border border-dashed border-rose-400/20 bg-wilds-950/45 px-3 py-4 sm:min-h-[6rem]">
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.14em] text-wilds-muted/80 sm:text-[10px]">
            Coming soon
          </p>
        </div>
      </div>
    </section>
  )
}

export default CurseModeSection
