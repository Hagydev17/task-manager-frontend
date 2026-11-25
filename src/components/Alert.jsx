const variants = {
  error: {
    box: 'border-red-500/20 bg-red-500/10 text-red-300',
    icon: <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  success: {
    box: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
}

export default function Alert({ variant = 'error', children }) {
  const { box, icon } = variants[variant]

  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${box}`}>
      <svg viewBox="0 0 24 24" className="mt-px h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon}
      </svg>
      <span>{children}</span>
    </div>
  )
}
