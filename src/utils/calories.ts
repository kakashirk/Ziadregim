import type { FoodItem, MealEntry, Course, Meal, DailyPlan } from '@/types'

export function entryKcal(entry: MealEntry, foods: FoodItem[]): number {
  const food = foods.find((f) => f.id === entry.foodId)
  if (!food) return 0
  const grams =
    food.unit === 'unit' ? entry.quantity * (food.gramsPerUnit ?? 100) : entry.quantity
  return Math.round((grams / 100) * food.caloriesPer100g)
}

export function courseKcal(course: Course, foods: FoodItem[]): number {
  return course.items.reduce((sum, e) => sum + entryKcal(e, foods), 0)
}

export function mealKcal(meal: Meal, foods: FoodItem[]): number {
  if (meal.type === 'breakfast') {
    return (meal.items ?? []).reduce((sum, e) => sum + entryKcal(e, foods), 0)
  }
  return (meal.courses ?? []).reduce((sum, c) => sum + courseKcal(c, foods), 0)
}

export function dailyKcal(plan: DailyPlan, foods: FoodItem[]): number {
  return plan.meals.reduce((sum, m) => sum + mealKcal(m, foods), 0)
}
