import { NavLink } from 'react-router-dom'
import { todayKey } from '@/utils/date'
import { useAuth } from '@/context/AuthContext'

export function BottomNav() {
  const { isAdmin } = useAuth()

  return (
    <nav className="bg-white border-t border-gray-200 flex items-stretch">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'}`
        }
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Tableau
      </NavLink>

      <NavLink
        to={`/plan/${todayKey()}`}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'}`
        }
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Repas
      </NavLink>

      <NavLink
        to="/inventory"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'}`
        }
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Garde-manger
      </NavLink>

      {isAdmin ? (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin
        </NavLink>
      ) : (
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Réglages
        </NavLink>
      )}
    </nav>
  )
}
