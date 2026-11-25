export default function SubmitButton({ loading, loadingText, children, className = 'w-full' }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`flex ${className} items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  )
}
