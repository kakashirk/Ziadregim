import { displayDate } from '@/utils/date'
import { todayKey } from '@/utils/date'

export function TopBar() {
  return (
    <header className="bg-brand-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight">ZiadRegim</span>
      </div>
      <span className="text-sm text-brand-100 capitalize">{displayDate(todayKey())}</span>
    </header>
  )
}
