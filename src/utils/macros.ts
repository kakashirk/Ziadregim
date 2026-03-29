import type { FoodItem, MealEntry, Course, Meal, DailyPlan, Macros } from '@/types'

function gramsConsumed(entry: MealEntry, food: FoodItem): number {
  return food.unit === 'unit'
    ? entry.quantity * (food.gramsPerUnit ?? 100)
    : entry.quantity
}

export function entryMacros(entry: MealEntry, foods: FoodItem[]): Macros {
  const food = foods.find((f) => f.id === entry.foodId)
  if (!food) return { kcal: 0, proteins: 0, lipids: 0, carbs: 0, fiber: 0 }
  const g = gramsConsumed(entry, food)
  const factor = g / 100
  return {
    kcal: Math.round(food.caloriesPer100g * factor),
    proteins: Math.round((food.proteins ?? 0) * factor * 10) / 10,
    lipids: Math.round((food.lipids ?? 0) * factor * 10) / 10,
    carbs: Math.round((food.carbs ?? 0) * factor * 10) / 10,
    fiber: Math.round((food.fiber ?? 0) * factor * 10) / 10,
  }
}

function sumMacros(a: Macros, b: Macros): Macros {
  return {
    kcal: a.kcal + b.kcal,
    proteins: Math.round((a.proteins + b.proteins) * 10) / 10,
    lipids: Math.round((a.lipids + b.lipids) * 10) / 10,
    carbs: Math.round((a.carbs + b.carbs) * 10) / 10,
    fiber: Math.round((a.fiber + b.fiber) * 10) / 10,
  }
}

const ZERO: Macros = { kcal: 0, proteins: 0, lipids: 0, carbs: 0, fiber: 0 }

export function courseMacros(course: Course, foods: FoodItem[]): Macros {
  return course.items.reduce((acc, e) => sumMacros(acc, entryMacros(e, foods)), { ...ZERO })
}

export function mealMacros(meal: Meal, foods: FoodItem[]): Macros {
  if (meal.type === 'breakfast') {
    return (meal.items ?? []).reduce((acc, e) => sumMacros(acc, entryMacros(e, foods)), { ...ZERO })
  }
  return (meal.courses ?? []).reduce((acc, c) => sumMacros(acc, courseMacros(c, foods)), { ...ZERO })
}

export function dailyMacros(plan: DailyPlan, foods: FoodItem[]): Macros {
  return plan.meals.reduce((acc, m) => sumMacros(acc, mealMacros(m, foods)), { ...ZERO })
}
