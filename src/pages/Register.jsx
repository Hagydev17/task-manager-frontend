import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import SubmitButton from '../components/SubmitButton'
import Alert from '../components/Alert'

const linkClass =
  'font-medium text-zinc-200 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:underline focus-visible:outline-none'

export default function Register({ onGoToLogin, onRegistered }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setFieldErrors((errs) => ({ ...errs, [field]: undefined }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8081/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.status === 400) {
        setFieldErrors(await res.json())
        return
      }

      if (!res.ok) {
        setError('No se pudo crear la cuenta. Es posible que ese email ya esté registrado.')
        return
      }

      onRegistered()
    } catch {
      setError('No se pudo conectar con el servidor. Revisa que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  const passwordLength = form.password.length
  const passwordHint = passwordLength === 0
    ? 'Entre 8 y 16 caracteres'
    : `${passwordLength}/16 caracteres${passwordLength < 8 ? ` · faltan ${8 - passwordLength}` : ''}`

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a organizar tus tareas en segundos"
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={onGoToLogin} className={linkClass}>
            Inicia sesión
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}

        <TextField
          id="register-name"
          label="Nombre"
          value={form.name}
          onChange={updateField('name')}
          error={fieldErrors.name}
          required
          autoFocus
          autoComplete="name"
          placeholder="Tu nombre"
        />

        <TextField
          id="register-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={updateField('email')}
          error={fieldErrors.email}
          required
          autoComplete="email"
          placeholder="tu@email.com"
        />

        <TextField
          id="register-password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={updateField('password')}
          error={fieldErrors.password}
          hint={passwordHint}
          required
          minLength={8}
          maxLength={16}
          autoComplete="new-password"
          placeholder="••••••••"
        />

        <div className="pt-2">
          <SubmitButton loading={loading} loadingText="Creando cuenta…">
            Crear cuenta
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  )
}
