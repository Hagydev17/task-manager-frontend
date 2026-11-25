import { useState } from 'react'
import { AuthError } from '../api'
import { STATUSES, STATUS_ORDER } from '../taskStatus'
import TextField from './TextField'
import SubmitButton from './SubmitButton'

const dateFormat = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function dateLabel(task) {
  if (!task.createdAt) return ''
  const edited = task.updatedAt && task.updatedAt.slice(0, 19) !== task.createdAt.slice(0, 19)
  const date = new Date(edited ? task.updatedAt : task.createdAt)
  return `${edited ? 'Editada' : 'Creada'} el ${dateFormat.format(date)}`
}

const card = 'rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-opacity sm:p-5'
const iconButton =
  'rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50'
const secondaryButton =
  'rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50'

function Icon({ children, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

function StatusSelect({ id, value, onChange, disabled }) {
  const info = STATUSES[value] ?? STATUSES.PENDING

  return (
    <span className={`relative inline-flex items-center rounded-full ring-1 ring-inset ${info.tone}`}>
      <label htmlFor={id} className="sr-only">
        Estado de la tarea
      </label>
      <select
        id={id}
        value={value ?? 'PENDING'}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-full bg-transparent py-1 pr-7 pl-2.5 text-xs font-medium text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
            {STATUSES[s].label}
          </option>
        ))}
      </select>
      <Icon className="pointer-events-none absolute right-2 h-3 w-3">
        <path d="M6 9l6 6 6-6" />
      </Icon>
    </span>
  )
}

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [mode, setMode] = useState('view')
  const [draft, setDraft] = useState({ title: task.title, description: task.description ?? '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const done = task.status === 'COMPLETED'

  const run = async (action) => {
    setError('')
    setBusy(true)
    try {
      const result = await action()
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {})
        setError(result.error ?? '')
      }
      return result.ok
    } catch (err) {
      if (!(err instanceof AuthError)) setError('No se pudo conectar con el servidor.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const changeStatus = (status) => run(() => onUpdate(task, { status }))

  const startEdit = () => {
    setDraft({ title: task.title, description: task.description ?? '' })
    setFieldErrors({})
    setError('')
    setMode('edit')
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    const ok = await run(() =>
      onUpdate(task, { title: draft.title.trim(), description: draft.description.trim() }),
    )
    if (ok) setMode('view')
  }

  if (mode === 'edit') {
    return (
      <li className={card}>
        <form onSubmit={saveEdit} className="space-y-4">
          <TextField
            id={`edit-title-${task.id}`}
            label="Título"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            error={fieldErrors.title}
            required
            minLength={3}
            maxLength={100}
            autoFocus
          />
          <TextField
            id={`edit-description-${task.id}`}
            label="Descripción"
            multiline
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            error={fieldErrors.description}
            hint={`${draft.description.length}/500`}
            required
            minLength={3}
            maxLength={500}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setMode('view')} disabled={busy} className={secondaryButton}>
              Cancelar
            </button>
            <SubmitButton loading={busy} loadingText="Guardando…" className="px-4">
              Guardar
            </SubmitButton>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`${card} ${busy ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => changeStatus(done ? 'PENDING' : 'COMPLETED')}
          disabled={busy}
          aria-label={done ? 'Marcar como pendiente' : 'Marcar como completada'}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
            done ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300' : 'border-zinc-600 hover:border-zinc-400'
          }`}
        >
          {done && (
            <Icon className="h-3 w-3">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="3" />
            </Icon>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-medium break-words ${done ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-line break-words text-zinc-400">
              {task.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusSelect id={`status-${task.id}`} value={task.status} onChange={changeStatus} disabled={busy} />
            <span className="text-xs text-zinc-500">{dateLabel(task)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={startEdit}
            disabled={busy}
            aria-label={`Editar "${task.title}"`}
            className={`${iconButton} hover:text-zinc-100`}
          >
            <Icon>
              <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </Icon>
          </button>
          <button
            type="button"
            onClick={() => {
              setError('')
              setMode('confirm-delete')
            }}
            disabled={busy}
            aria-label={`Eliminar "${task.title}"`}
            className={`${iconButton} hover:text-red-300`}
          >
            <Icon>
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </Icon>
          </button>
        </div>
      </div>

      {mode === 'confirm-delete' && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2.5">
          <p className="text-sm text-red-200">¿Eliminar esta tarea? No se puede deshacer.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('view')} disabled={busy} className={secondaryButton}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => run(() => onDelete(task))}
              disabled={busy}
              className="rounded-lg bg-red-500/90 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50 disabled:opacity-60"
            >
              {busy ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </li>
  )
}
