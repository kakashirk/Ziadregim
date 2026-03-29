import { usePWA } from '@/hooks/usePWA'

export function OfflineBanner() {
  const { isOnline } = usePWA()
  if (isOnline) return null
  return (
    <div className="bg-yellow-400 text-yellow-900 text-xs font-medium text-center py-1.5 px-4">
      Vous êtes hors ligne — toutes les données restent disponibles.
    </div>
  )
}
