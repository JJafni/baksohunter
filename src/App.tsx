import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="flex items-center gap-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-16 w-16 motion-safe:animate-[spin_20s_linear_infinite]"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight">
        Vite + React + TypeScript + Tailwind
      </h1>

      <p className="mt-4 text-slate-400">
        Edit <code className="rounded bg-slate-800 px-2 py-1 text-sm text-violet-300">src/App.tsx</code> and save to test HMR
      </p>

      <button
        type="button"
        className="mt-8 rounded-lg border border-violet-500/50 bg-violet-500/10 px-6 py-2 font-medium text-violet-300 transition hover:border-violet-400 hover:bg-violet-500/20"
        onClick={() => setCount((value) => value + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
