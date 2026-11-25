import { useRef, useState } from 'react'
import { AuthError } from '../api'
import TextField from './TextField'
import SubmitButton from './SubmitButton'
import Alert from './Alert'

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const titleRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)

    try {
      const result = await onCreate({ title: title.trim(), description: description.trim() })
      if (result.ok) {
        setTitle('')
        setDescription('')
        titleRef.current?.focus()
      } else {
        setFieldErrors(result.fieldErrors ?? {})
        setError(result.error ?? '')
      }
    } catch (err) {
      if (!(err instanceof AuthError)) setError('No se pudo conectar con el servidor.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
      <h2 className="text-sm font-medium text-zinc-200">Nueva tarea</h2>

      {error && <Alert>{error}</Alert>}

      <TextField
        ref={titleRef}
        id="new-task-title"
        label="Título"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          setFieldErrors((f) => ({ ...f, title: undefined }))
        }}
        error={fieldErrors.title}
        required
        minLength={3}
        maxLength={100}
        placeholder="Ej. Preparar la presentación del lunes"
      />

      <TextField
        id="new-task-description"
        label="Descripción"
        multiline
        rows={3}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value)
          setFieldErrors((f) => ({ ...f, description: undefined }))
        }}
        error={fieldErrors.description}
        hint={`${description.length}/500`}
        required
        minLength={3}
        maxLength={500}
        placeholder="Los detalles que necesitas recordar"
      />

      <div className="flex justify-end">
        <SubmitButton loading={saving} loadingText="Agregando…" className="w-full px-5 sm:w-auto">
          Agregar tarea
        </SubmitButton>
      </div>
    </form>
  )
}
