import { useMemo } from 'react'
import { usePlan } from '@/context/PlanContext'
import { useFood } from '@/context/FoodContext'
import { mealKcal, dailyKcal } from '@/utils/calories'
import type { MealType } from '@/types'

export function useCalories(dateKey: string) {
  const { getOrCreatePlan } = usePlan()
  const { foods } = useFood()
  const plan = getOrCreatePlan(dateKey)

  return useMemo(() => {
    const perMeal: Record<MealType, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    }
    plan.meals.forEach((m) => {
      perMeal[m.type] = mealKcal(m, foods)
    })
    return {
      perMeal,
      total: dailyKcal(plan, foods),
    }
  }, [plan, foods])
}
