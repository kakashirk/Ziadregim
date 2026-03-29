import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlan } from '@/context/PlanContext'
import { useFood } from '@/context/FoodContext'
import { useCalories } from '@/hooks/useCalories'
import { useGoal } from '@/context/GoalContext'
import { MealSection } from '@/components/meal/MealSection'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { generateDayMeals, canGenerate } from '@/utils/mealGenerator'
import { todayKey, addDays, displayDate } from '@/utils/date'

export function PlannerPage() {
  const { date } = useParams<{ date: string }>()
  const dateKey = date ?? todayKey()
  const navigate = useNavigate()
  const { getOrCreatePlan, replacePlan, loading } = usePlan()
  const { foods } = useFood()
  const { goal } = useGoal()
  const { total } = useCalories(dateKey)
  const [generating, setGenerating] = useState(false)
  const [confirmGenerate, setConfirmGenerate] = useState(false)

  const plan = getOrCreatePlan(dateKey)
  const pct = goal.kcal > 0 ? (total / goal.kcal) * 100 : 0
  const remaining = Math.max(0, goal.kcal - total)

  // Has the current day any food entries?
  const hasContent = plan.meals.some((m) => {
    if (m.type === 'breakfast') return (m.items ?? []).length > 0
    return (m.courses ?? []).some((c) => c.items.length > 0)
  })

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 80))
    const newPlan = generateDayMeals(dateKey, foods, goal.kcal)
    await replacePlan(newPlan)
    setGenerating(false)
    setConfirmGenerate(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/plan/${addDays(dateKey, -1)}`)}
          className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-600"
          aria-label="Jour précédent"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900 capitalize">{displayDate(dateKey)}</h1>
          <p className="text-xs text-gray-400">{dateKey}</p>
        </div>
        <button
          onClick={() => navigate(`/plan/${addDays(dateKey, 1)}`)}
          className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-600"
          aria-label="Jour suivant"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Daily summary bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Calories du jour</span>
          <span className={`font-bold ${total > goal.kcal ? 'text-red-500' : 'text-brand-600'}`}>
            {total} / {goal.kcal} kcal
          </span>
        </div>
        <ProgressBar value={pct} className="h-2.5" />
        <p className="text-xs text-gray-400">
          {total >= goal.kcal
            ? `Objectif atteint ! ${total - goal.kcal} kcal en excès.`
            : `Il reste ${remaining} kcal à consommer.`}
        </p>
      </div>

      {/* Auto-generate button */}
      <button
        onClick={() => {
          if (!canGenerate(foods)) return
          hasContent ? setConfirmGenerate(true) : handleGenerate()
        }}
        disabled={!canGenerate(foods) || generating}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all border-2 border-dashed disabled:opacity-40 disabled:cursor-not-allowed border-brand-400 text-brand-700 hover:bg-brand-50 active:scale-95"
      >
        {generating ? (
          <>
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Génération en cours…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {canGenerate(foods)
              ? 'Générer mes repas automatiquement'
              : 'Ajoutez des aliments pour générer les repas'}
          </>
        )}
      </button>

      {!canGenerate(foods) && foods.length < 3 && (
        <p className="text-xs text-center text-gray-400 -mt-2">
          Ajoutez au moins 3 aliments avec du stock dans l'onglet "Aliments".
        </p>
      )}

      {/* Meals */}
      {plan.meals.map((meal) => (
        <MealSection key={meal.type} dateKey={dateKey} meal={meal} />
      ))}

      {/* Confirm overwrite modal */}
      <Modal
        open={confirmGenerate}
        onClose={() => setConfirmGenerate(false)}
        title="Remplacer les repas du jour ?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Des repas ont déjà été planifiés pour ce jour. La génération automatique va les <strong>remplacer entièrement</strong>.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmGenerate(false)} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleGenerate} fullWidth disabled={generating}>
              {generating ? 'Génération…' : 'Remplacer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
