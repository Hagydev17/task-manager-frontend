export default function TaskIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 240 150" className={className} fill="none" aria-hidden="true">
      <ellipse cx="120" cy="138" rx="78" ry="7" className="fill-zinc-800/60" />

      <path d="M44 46h8M48 42v8" strokeWidth="2" strokeLinecap="round" className="stroke-zinc-600" />
      <path d="M192 104h8M196 100v8" strokeWidth="2" strokeLinecap="round" className="stroke-zinc-700" />
      <circle cx="58" cy="104" r="2.5" className="fill-zinc-700" />

      <rect x="70" y="18" width="100" height="112" rx="12" strokeWidth="2" className="fill-zinc-900 stroke-zinc-700" />
      <rect x="100" y="11" width="40" height="15" rx="5" strokeWidth="2" className="fill-zinc-800 stroke-zinc-600" />

      <rect x="86" y="43" width="14" height="14" rx="4" strokeWidth="2" className="fill-emerald-500/20 stroke-emerald-400" />
      <path d="M89.5 50.5l2.5 2.5 5-5.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-300" />
      <path d="M110 50h44" strokeWidth="3" strokeLinecap="round" className="stroke-zinc-700" />

      <rect x="86" y="69" width="14" height="14" rx="4" strokeWidth="2" className="stroke-sky-400" />
      <circle cx="93" cy="76" r="2.5" className="fill-sky-400" />
      <path d="M110 76h36" strokeWidth="3" strokeLinecap="round" className="stroke-zinc-500" />

      <rect x="86" y="95" width="14" height="14" rx="4" strokeWidth="2" className="stroke-zinc-600" />
      <path d="M110 102h28" strokeWidth="3" strokeLinecap="round" className="stroke-zinc-600" />

      <g className="motion-safe:animate-float">
        <circle cx="172" cy="34" r="16" className="fill-white" />
        <path d="M165 34.5l4.5 4.5 9-9.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-zinc-950" />
      </g>
    </svg>
  )
}
