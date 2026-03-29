import { useNavigate } from 'react-router-dom'
import { useCalories } from '@/hooks/useCalories'
import { useGoal } from '@/context/GoalContext'
import { CircularProgress } from '@/components/ui/ProgressBar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'
import { todayKey, displayDate } from '@/utils/date'
import { MEAL_LABELS } from '@/types'
import type { MealType } from '@/types'

const MEAL_COLORS: Record<MealType, string> = {
  breakfast: 'bg-yellow-400',
  lunch: 'bg-brand-500',
  dinner: 'bg-indigo-500',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const dateKey = todayKey()
  const { goal, setGoal } = useGoal()
  const { total, perMeal } = useCalories(dateKey)

  const pct = goal.kcal > 0 ? (total / goal.kcal) * 100 : 0
  const remaining = Math.max(0, goal.kcal - total)

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 capitalize">{displayDate(dateKey)}</p>
      </div>

      {/* Circular progress */}
      <Card className="p-5 flex flex-col items-center gap-4">
        <CircularProgress
          value={pct}
          size={160}
          strokeWidth={14}
          label={`${total}`}
          sublabel="kcal"
        />
        <div className="text-center">
          {total >= goal.kcal ? (
            <p className="text-sm font-semibold text-red-500">
              Objectif dépassé de {total - goal.kcal} kcal
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Il reste <span className="font-bold text-brand-600">{remaining} kcal</span> à consommer
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">Objectif : {goal.kcal} kcal</p>
        </div>

        {/* Goal editor */}
        <div className="flex items-center gap-2 w-full">
          <label className="text-sm text-gray-600 shrink-0">Objectif :</label>
          <input
            type="number"
            min={500}
            max={9999}
            step={50}
            value={goal.kcal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-500">kcal</span>
        </div>
      </Card>

      {/* Per-meal breakdown */}
      <Card className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Répartition par repas</h2>
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => {
          const kcal = perMeal[type]
          const mealPct = goal.kcal > 0 ? (kcal / goal.kcal) * 100 : 0
          return (
            <div key={type} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{MEAL_LABELS[type]}</span>
                <span className="font-semibold text-gray-800">{kcal} kcal</span>
              </div>
              <ProgressBar
                value={mealPct}
                className="h-2"
                colorClass={MEAL_COLORS[type]}
              />
            </div>
          )
        })}
      </Card>

      {/* Quick action */}
      <button
        onClick={() => navigate(`/plan/${dateKey}`)}
        className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl shadow-sm transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Planifier mes repas d'aujourd'hui
      </button>
    </div>
  )
}
