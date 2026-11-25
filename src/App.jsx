import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

export default function App() {
  const [view, setView] = useState(() => (localStorage.getItem('token') ? 'home' : 'login'))
  const [successMessage, setSuccessMessage] = useState('')

  if (view === 'home') {
    return (
      <Home
        onLogout={() => {
          localStorage.removeItem('token')
          setView('login')
        }}
      />
    )
  }

  if (view === 'register') {
    return (
      <Register
        onGoToLogin={() => setView('login')}
        onRegistered={() => {
          setSuccessMessage('Cuenta creada. Ya puedes iniciar sesión.')
          setView('login')
        }}
      />
    )
  }

  return (
    <Login
      successMessage={successMessage}
      onLoggedIn={() => {
        setSuccessMessage('')
        setView('home')
      }}
      onGoToRegister={() => {
        setSuccessMessage('')
        setView('register')
      }}
    />
  )
}
