interface Props {
  message: string
  onRetry?: () => void
}

export function DbError({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 px-4">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-700 text-center">Erreur de connexion à la base de données</p>
      <p className="text-xs text-red-600 font-mono bg-red-50 rounded-xl px-3 py-2 text-center break-all">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
