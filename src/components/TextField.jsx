import { useState } from 'react'

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c6.5 0 10 7 10 7a18.5 18.5 0 01-2.16 3.19M6.6 6.6A18.4 18.4 0 002 12s3.5 7 10 7a9.7 9.7 0 005.4-1.6" />
          <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
          <path d="M3 3l18 18" />
        </>
      )}
    </svg>
  )
}

export default function TextField({ id, label, type = 'text', multiline = false, error, hint, ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const message = error || hint
  const messageId = message ? `${id}-message` : undefined

  const stateClass = error
    ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20'
    : 'border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500/20'

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={messageId}
            className={`block min-h-20 w-full resize-y rounded-lg border bg-zinc-950/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:outline-none focus:ring-4 ${stateClass}`}
            {...inputProps}
          />
        ) : (
          <input
            id={id}
            type={isPassword && visible ? 'text' : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={messageId}
            className={`w-full rounded-lg border bg-zinc-950/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:outline-none focus:ring-4 ${stateClass} ${isPassword ? 'pr-11' : ''}`}
            {...inputProps}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:text-white focus-visible:outline-none"
          >
            <EyeIcon open={!visible} />
          </button>
        )}
      </div>

      {message && (
        <p id={messageId} className={`mt-1.5 text-xs ${error ? 'text-red-400' : 'text-zinc-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
