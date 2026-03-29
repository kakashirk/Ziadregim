import { useState } from 'react'
import { useGoal } from '@/context/GoalContext'
import { useFood } from '@/context/FoodContext'
import { usePlan } from '@/context/PlanContext'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { getApiKey, saveApiKey } from '@/utils/aiMealGenerator'

export function SettingsPage() {
  const { goal, setGoal } = useGoal()
  const [kcalInput, setKcalInput] = useState(goal.kcal.toString())
  const [apiKey, setApiKey] = useState(getApiKey())
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [kcalError, setKcalError] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const { foods } = useFood()
  const { plans } = usePlan()
  const { user, signOut, isAdmin } = useAuth()

  const handleSaveGoal = () => {
    const n = Number(kcalInput)
    if (!n || n < 500) {
      setKcalError('Objectif minimum : 500 kcal')
      return
    }
    setKcalError('')
    setGoal(n)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = async () => {
    if (!user) return
    await Promise.all([
      supabase.from('foods').delete().eq('user_id', user.id),
      supabase.from('daily_plans').delete().eq('user_id', user.id),
      supabase.from('user_settings').delete().eq('user_id', user.id),
    ])
    await signOut()
  }

  const planCount = Object.keys(plans).length

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <h1 className="text-lg font-bold text-gray-900">Réglages</h1>

      <InstallPrompt />

      {/* Claude AI API Key */}
      <Card className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Génération IA (Claude)</h2>
        <p className="text-xs text-gray-500">
          Ajoute ta clé API Anthropic pour générer des menus avec l'IA. La clé est stockée uniquement sur ton appareil.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              label="Clé API Anthropic (sk-ant-...)"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setApiKeySaved(false) }}
              placeholder="sk-ant-api..."
            />
          </div>
          <button
            onClick={() => setShowKey((v) => !v)}
            className="mt-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {showKey ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => { saveApiKey(apiKey); setApiKeySaved(true); setTimeout(() => setApiKeySaved(false), 2000) }}
            size="sm"
          >
            {apiKeySaved ? '✓ Enregistré' : 'Enregistrer'}
          </Button>
          {apiKey && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { saveApiKey(''); setApiKey('') }}
            >
              Supprimer
            </Button>
          )}
        </div>
        {apiKey && <p className="text-xs text-green-600 font-medium">✓ Clé configurée — génération IA disponible dans les repas</p>}
      </Card>

      {/* Goal */}
      <Card className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Objectif calorique quotidien</h2>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Calories par jour"
              type="number"
              min={500}
              max={9999}
              step={50}
              value={kcalInput}
              onChange={(e) => {
                setKcalInput(e.target.value)
                setKcalError('')
                setSaved(false)
              }}
              error={kcalError}
              hint="Entre 500 et 9999 kcal/jour"
            />
          </div>
          <Button onClick={handleSaveGoal} className="mb-0.5">
            {saved ? '✓' : 'Sauver'}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-700">Vos données</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-brand-600">{foods.length}</p>
            <p className="text-xs text-gray-500">aliments</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-brand-600">{planCount}</p>
            <p className="text-xs text-gray-500">jours planifiés</p>
          </div>
        </div>
      </Card>

      {isAdmin && (
        <>
          <Card className="p-4 flex flex-col gap-3 border-red-100">
            <h2 className="text-sm font-semibold text-red-700">Zone de danger</h2>
            <p className="text-xs text-gray-500">
              Effacer toutes les données supprimera définitivement vos aliments et vos plans de repas.
            </p>
            <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
              Effacer toutes les données
            </Button>
          </Card>

          <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Tout effacer ?">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Cette action est <strong>irréversible</strong>. Tous vos aliments et plans de repas seront supprimés.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setConfirmReset(false)} fullWidth>
                  Annuler
                </Button>
                <Button variant="danger" onClick={handleReset} fullWidth>
                  Tout supprimer
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
