import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from './OfflineBanner'

export function Shell() {
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
