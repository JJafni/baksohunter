import type { MonsterEntry } from '../data/monsters'

type RevealPanelProps = {
  result: MonsterEntry | null
  visible: boolean
}

function RevealPanel({ result, visible }: RevealPanelProps) {
  if (!result) {
    return <div className="hidden w-[320px] lg:block" />
  }

  const accent = result.tempered ? 'text-rose-400' : 'text-sky-400'

  return (
    <div
      className={`w-full max-w-[320px] transition-all duration-700 ease-out lg:w-[320px] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
        {result.name}
      </h2>
      <p className={`mt-2 text-sm font-bold uppercase tracking-[0.25em] ${accent}`}>
        {result.tempered ? 'Tempered Large Monster' : 'Large Monster'}
      </p>
    </div>
  )
}

export default RevealPanel
