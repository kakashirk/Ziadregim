import { v4 as uuidv4 } from 'uuid'
import type { FoodItem, DailyPlan, MealEntry, Meal, MealType } from '@/types'
import { MEAL_COURSES } from '@/types'
import type { MealRole } from '@/data/foodDatabase'
import { FOOD_DATABASE } from '@/data/foodDatabase'

/**
 * Base distribution of daily calories per slot.
 * When meals are skipped their share is redistributed proportionally
 * among the remaining active slots.
 */
const BASE_SLOT_RATIOS: Record<string, number> = {
  breakfast:     0.22,
  lunch_entree:  0.08,
  lunch_plat:    0.25,
  lunch_dessert: 0.07,
  dinner_entree: 0.08,
  dinner_plat:   0.22,
  dinner_dessert:0.08,
}

// Which slots belong to each meal
const MEAL_SLOTS: Record<MealType, string[]> = {
  breakfast: ['breakfast'],
  lunch:     ['lunch_entree', 'lunch_plat', 'lunch_dessert'],
  dinner:    ['dinner_entree', 'dinner_plat', 'dinner_dessert'],
}

/**
 * Compute effective slot ratios after removing skipped meals.
 * The freed ratio is redistributed proportionally to remaining active slots.
 */
export function computeSlotRatios(skippedMeals: MealType[]): Record<string, number> {
  const skippedSlots = new Set(skippedMeals.flatMap((m) => MEAL_SLOTS[m]))

  // Sum of active ratios
  const activeTotal = Object.entries(BASE_SLOT_RATIOS)
    .filter(([slot]) => !skippedSlots.has(slot))
    .reduce((sum, [, r]) => sum + r, 0)

  if (activeTotal === 0) return BASE_SLOT_RATIOS // fallback: nothing skipped

  const result: Record<string, number> = {}
  for (const [slot, baseRatio] of Object.entries(BASE_SLOT_RATIOS)) {
    result[slot] = skippedSlots.has(slot) ? 0 : baseRatio / activeTotal
  }
  return result
}

// Fallback role inference from category
function inferRoles(food: FoodItem): MealRole[] {
  const cat = (food.category ?? '').toLowerCase()
  if (cat.includes('féculents') || cat.includes('viandes') || cat.includes('poisson'))
    return ['lunch_plat', 'dinner_plat']
  if (cat.includes('légumes')) return ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat']
  if (cat.includes('fruits') || cat.includes('laitier'))
    return ['breakfast', 'lunch_dessert', 'dinner_dessert']
  if (cat.includes('graisses') || cat.includes('matières'))
    return ['lunch_plat', 'dinner_plat']
  return ['any']
}

function getRoles(food: FoodItem): MealRole[] {
  const dbEntry = FOOD_DATABASE.find(
    (d) => d.name.toLowerCase() === food.name.toLowerCase(),
  )
  return dbEntry ? dbEntry.mealRole : inferRoles(food)
}

function quantityForKcal(targetKcal: number, food: FoodItem): number {
  if (food.unit === 'unit') {
    const kcalPerUnit = (food.caloriesPer100g / 100) * (food.gramsPerUnit ?? 100)
    if (kcalPerUnit <= 0) return 0
    const units = Math.round(targetKcal / kcalPerUnit)
    return Math.min(Math.max(1, units), food.quantityInStock)
  }
  const grams = Math.round((targetKcal / food.caloriesPer100g) * 100)
  return Math.min(Math.max(20, grams), food.quantityInStock)
}

function actualKcal(food: FoodItem, quantity: number): number {
  if (food.unit === 'unit') {
    return Math.round(((food.gramsPerUnit ?? 100) * quantity / 100) * food.caloriesPer100g)
  }
  return Math.round((quantity / 100) * food.caloriesPer100g)
}

function pickFoodsForSlot(
  slot: MealRole,
  foods: FoodItem[],
  targetKcal: number,
  used: Set<string>,
): MealEntry[] {
  if (targetKcal <= 0) return []

  const candidates = foods.filter((f) => {
    if (f.quantityInStock <= 0) return false
    const roles = getRoles(f)
    return roles.includes(slot) || roles.includes('any')
  })

  if (candidates.length === 0) return []

  const fresh = candidates.filter((f) => !used.has(f.id))
  const pool = fresh.length > 0 ? fresh : candidates
  const shuffled = [...pool].sort(() => Math.random() - 0.5)

  const main = shuffled[0]
  const mainQty = quantityForKcal(targetKcal * 0.8, main)
  const mainKcal = actualKcal(main, mainQty)
  used.add(main.id)

  const entries: MealEntry[] = [{ id: uuidv4(), foodId: main.id, quantity: mainQty }]

  const remaining = targetKcal - mainKcal
  if (remaining > 30 && shuffled.length > 1) {
    const secondary = shuffled.find((f) => !used.has(f.id))
    if (secondary) {
      const secQty = quantityForKcal(remaining, secondary)
      if (secQty > 0) {
        entries.push({ id: uuidv4(), foodId: secondary.id, quantity: secQty })
        used.add(secondary.id)
      }
    }
  }

  return entries
}

export function generateDayMeals(
  dateKey: string,
  foods: FoodItem[],
  goalKcal: number,
  skippedMeals: MealType[] = [],
): DailyPlan {
  const used = new Set<string>()
  const ratios = computeSlotRatios(skippedMeals)

  const entriesFor = (slot: MealRole): MealEntry[] =>
    pickFoodsForSlot(slot, foods, goalKcal * ratios[slot], used)

  const meals: Meal[] = [
    {
      type: 'breakfast',
      items: skippedMeals.includes('breakfast') ? [] : entriesFor('breakfast'),
    },
    {
      type: 'lunch',
      courses: MEAL_COURSES.map((courseType) => ({
        type: courseType,
        items: skippedMeals.includes('lunch') ? [] : entriesFor(`lunch_${courseType}` as MealRole),
      })),
    },
    {
      type: 'dinner',
      courses: MEAL_COURSES.map((courseType) => ({
        type: courseType,
        items: skippedMeals.includes('dinner') ? [] : entriesFor(`dinner_${courseType}` as MealRole),
      })),
    },
  ]

  return { dateKey, meals, skippedMeals }
}

export function canGenerate(foods: FoodItem[]): boolean {
  return foods.filter((f) => f.quantityInStock > 0).length >= 3
}
