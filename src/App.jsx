import { useState } from 'react'
import { getToken, getUserIdFromToken } from './api'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'

export default function App() {
  const [view, setView] = useState(() => (getUserIdFromToken(getToken()) ? 'tasks' : 'login'))
  const [notice, setNotice] = useState(null)

  const goToLogin = (newNotice = null) => {
    localStorage.removeItem('token')
    setNotice(newNotice)
    setView('login')
  }

  if (view === 'tasks') {
    return (
      <Tasks
        onLogout={() => goToLogin()}
        onSessionExpired={() =>
          goToLogin({ variant: 'error', text: 'Tu sesión terminó. Inicia sesión de nuevo.' })
        }
      />
    )
  }

  if (view === 'register') {
    return (
      <Register
        onGoToLogin={() => {
          setNotice(null)
          setView('login')
        }}
        onRegistered={() => {
          setNotice({ variant: 'success', text: 'Cuenta creada. Ya puedes iniciar sesión.' })
          setView('login')
        }}
      />
    )
  }

  return (
    <Login
      notice={notice}
      onLoggedIn={() => {
        setNotice(null)
        setView('tasks')
      }}
      onGoToRegister={() => {
        setNotice(null)
        setView('register')
      }}
    />
  )
}
