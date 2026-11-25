import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import SubmitButton from '../components/SubmitButton'
import Alert from '../components/Alert'

const linkClass =
  'font-medium text-zinc-200 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:underline focus-visible:outline-none'

export default function Login({ onGoToRegister, onLoggedIn, notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('El email o la contraseña no son correctos.')
        return
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      onLoggedIn()
    } catch {
      setError('No se pudo conectar con el servidor. Revisa que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para ver tus tareas"
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={onGoToRegister} className={linkClass}>
            Regístrate
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}
        {error && <Alert>{error}</Alert>}

        <TextField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          required
          autoFocus
          autoComplete="email"
          placeholder="tu@email.com"
        />

        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <div className="pt-2">
          <SubmitButton loading={loading} loadingText="Iniciando sesión…">
            Iniciar sesión
          </SubmitButton>
        </div>
      </form>
    </AuthLayout>
  )
}
