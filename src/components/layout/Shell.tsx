import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from './OfflineBanner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export function Shell() {
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const page = location.pathname.startsWith('/plan') ? '/plan' : location.pathname
    supabase.from('page_views').insert({ user_id: user.id, page })
  }, [location.pathname, user?.id])

  return (
    <div className="flex flex-col h-svh max-w-md mx-auto bg-gray-50">
      <OfflineBanner />
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
