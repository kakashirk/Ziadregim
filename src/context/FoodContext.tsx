import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getAllFoods, putFood, deleteFood as dbDeleteFood } from '@/utils/db'
import type { FoodItem } from '@/types'

interface FoodContextValue {
  foods: FoodItem[]
  loading: boolean
  addFood: (data: Omit<FoodItem, 'id' | 'createdAt'>) => Promise<void>
  updateFood: (id: string, patch: Partial<Omit<FoodItem, 'id' | 'createdAt'>>) => Promise<void>
  deleteFood: (id: string) => Promise<void>
  getFoodById: (id: string) => FoodItem | undefined
}

const FoodContext = createContext<FoodContextValue | null>(null)

export function FoodProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllFoods()
      .then(setFoods)
      .finally(() => setLoading(false))
  }, [])

  const addFood = useCallback(async (data: Omit<FoodItem, 'id' | 'createdAt'>) => {
    const food: FoodItem = { ...data, id: uuidv4(), createdAt: new Date().toISOString() }
    await putFood(food)
    setFoods((prev) => [...prev, food])
  }, [])

  const updateFood = useCallback(
    async (id: string, patch: Partial<Omit<FoodItem, 'id' | 'createdAt'>>) => {
      setFoods((prev) => {
        const updated = prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
        const food = updated.find((f) => f.id === id)
        if (food) putFood(food)
        return updated
      })
    },
    [],
  )

  const deleteFood = useCallback(async (id: string) => {
    await dbDeleteFood(id)
    setFoods((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const getFoodById = useCallback((id: string) => foods.find((f) => f.id === id), [foods])

  return (
    <FoodContext.Provider value={{ foods, loading, addFood, updateFood, deleteFood, getFoodById }}>
      {children}
    </FoodContext.Provider>
  )
}

export function useFood() {
  const ctx = useContext(FoodContext)
  if (!ctx) throw new Error('useFood must be used within FoodProvider')
  return ctx
}
