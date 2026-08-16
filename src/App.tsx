function App() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-orange-950 via-stone-950 to-stone-950 text-stone-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-tight">
          Bakso<span className="text-orange-400">Hunter</span>
        </div>
        <nav className="flex gap-4 text-sm text-stone-400">
          <a href="#" className="transition hover:text-stone-100">
            Explore
          </a>
          <a href="#" className="transition hover:text-stone-100">
            About
          </a>
        </nav>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
          Find the best bakso near you
        </p>

        <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
          Hunt down your next bowl of bakso
        </h1>

        <p className="mt-6 max-w-xl text-lg text-stone-400">
          Discover local bakso spots, compare ratings, and never miss a great bowl again.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-stone-950 transition hover:bg-orange-400"
          >
            Start exploring
          </button>
          <button
            type="button"
            className="rounded-lg border border-stone-700 px-6 py-3 font-medium text-stone-200 transition hover:border-stone-500 hover:bg-stone-900"
          >
            Add a spot
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
