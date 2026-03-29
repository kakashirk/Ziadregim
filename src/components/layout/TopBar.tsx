import { displayDate, todayKey } from '@/utils/date'
import { useAuth } from '@/context/AuthContext'

export function TopBar() {
  const { profile, signOut } = useAuth()

  return (
    <header className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">ZiadRegim</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-brand-100 capitalize hidden sm:block">
          {displayDate(todayKey())}
        </span>
        {profile && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-200 font-medium">
              {profile.first_name}
            </span>
            <button
              onClick={signOut}
              className="p-1.5 rounded-lg hover:bg-brand-700 transition-colors"
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <svg className="w-4 h-4 text-brand-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
