import { useEffect, useState } from 'react'
import { apiFetch, AuthError, getToken, getUserIdFromToken } from '../api'
import { STATUSES, STATUS_ORDER } from '../taskStatus'
import Brand from '../components/Brand'
import Alert from '../components/Alert'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import TaskIllustration from '../components/TaskIllustration'

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

const filters = [{ key: 'ALL', label: 'Todas' }, ...STATUS_ORDER.map((s) => ({ key: s, label: STATUSES[s].label }))]

const emptyFilterText = {
  PENDING: 'No tienes tareas pendientes.',
  IN_PROGRESS: 'No tienes tareas en progreso.',
  COMPLETED: 'Todavía no has completado ninguna tarea.',
}

function SkeletonList() {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
          <div className="flex gap-4 motion-safe:animate-pulse">
            <div className="h-5 w-5 rounded-md bg-zinc-800" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-1/2 rounded bg-zinc-800" />
              <div className="h-3 w-4/5 rounded bg-zinc-800/70" />
              <div className="h-5 w-24 rounded-full bg-zinc-800/70" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Tasks({ onLogout, onSessionExpired }) {
  const [userId] = useState(() => getUserIdFromToken(getToken()))
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [filter, setFilter] = useState('ALL')

  const request = async (path, options) => {
    try {
      return await apiFetch(path, options)
    } catch (err) {
      if (err instanceof AuthError) onSessionExpired()
      throw err
    }
  }

  const fetchTasks = async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        request(`/users/${userId}`),
        request(`/users/${userId}/tasks`),
      ])
      if (!tasksRes.ok) throw new Error('No se pudieron cargar las tareas')
      if (userRes.ok) setUser(await userRes.json())
      setTasks(await tasksRes.json())
      setLoadState('ready')
    } catch (err) {
      if (!(err instanceof AuthError)) setLoadState('error')
    }
  }

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- el estado cambia cuando responde el backend
    fetchTasks()
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- solo se cargan al entrar a la pantalla
  }, [])

  const retry = () => {
    setLoadState('loading')
    fetchTasks()
  }

  const createTask = async ({ title, description }) => {
    const res = await request(`/users/${userId}/tasks`, { method: 'POST', body: { title, description } })
    if (res.status === 400) return { fieldErrors: await res.json() }
    if (!res.ok) return { error: 'No se pudo crear la tarea. Inténtalo de nuevo.' }
    const created = await res.json()
    setTasks((ts) => [...ts, created])
    if (filter !== 'ALL' && filter !== created.status) setFilter('ALL')
    return { ok: true }
  }

  const updateTask = async (task, changes) => {
    const body = { title: task.title, description: task.description, status: task.status, ...changes }
    const res = await request(`/users/${userId}/tasks/${task.id}`, { method: 'PATCH', body })
    if (res.status === 400) return { fieldErrors: await res.json() }
    if (!res.ok) return { error: 'No se pudieron guardar los cambios.' }
    const updated = await res.json()
    setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)))
    return { ok: true }
  }

  const deleteTask = async (task) => {
    const res = await request(`/users/${userId}/tasks/${task.id}`, { method: 'DELETE' })
    if (!res.ok) return { error: 'No se pudo eliminar la tarea.' }
    setTasks((ts) => ts.filter((t) => t.id !== task.id))
    return { ok: true }
  }

  const counts = { ALL: tasks.length, PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 }
  tasks.forEach((t) => {
    if (counts[t.status] !== undefined) counts[t.status] += 1
  })

  const visibleTasks = [...tasks]
    .sort((a, b) => b.id - a.id)
    .filter((t) => filter === 'ALL' || t.status === filter)

  const rawFirstName = user?.name?.trim().split(' ')[0]
  const firstName = rawFirstName && rawFirstName.charAt(0).toLocaleUpperCase('es') + rawFirstName.slice(1)

  const summary =
    tasks.length === 0
      ? 'Todavía no tienes tareas. Agrega la primera para empezar.'
      : [
          plural(counts.PENDING, 'pendiente', 'pendientes'),
          `${counts.IN_PROGRESS} en progreso`,
          plural(counts.COMPLETED, 'completada', 'completadas'),
        ].join(' · ')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand />
          <div className="flex items-center gap-3">
            {user && <span className="hidden text-sm text-zinc-400 sm:block">{user.email}</span>}
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 motion-safe:animate-fade-in sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-white">
            {firstName ? `Hola, ${firstName}` : 'Tus tareas'}
          </h1>
          {loadState === 'ready' && <p className="mt-1.5 text-sm text-zinc-500">{summary}</p>}
        </div>

        <TaskForm onCreate={createTask} />

        <section aria-labelledby="task-list-title" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="task-list-title" className="text-sm font-medium text-zinc-200">
              Mis tareas
            </h2>

            <div className="-mx-1 flex gap-1 overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-1">
              {filters.map((f) => {
                const active = filter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                    <span className="rounded-md bg-zinc-950/60 px-1.5 text-xs text-zinc-400 tabular-nums">
                      {counts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {loadState === 'loading' && <SkeletonList />}

          {loadState === 'error' && (
            <div className="space-y-3">
              <Alert>No se pudieron cargar tus tareas. Revisa que el backend esté corriendo.</Alert>
              <button
                type="button"
                onClick={retry}
                className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Reintentar
              </button>
            </div>
          )}

          {loadState === 'ready' && tasks.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-800 px-6 py-12 text-center">
              <TaskIllustration className="h-24 w-auto" />
              <p className="mt-4 text-sm font-medium text-zinc-200">Aún no tienes tareas</p>
              <p className="mt-1 text-sm text-zinc-500">Escribe tu primera tarea en el formulario de arriba.</p>
            </div>
          )}

          {loadState === 'ready' && tasks.length > 0 && visibleTasks.length === 0 && (
            <p className="rounded-xl border border-dashed border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
              {emptyFilterText[filter]}
            </p>
          )}

          {loadState === 'ready' && visibleTasks.length > 0 && (
            <ul className="space-y-3">
              {visibleTasks.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
