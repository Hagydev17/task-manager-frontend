import AuthLayout from '../components/AuthLayout'

export default function Home({ onLogout }) {
  return (
    <AuthLayout
      title="Sesión iniciada"
      subtitle="La pantalla de tareas llega en el siguiente paso"
      footer={null}
      showcase={false}
    >
      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Cerrar sesión
      </button>
    </AuthLayout>
  )
}
