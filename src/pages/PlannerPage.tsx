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
import { generateDayMeals, canGenerate, computeSlotRatios } from '@/utils/mealGenerator'
import { generateWithAI, getApiKey } from '@/utils/aiMealGenerator'
import { todayKey, addDays, displayDate } from '@/utils/date'
import { usePlanActions } from '@/hooks/usePlanActions'
import { MEAL_LABELS } from '@/types'
import type { MealType } from '@/types'

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner']

export function PlannerPage() {
  const { date } = useParams<{ date: string }>()
  const dateKey = date ?? todayKey()
  const navigate = useNavigate()
  const { getOrCreatePlan, toggleSkipMeal, loading } = usePlan()
  const actions = usePlanActions(dateKey)
  const { foods } = useFood()
  const { goal } = useGoal()
  const { total } = useCalories(dateKey)
  const [generating, setGenerating] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [confirmGenerate, setConfirmGenerate] = useState(false)
  const [confirmGenerateAI, setConfirmGenerateAI] = useState(false)
  const hasApiKey = !!getApiKey()

  const plan = getOrCreatePlan(dateKey)
  const skippedMeals: MealType[] = plan.skippedMeals ?? []

  // Effective calorie budget per active meal, for display
  const ratios = computeSlotRatios(skippedMeals)
  const mealBudgets: Record<MealType, number> = {
    breakfast: Math.round(goal.kcal * ratios['breakfast']),
    lunch: Math.round(goal.kcal * (ratios['lunch_entree'] + ratios['lunch_plat'] + ratios['lunch_dessert'])),
    dinner: Math.round(goal.kcal * (ratios['dinner_entree'] + ratios['dinner_plat'] + ratios['dinner_dessert'])),
  }

  // Only count calories from non-skipped meals
  const activeMealTotal = plan.meals
    .filter((m) => !skippedMeals.includes(m.type))
    .reduce((sum) => sum, 0)
  void activeMealTotal // total from useCalories already excludes empty meals

  const pct = goal.kcal > 0 ? (total / goal.kcal) * 100 : 0
  const remaining = Math.max(0, goal.kcal - total)

  const hasContent = plan.meals.some((m) => {
    if (skippedMeals.includes(m.type)) return false
    if (m.type === 'breakfast') return (m.items ?? []).length > 0
    return (m.courses ?? []).some((c) => c.items.length > 0)
  })

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 80))
    const newPlan = generateDayMeals(dateKey, foods, goal.kcal, skippedMeals)
    await actions.replaceWithNewPlan(newPlan)
    setGenerating(false)
    setConfirmGenerate(false)
  }

  const handleGenerateAI = async () => {
    setAiError(null)
    setGeneratingAI(true)
    setConfirmGenerateAI(false)
    try {
      const newPlan = await generateWithAI(dateKey, foods, goal.kcal, skippedMeals)
      await actions.replaceWithNewPlan(newPlan)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
    setGeneratingAI(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeMealCount = MEAL_ORDER.filter((m) => !skippedMeals.includes(m)).length

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

        {/* Redistribution info when meals are skipped */}
        {skippedMeals.length > 0 && activeMealCount > 0 && (
          <div className="mt-1 pt-2 border-t border-gray-100 flex flex-col gap-1">
            <p className="text-xs text-gray-500 font-medium">Répartition sur les repas actifs :</p>
            <div className="flex flex-wrap gap-2">
              {MEAL_ORDER.filter((m) => !skippedMeals.includes(m)).map((m) => (
                <span key={m} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                  {MEAL_LABELS[m]} · <strong>{mealBudgets[m]} kcal</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (!canGenerate(foods)) return
            hasContent ? setConfirmGenerate(true) : handleGenerate()
          }}
          disabled={!canGenerate(foods) || generating || generatingAI || activeMealCount === 0}
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
              {canGenerate(foods) ? 'Générer mes repas' : 'Ajoutez des aliments pour générer les repas'}
            </>
          )}
        </button>

        {hasApiKey && canGenerate(foods) && activeMealCount > 0 && (
          <button
            onClick={() => hasContent ? setConfirmGenerateAI(true) : handleGenerateAI()}
            disabled={generating || generatingAI}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all border-2 disabled:opacity-40 disabled:cursor-not-allowed border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100 active:scale-95"
          >
            {generatingAI ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                L'IA prépare vos repas…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Générer avec l'IA Claude
              </>
            )}
          </button>
        )}

        {aiError && (
          <p className="text-xs text-red-500 text-center px-2">{aiError}</p>
        )}

        {!canGenerate(foods) && foods.length < 3 && (
          <p className="text-xs text-center text-gray-400">
            Ajoutez au moins 3 aliments avec du stock dans l'onglet "Aliments".
          </p>
        )}
      </div>

      {/* Meals */}
      {plan.meals.map((meal) => (
        <MealSection
          key={meal.type}
          dateKey={dateKey}
          meal={meal}
          skipped={skippedMeals.includes(meal.type)}
          onToggleSkip={() => toggleSkipMeal(dateKey, meal.type)}
        />
      ))}

      {/* Confirm AI overwrite modal */}
      <Modal
        open={confirmGenerateAI}
        onClose={() => setConfirmGenerateAI(false)}
        title="Générer avec l'IA ?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            L'IA va créer des recettes personnalisées à partir de tes aliments et <strong>remplacer</strong> les repas existants.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmGenerateAI(false)} fullWidth>
              Annuler
            </Button>
            <Button onClick={handleGenerateAI} fullWidth disabled={generatingAI} className="bg-purple-600 hover:bg-purple-700">
              {generatingAI ? 'Génération…' : 'Générer avec l\'IA'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm overwrite modal */}
      <Modal
        open={confirmGenerate}
        onClose={() => setConfirmGenerate(false)}
        title="Remplacer les repas du jour ?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Des repas ont déjà été planifiés pour ce jour. La génération automatique va les{' '}
            <strong>remplacer entièrement</strong>
            {skippedMeals.length > 0 && (
              <> (les repas ignorés ne seront pas générés)</>
            )}
            .
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
