import Brand from './Brand'
import TaskIllustration from './TaskIllustration'

const features = [
  {
    title: 'Crea tareas en segundos',
    text: 'Anota lo que tienes pendiente con un título y una breve descripción.',
    icon: <path d="M12 5v14M5 12h14" />,
  },
  {
    title: 'Sigue su avance',
    text: 'Cambia el estado de cada tarea conforme avanzas y ten claro qué te falta.',
    icon: <path d="M4 12h4l3-7 4 14 3-7h2" />,
  },
  {
    title: 'Tu espacio personal',
    text: 'Crea tu cuenta personal y comienza a organizarte.',
    icon: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </>
    ),
  },
]

const previewTasks = [
  { title: 'Preparar la presentación del lunes', status: 'En progreso', tone: 'bg-sky-500/10 text-sky-300 ring-sky-500/20' },
  { title: 'Pagar el recibo de luz', status: 'Pendiente', tone: 'bg-amber-500/10 text-amber-300 ring-amber-500/20' },
  { title: 'Responder correos del cliente', status: 'Completada', tone: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20', done: true },
]

function FeatureIcon({ children }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </div>
  )
}

function TaskPreview() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-xl shadow-black/30">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Mis tareas</span>
        <span className="text-xs text-zinc-600">3 tareas</span>
      </div>
      <ul className="space-y-2">
        {previewTasks.map((task) => (
          <li key={task.title} className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/50 px-3 py-2.5">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${task.done ? 'border-emerald-500/50 bg-emerald-500/20' : 'border-zinc-700'}`}>
              {task.done && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </span>
            <span className={`min-w-0 flex-1 truncate text-sm ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
              {task.title}
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${task.tone}`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Showcase() {
  return (
    <section className="hidden lg:block">
      <Brand />

      <h2 className="mt-10 max-w-md text-4xl font-semibold leading-tight tracking-tight text-balance text-white">
        Organiza tus tareas y tu día, sin complicaciones.
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
        Anota lo que tienes que hacer, sigue su avance y marca lo que ya terminaste. Todo en un solo lugar y solo para ti.
      </p>

      <ul className="mt-10 space-y-5">
        {features.map((f) => (
          <li key={f.title} className="flex gap-4">
            <FeatureIcon>{f.icon}</FeatureIcon>
            <div>
              <p className="text-sm font-medium text-zinc-200">{f.title}</p>
              <p className="mt-0.5 max-w-sm text-sm leading-relaxed text-zinc-500">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 max-w-md">
        <TaskPreview />
      </div>
    </section>
  )
}

function MobileFeatures() {
  return (
    <div className="mt-10 border-t border-zinc-800/80 pt-8 lg:hidden">
      <ul className="space-y-4">
        {features.map((f) => (
          <li key={f.title} className="flex gap-3">
            <FeatureIcon>{f.icon}</FeatureIcon>
            <div>
              <p className="text-sm font-medium text-zinc-200">{f.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <TaskPreview />
      </div>
    </div>
  )
}

export default function AuthLayout({ title, subtitle, children, footer, showcase = true }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.07),transparent_50%)]"
      />

      <div
        className={`relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-16 px-4 py-12 sm:px-6 lg:px-10 ${
          showcase ? 'lg:grid-cols-2' : ''
        }`}
      >
        {showcase && <Showcase />}

        <main className="mx-auto w-full max-w-sm motion-safe:animate-fade-in">
          <div className={`mb-8 ${showcase ? 'lg:hidden' : ''}`}>
            <Brand />
            {showcase && (
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Organiza tus tareas y tu día. Anota lo pendiente, sigue su avance y marca lo que ya terminaste.
              </p>
            )}
          </div>

          {showcase && <TaskIllustration className="mx-auto mb-6 h-32 w-auto" />}

          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
            {children}
          </div>

          {footer && <p className="mt-6 text-center text-sm text-zinc-500">{footer}</p>}

          {showcase && <MobileFeatures />}
        </main>
      </div>
    </div>
  )
}
