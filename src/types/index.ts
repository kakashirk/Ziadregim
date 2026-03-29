// ── Food Inventory ──────────────────────────────────────────────────────────
export interface FoodItem {
  id: string
  name: string
  caloriesPer100g: number
  unit: 'g' | 'unit'
  gramsPerUnit?: number
  quantityInStock: number
  category?: string
  createdAt: string
  // Macronutrients per 100g (optional, shown on dashboard)
  proteins?: number
  lipids?: number
  carbs?: number
  fiber?: number
}

// ── Macros ──────────────────────────────────────────────────────────────────
export interface Macros {
  kcal: number
  proteins: number
  lipids: number
  carbs: number
  fiber: number
}

// ── Meal Structure ──────────────────────────────────────────────────────────
export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type CourseType = 'entree' | 'plat' | 'dessert'

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
}

export const COURSE_LABELS: Record<CourseType, string> = {
  entree: 'Entrée',
  plat: 'Plat principal',
  dessert: 'Dessert',
}

export const MEAL_COURSES: CourseType[] = ['entree', 'plat', 'dessert']

export interface MealEntry {
  id: string
  foodId: string
  quantity: number // grams or unit count
}

export interface Course {
  type: CourseType
  items: MealEntry[]
}

export interface Meal {
  type: MealType
  items?: MealEntry[] // breakfast only
  courses?: Course[] // lunch + dinner only
}

// ── Daily Plan ──────────────────────────────────────────────────────────────
export interface DailyPlan {
  dateKey: string // "YYYY-MM-DD"
  meals: Meal[]
  skippedMeals?: MealType[] // meals the user has opted out of for this day
}

// ── Goal ───────────────────────────────────────────────────────────────────
export interface DailyGoal {
  kcal: number
}

// ── Category options ────────────────────────────────────────────────────────
export const FOOD_CATEGORIES = [
  'Légumes',
  'Fruits',
  'Viandes & Poissons',
  'Féculents',
  'Produits laitiers',
  'Matières grasses',
  'Boissons',
  'Snacks & Sucreries',
  'Autre',
] as const
