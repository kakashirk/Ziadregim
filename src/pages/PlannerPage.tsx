import { useParams, useNavigate } from 'react-router-dom'
import { usePlan } from '@/context/PlanContext'
import { useCalories } from '@/hooks/useCalories'
import { useGoal } from '@/context/GoalContext'
import { MealSection } from '@/components/meal/MealSection'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { todayKey, addDays, displayDate } from '@/utils/date'

export function PlannerPage() {
  const { date } = useParams<{ date: string }>()
  const dateKey = date ?? todayKey()
  const navigate = useNavigate()
  const { getOrCreatePlan, loading } = usePlan()
  const { goal } = useGoal()
  const { total } = useCalories(dateKey)

  const plan = getOrCreatePlan(dateKey)
  const pct = goal.kcal > 0 ? (total / goal.kcal) * 100 : 0
  const remaining = Math.max(0, goal.kcal - total)

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

      {/* Meals */}
      {plan.meals.map((meal) => (
        <MealSection key={meal.type} dateKey={dateKey} meal={meal} />
      ))}
    </div>
  )
}
