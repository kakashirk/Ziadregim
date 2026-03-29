import { v4 as uuidv4 } from 'uuid'
import type { FoodItem, DailyPlan, MealEntry, Meal } from '@/types'
import { MEAL_COURSES } from '@/types'
import type { MealRole } from '@/data/foodDatabase'
import { FOOD_DATABASE } from '@/data/foodDatabase'

/**
 * For each slot we target a calorie budget.
 * The algo:
 *  1. Filter inventory foods whose name matches a known DB entry (same name) to get the MealRole.
 *     For foods not found in DB, fall back to category-based role mapping.
 *  2. For each slot pick 1-2 foods that fit the role and have stock.
 *  3. Calculate quantity so the kcal contribution fills the slot budget.
 *  4. Cap quantity at available stock.
 */

// Distribution of daily calories per slot (must sum to ~1)
const SLOT_RATIOS: Record<string, number> = {
  breakfast: 0.22,
  lunch_entree: 0.08,
  lunch_plat: 0.25,
  lunch_dessert: 0.07,
  dinner_entree: 0.08,
  dinner_plat: 0.22,
  dinner_dessert: 0.08,
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

/**
 * Given a target kcal budget and a food item,
 * return the quantity (g or units) needed to fill that budget.
 * Capped at available stock.
 */
function quantityForKcal(targetKcal: number, food: FoodItem): number {
  if (food.unit === 'unit') {
    const kcalPerUnit = (food.caloriesPer100g / 100) * (food.gramsPerUnit ?? 100)
    if (kcalPerUnit <= 0) return 0
    const units = Math.round(targetKcal / kcalPerUnit)
    return Math.min(Math.max(1, units), food.quantityInStock)
  }
  // grams
  const grams = Math.round((targetKcal / food.caloriesPer100g) * 100)
  const minGrams = 20 // at least 20g
  const maxGrams = food.quantityInStock
  return Math.min(Math.max(minGrams, grams), maxGrams)
}

function actualKcal(food: FoodItem, quantity: number): number {
  if (food.unit === 'unit') {
    return Math.round(((food.gramsPerUnit ?? 100) * quantity / 100) * food.caloriesPer100g)
  }
  return Math.round((quantity / 100) * food.caloriesPer100g)
}

/** Pick foods for a single slot */
function pickFoodsForSlot(
  slot: MealRole,
  foods: FoodItem[],
  targetKcal: number,
  used: Set<string>, // foodIds already used today
): MealEntry[] {
  // Foods available for this slot with stock
  const candidates = foods.filter((f) => {
    if (f.quantityInStock <= 0) return false
    const roles = getRoles(f)
    return roles.includes(slot) || roles.includes('any')
  })

  if (candidates.length === 0) return []

  // Prefer foods not already used today
  const fresh = candidates.filter((f) => !used.has(f.id))
  const pool = fresh.length > 0 ? fresh : candidates

  // Shuffle for variety
  const shuffled = [...pool].sort(() => Math.random() - 0.5)

  // Pick the main food (largest calorie contributor)
  const main = shuffled[0]
  const mainQty = quantityForKcal(targetKcal * 0.8, main)
  const mainKcal = actualKcal(main, mainQty)
  used.add(main.id)

  const entries: MealEntry[] = [{ id: uuidv4(), foodId: main.id, quantity: mainQty }]

  // Optionally add a second food for the remaining budget
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
): DailyPlan {
  const used = new Set<string>()

  // Helper: build entries for a slot
  const entriesFor = (slot: MealRole): MealEntry[] =>
    pickFoodsForSlot(slot, foods, goalKcal * SLOT_RATIOS[slot], used)

  const meals: Meal[] = [
    // Breakfast
    {
      type: 'breakfast',
      items: entriesFor('breakfast'),
    },
    // Lunch
    {
      type: 'lunch',
      courses: MEAL_COURSES.map((courseType) => ({
        type: courseType,
        items: entriesFor(`lunch_${courseType}` as MealRole),
      })),
    },
    // Dinner
    {
      type: 'dinner',
      courses: MEAL_COURSES.map((courseType) => ({
        type: courseType,
        items: entriesFor(`dinner_${courseType}` as MealRole),
      })),
    },
  ]

  return { dateKey, meals }
}

/** Check if inventory has enough foods to generate a plan */
export function canGenerate(foods: FoodItem[]): boolean {
  return foods.filter((f) => f.quantityInStock > 0).length >= 3
}
