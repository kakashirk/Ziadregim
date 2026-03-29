import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { DailyPlan, Meal, MealType, CourseType, MealEntry } from '@/types'
import { MEAL_COURSES } from '@/types'

interface PlanContextValue {
  plans: Record<string, DailyPlan>
  loading: boolean
  getOrCreatePlan: (dateKey: string) => DailyPlan
  replacePlan: (plan: DailyPlan) => Promise<void>
  toggleSkipMeal: (dateKey: string, mealType: MealType) => Promise<void>
  addMealEntry: (
    dateKey: string,
    mealType: MealType,
    courseType: CourseType | null,
    entry: Omit<MealEntry, 'id'>,
  ) => Promise<void>
  removeMealEntry: (
    dateKey: string,
    mealType: MealType,
    courseType: CourseType | null,
    entryId: string,
  ) => Promise<void>
  updateMealEntryQty: (
    dateKey: string,
    mealType: MealType,
    courseType: CourseType | null,
    entryId: string,
    quantity: number,
  ) => Promise<void>
}

const PlanContext = createContext<PlanContextValue | null>(null)

/** Efficient deep clone of a DailyPlan — avoids JSON.parse/stringify overhead */
function clonePlan(plan: DailyPlan): DailyPlan {
  return {
    ...plan,
    skippedMeals: plan.skippedMeals ? [...plan.skippedMeals] : undefined,
    meals: plan.meals.map((meal) => ({
      ...meal,
      items: meal.items ? meal.items.map((e) => ({ ...e })) : undefined,
      courses: meal.courses?.map((course) => ({
        ...course,
        items: course.items.map((e) => ({ ...e })),
      })),
    })),
  }
}

function createEmptyPlan(dateKey: string): DailyPlan {
  const meals: Meal[] = [
    { type: 'breakfast', items: [] },
    { type: 'lunch', courses: MEAL_COURSES.map((type) => ({ type, items: [] })) },
    { type: 'dinner', courses: MEAL_COURSES.map((type) => ({ type, items: [] })) },
  ]
  return { dateKey, meals }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Record<string, DailyPlan>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setPlans({}); setLoading(false); return }
    setLoading(true)
    supabase
      .from('daily_plans')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const map: Record<string, DailyPlan> = {}
        ;(data ?? []).forEach((row) => {
          map[row.date_key] = {
            dateKey: row.date_key,
            meals: row.meals as Meal[],
            skippedMeals: row.skipped_meals as MealType[],
          }
        })
        setPlans(map)
        setLoading(false)
      })
  }, [user])

  const getOrCreatePlan = useCallback(
    (dateKey: string): DailyPlan => plans[dateKey] ?? createEmptyPlan(dateKey),
    [plans],
  )

  const savePlan = useCallback(
    async (plan: DailyPlan) => {
      if (!user) return
      await supabase.from('daily_plans').upsert(
        {
          user_id: user.id,
          date_key: plan.dateKey,
          meals: plan.meals,
          skipped_meals: plan.skippedMeals ?? [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date_key' },
      )
      setPlans((prev) => ({ ...prev, [plan.dateKey]: plan }))
    },
    [user],
  )

  const mutatePlan = useCallback(
    async (dateKey: string, mutate: (plan: DailyPlan) => DailyPlan) => {
      const current = plans[dateKey] ?? createEmptyPlan(dateKey)
      const updated = mutate(clonePlan(current))
      await savePlan(updated)
    },
    [plans, savePlan],
  )

  const addMealEntry = useCallback(
    async (dateKey: string, mealType: MealType, courseType: CourseType | null, entry: Omit<MealEntry, 'id'>) => {
      const newEntry: MealEntry = { ...entry, id: uuidv4() }
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') meal.items = [...(meal.items ?? []), newEntry]
        else meal.courses!.find((c) => c.type === courseType)!.items.push(newEntry)
        return plan
      })
    },
    [mutatePlan],
  )

  const removeMealEntry = useCallback(
    async (dateKey: string, mealType: MealType, courseType: CourseType | null, entryId: string) => {
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') meal.items = (meal.items ?? []).filter((e) => e.id !== entryId)
        else {
          const course = meal.courses!.find((c) => c.type === courseType)!
          course.items = course.items.filter((e) => e.id !== entryId)
        }
        return plan
      })
    },
    [mutatePlan],
  )

  const updateMealEntryQty = useCallback(
    async (dateKey: string, mealType: MealType, courseType: CourseType | null, entryId: string, quantity: number) => {
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') {
          const e = (meal.items ?? []).find((e) => e.id === entryId)
          if (e) e.quantity = quantity
        } else {
          const e = meal.courses!.find((c) => c.type === courseType)!.items.find((e) => e.id === entryId)
          if (e) e.quantity = quantity
        }
        return plan
      })
    },
    [mutatePlan],
  )

  const replacePlan = useCallback(async (plan: DailyPlan) => savePlan(plan), [savePlan])

  const toggleSkipMeal = useCallback(
    async (dateKey: string, mealType: MealType) => {
      await mutatePlan(dateKey, (plan) => {
        const skipped = plan.skippedMeals ?? []
        plan.skippedMeals = skipped.includes(mealType)
          ? skipped.filter((m) => m !== mealType)
          : [...skipped, mealType]
        return plan
      })
    },
    [mutatePlan],
  )

  const value = useMemo(
    () => ({ plans, loading, getOrCreatePlan, replacePlan, toggleSkipMeal, addMealEntry, removeMealEntry, updateMealEntryQty }),
    [plans, loading, getOrCreatePlan, replacePlan, toggleSkipMeal, addMealEntry, removeMealEntry, updateMealEntryQty],
  )

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
