export function Logo() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg shadow-white/5">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-950" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </div>
  )
}

export default function Brand() {
  return (
    <div className="flex items-center gap-3">
      <Logo />
      <span className="text-base font-semibold tracking-tight text-white">Task Manager</span>
    </div>
  )
}
