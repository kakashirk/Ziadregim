import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getAllPlans, putPlan } from '@/utils/db'
import type { DailyPlan, Meal, MealType, CourseType, MealEntry } from '@/types'
import { MEAL_COURSES } from '@/types'

interface PlanContextValue {
  plans: Record<string, DailyPlan>
  loading: boolean
  getOrCreatePlan: (dateKey: string) => DailyPlan
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

function createEmptyPlan(dateKey: string): DailyPlan {
  const meals: Meal[] = [
    { type: 'breakfast', items: [] },
    {
      type: 'lunch',
      courses: MEAL_COURSES.map((type) => ({ type, items: [] })),
    },
    {
      type: 'dinner',
      courses: MEAL_COURSES.map((type) => ({ type, items: [] })),
    },
  ]
  return { dateKey, meals }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Record<string, DailyPlan>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPlans()
      .then((all) => {
        const map: Record<string, DailyPlan> = {}
        all.forEach((p) => (map[p.dateKey] = p))
        setPlans(map)
      })
      .finally(() => setLoading(false))
  }, [])

  const getOrCreatePlan = useCallback(
    (dateKey: string): DailyPlan => {
      return plans[dateKey] ?? createEmptyPlan(dateKey)
    },
    [plans],
  )

  const savePlan = useCallback(async (plan: DailyPlan) => {
    await putPlan(plan)
    setPlans((prev) => ({ ...prev, [plan.dateKey]: plan }))
  }, [])

  const mutatePlan = useCallback(
    async (dateKey: string, mutate: (plan: DailyPlan) => DailyPlan) => {
      const current = plans[dateKey] ?? createEmptyPlan(dateKey)
      const updated = mutate(JSON.parse(JSON.stringify(current)) as DailyPlan)
      await savePlan(updated)
    },
    [plans, savePlan],
  )

  const addMealEntry = useCallback(
    async (
      dateKey: string,
      mealType: MealType,
      courseType: CourseType | null,
      entry: Omit<MealEntry, 'id'>,
    ) => {
      const newEntry: MealEntry = { ...entry, id: uuidv4() }
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') {
          meal.items = [...(meal.items ?? []), newEntry]
        } else {
          const course = meal.courses!.find((c) => c.type === courseType)!
          course.items = [...course.items, newEntry]
        }
        return plan
      })
    },
    [mutatePlan],
  )

  const removeMealEntry = useCallback(
    async (
      dateKey: string,
      mealType: MealType,
      courseType: CourseType | null,
      entryId: string,
    ) => {
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') {
          meal.items = (meal.items ?? []).filter((e) => e.id !== entryId)
        } else {
          const course = meal.courses!.find((c) => c.type === courseType)!
          course.items = course.items.filter((e) => e.id !== entryId)
        }
        return plan
      })
    },
    [mutatePlan],
  )

  const updateMealEntryQty = useCallback(
    async (
      dateKey: string,
      mealType: MealType,
      courseType: CourseType | null,
      entryId: string,
      quantity: number,
    ) => {
      await mutatePlan(dateKey, (plan) => {
        const meal = plan.meals.find((m) => m.type === mealType)!
        if (mealType === 'breakfast') {
          const entry = (meal.items ?? []).find((e) => e.id === entryId)
          if (entry) entry.quantity = quantity
        } else {
          const course = meal.courses!.find((c) => c.type === courseType)!
          const entry = course.items.find((e) => e.id === entryId)
          if (entry) entry.quantity = quantity
        }
        return plan
      })
    },
    [mutatePlan],
  )

  return (
    <PlanContext.Provider
      value={{
        plans,
        loading,
        getOrCreatePlan,
        addMealEntry,
        removeMealEntry,
        updateMealEntryQty,
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
