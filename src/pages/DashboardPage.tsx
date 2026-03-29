import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCalories } from '@/hooks/useCalories'
import { useGoal } from '@/context/GoalContext'
import { useFood } from '@/context/FoodContext'
import { usePlan } from '@/context/PlanContext'
import { CircularProgress, ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'
import { todayKey, addDays, displayDate, shortDate } from '@/utils/date'
import { dailyMacros } from '@/utils/macros'
import { dailyKcal } from '@/utils/calories'
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
  const { foods } = useFood()
  const { getOrCreatePlan } = usePlan()

  const plan = getOrCreatePlan(dateKey)

  const macros = useMemo(() => dailyMacros(plan, foods), [plan, foods])
  const pct = goal.kcal > 0 ? (total / goal.kcal) * 100 : 0
  const remaining = Math.max(0, goal.kcal - total)

  // 7-day history — memoized to avoid recalculating 7 plans × N foods every render
  const { weekDays, weekKcal, weekMacros, maxKcal, avgKcal, avgMacros } = useMemo(() => {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(dateKey, i - 6))
    const weekPlans = weekDays.map((d) => getOrCreatePlan(d))
    const weekKcal = weekPlans.map((p) => dailyKcal(p, foods))
    const weekMacros = weekPlans.map((p) => dailyMacros(p, foods))
    const maxKcal = Math.max(goal.kcal, ...weekKcal, 1)
    const activeDays = weekKcal.filter((k) => k > 0).length || 1
    const avgKcal = Math.round(weekKcal.reduce((a, b) => a + b, 0) / activeDays)
    const avgMacros = {
      proteins: Math.round((weekMacros.reduce((a, m) => a + m.proteins, 0) / activeDays) * 10) / 10,
      lipids:   Math.round((weekMacros.reduce((a, m) => a + m.lipids,   0) / activeDays) * 10) / 10,
      carbs:    Math.round((weekMacros.reduce((a, m) => a + m.carbs,    0) / activeDays) * 10) / 10,
      fiber:    Math.round((weekMacros.reduce((a, m) => a + m.fiber,    0) / activeDays) * 10) / 10,
    }
    return { weekDays, weekKcal, weekMacros, maxKcal, avgKcal, avgMacros }
  }, [dateKey, getOrCreatePlan, foods, goal.kcal])

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 capitalize">{displayDate(dateKey)}</p>
      </div>

      {/* Circular progress + goal */}
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
        <div className="flex items-center gap-2 w-full">
          <label className="text-sm text-gray-600 shrink-0">Objectif :</label>
          <input
            type="number" min={500} max={9999} step={50}
            value={goal.kcal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-500">kcal</span>
        </div>
      </Card>

      {/* Today's macros */}
      <Card className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">Macronutriments du jour</h2>
        <div className="grid grid-cols-4 gap-2">
          {([
            ['Protéines', macros.proteins, 'text-blue-600', 'bg-blue-50', 'border-blue-200'],
            ['Glucides',  macros.carbs,    'text-orange-600','bg-orange-50','border-orange-200'],
            ['Lipides',   macros.lipids,   'text-yellow-600','bg-yellow-50','border-yellow-200'],
            ['Fibres',    macros.fiber,    'text-green-600', 'bg-green-50', 'border-green-200'],
          ] as [string, number, string, string, string][]).map(([label, val, textCls, bgCls, borderCls]) => (
            <div key={label} className={`${bgCls} border ${borderCls} rounded-xl p-2 text-center`}>
              <p className={`text-lg font-bold ${textCls}`}>{val}g</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          ))}
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
              <ProgressBar value={mealPct} className="h-2" colorClass={MEAL_COLORS[type]} />
            </div>
          )
        })}
      </Card>

      {/* 7-day bar chart */}
      <Card className="p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-700">7 derniers jours</h2>
        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-24">
          {weekDays.map((d, i) => {
            const kcal = weekKcal[i]
            const barPct = (kcal / maxKcal) * 100
            const isToday = d === dateKey
            const overGoal = kcal > goal.kcal
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: 80 }}>
                  {kcal > 0 && (
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        overGoal ? 'bg-red-400' : isToday ? 'bg-brand-500' : 'bg-brand-300'
                      }`}
                      style={{ height: `${barPct}%`, minHeight: 4 }}
                    />
                  )}
                  {kcal === 0 && (
                    <div className="w-full rounded-t-md bg-gray-100" style={{ height: 4 }} />
                  )}
                </div>
                <p className={`text-xs ${isToday ? 'font-bold text-brand-700' : 'text-gray-400'}`}>
                  {shortDate(d).split(' ')[0]}
                </p>
              </div>
            )
          })}
        </div>
        {/* Goal line indicator */}
        <p className="text-xs text-gray-400 text-center">
          Ligne objectif : {goal.kcal} kcal — barres rouges = dépassement
        </p>

        {/* Weekly macro averages */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Moyennes hebdomadaires</p>
          <div className="grid grid-cols-5 gap-1.5">
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-sm font-bold text-gray-700">{avgKcal}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            {([
              ['P', avgMacros.proteins, 'text-blue-600'],
              ['G', avgMacros.carbs,    'text-orange-600'],
              ['L', avgMacros.lipids,   'text-yellow-600'],
              ['F', avgMacros.fiber,    'text-green-600'],
            ] as [string, number, string][]).map(([label, val, cls]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2 text-center">
                <p className={`text-sm font-bold ${cls}`}>{val}g</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
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
