import { usePWA } from '@/hooks/usePWA'
import { Button } from '@/components/ui/Button'

export function InstallPrompt() {
  const { canInstall, triggerInstall } = usePWA()

  if (!canInstall) return null

  return (
    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center gap-3">
      <div className="text-2xl">📲</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-900">Installer l'application</p>
        <p className="text-xs text-brand-700">Accédez à ZiadRegim directement depuis votre écran d'accueil.</p>
      </div>
      <Button size="sm" onClick={triggerInstall}>
        Installer
      </Button>
    </div>
  )
}
