import { useCallback } from 'react'
import { usePlan } from '@/context/PlanContext'
import { useFood } from '@/context/FoodContext'
import type { MealType, CourseType, DailyPlan, MealEntry } from '@/types'

/**
 * Stock-aware meal mutations.
 * Adding a food to a meal deducts from stock.
 * Removing restores the stock.
 * Updating quantity adjusts the delta.
 * Replacing a full plan (auto-generate) restores old entries then deducts new ones.
 */
export function usePlanActions(dateKey: string) {
  const { addMealEntry, removeMealEntry, updateMealEntryQty, getOrCreatePlan, replacePlan } =
    usePlan()
  const { foods, updateFood } = useFood()

  const adjustStock = useCallback(
    async (foodId: string, delta: number) => {
      const food = foods.find((f) => f.id === foodId)
      if (!food) return
      const newStock = Math.max(0, food.quantityInStock - delta)
      await updateFood(food.id, { quantityInStock: newStock })
    },
    [foods, updateFood],
  )

  /** Add a food entry to a meal and deduct stock */
  const add = useCallback(
    async (
      mealType: MealType,
      courseType: CourseType | null,
      foodId: string,
      quantity: number,
    ) => {
      await adjustStock(foodId, quantity)
      await addMealEntry(dateKey, mealType, courseType, { foodId, quantity })
    },
    [dateKey, adjustStock, addMealEntry],
  )

  /** Remove a food entry from a meal and restore stock */
  const remove = useCallback(
    async (mealType: MealType, courseType: CourseType | null, entryId: string) => {
      // Find the entry to know how much to restore
      const plan = getOrCreatePlan(dateKey)
      const meal = plan.meals.find((m) => m.type === mealType)
      let entry: MealEntry | undefined
      if (mealType === 'breakfast') {
        entry = (meal?.items ?? []).find((e) => e.id === entryId)
      } else {
        entry = meal?.courses
          ?.find((c) => c.type === courseType)
          ?.items.find((e) => e.id === entryId)
      }
      if (entry) {
        await adjustStock(entry.foodId, -entry.quantity) // negative delta = restore
      }
      await removeMealEntry(dateKey, mealType, courseType, entryId)
    },
    [dateKey, getOrCreatePlan, adjustStock, removeMealEntry],
  )

  /** Update quantity of a meal entry and adjust stock by the delta */
  const updateQty = useCallback(
    async (
      mealType: MealType,
      courseType: CourseType | null,
      entryId: string,
      newQty: number,
    ) => {
      const plan = getOrCreatePlan(dateKey)
      const meal = plan.meals.find((m) => m.type === mealType)
      let entry: MealEntry | undefined
      if (mealType === 'breakfast') {
        entry = (meal?.items ?? []).find((e) => e.id === entryId)
      } else {
        entry = meal?.courses
          ?.find((c) => c.type === courseType)
          ?.items.find((e) => e.id === entryId)
      }
      if (entry) {
        const delta = newQty - entry.quantity // positive = using more, negative = using less
        await adjustStock(entry.foodId, delta)
      }
      await updateMealEntryQty(dateKey, mealType, courseType, entryId, newQty)
    },
    [dateKey, getOrCreatePlan, adjustStock, updateMealEntryQty],
  )

  /** Replace the full day plan (auto-generate): restore old stock, deduct new */
  const replaceWithNewPlan = useCallback(
    async (newPlan: DailyPlan) => {
      const oldPlan = getOrCreatePlan(dateKey)

      // Collect all entries in old plan
      const oldEntries: MealEntry[] = []
      for (const meal of oldPlan.meals) {
        if (meal.type === 'breakfast') {
          oldEntries.push(...(meal.items ?? []))
        } else {
          for (const course of meal.courses ?? []) {
            oldEntries.push(...course.items)
          }
        }
      }

      // Collect all entries in new plan
      const newEntries: MealEntry[] = []
      for (const meal of newPlan.meals) {
        if (meal.type === 'breakfast') {
          newEntries.push(...(meal.items ?? []))
        } else {
          for (const course of meal.courses ?? []) {
            newEntries.push(...course.items)
          }
        }
      }

      // Compute net stock changes per food: old entries restore, new entries deduct
      const stockDeltas = new Map<string, number>()
      for (const e of oldEntries) {
        stockDeltas.set(e.foodId, (stockDeltas.get(e.foodId) ?? 0) - e.quantity) // restore
      }
      for (const e of newEntries) {
        stockDeltas.set(e.foodId, (stockDeltas.get(e.foodId) ?? 0) + e.quantity) // deduct
      }

      // Apply all stock changes
      for (const [foodId, delta] of stockDeltas.entries()) {
        if (delta !== 0) await adjustStock(foodId, delta)
      }

      await replacePlan(newPlan)
    },
    [dateKey, getOrCreatePlan, adjustStock, replacePlan],
  )

  return { add, remove, updateQty, replaceWithNewPlan }
}
