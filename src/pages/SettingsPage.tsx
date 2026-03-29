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

export function SettingsPage() {
  const { goal, setGoal } = useGoal()
  const [kcalInput, setKcalInput] = useState(goal.kcal.toString())
  const [kcalError, setKcalError] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const { foods } = useFood()
  const { plans } = usePlan()
  const { user, signOut } = useAuth()

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

      {/* Reset */}
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
    </div>
  )
}
