import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
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

function rowToFoodItem(row: Record<string, unknown>): FoodItem {
  return {
    id: row.id as string,
    name: row.name as string,
    caloriesPer100g: row.calories_per_100g as number,
    unit: row.unit as 'g' | 'unit',
    gramsPerUnit: row.grams_per_unit as number | undefined,
    quantityInStock: row.quantity_in_stock as number,
    category: row.category as string | undefined,
    proteins: row.proteins as number | undefined,
    lipids: row.lipids as number | undefined,
    carbs: row.carbs as number | undefined,
    fiber: row.fiber as number | undefined,
    createdAt: row.created_at as string,
  }
}

export function FoodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setFoods([]); setLoading(false); return }
    setLoading(true)
    ;(async () => {
      try {
        const { data } = await supabase
          .from('foods')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
        setFoods((data ?? []).map(rowToFoodItem))
      } catch { /* ignore */ }
      setLoading(false)
    })()
  }, [user])

  const addFood = useCallback(async (data: Omit<FoodItem, 'id' | 'createdAt'>) => {
    if (!user) return
    const { data: row } = await supabase
      .from('foods')
      .insert({
        user_id: user.id,
        name: data.name,
        calories_per_100g: data.caloriesPer100g,
        unit: data.unit,
        grams_per_unit: data.gramsPerUnit,
        quantity_in_stock: data.quantityInStock,
        category: data.category,
        proteins: data.proteins,
        lipids: data.lipids,
        carbs: data.carbs,
        fiber: data.fiber,
      })
      .select()
      .single()
    if (row) setFoods((prev) => [...prev, rowToFoodItem(row)])
  }, [user])

  const updateFood = useCallback(
    async (id: string, patch: Partial<Omit<FoodItem, 'id' | 'createdAt'>>) => {
      const dbPatch: Record<string, unknown> = {}
      if (patch.name !== undefined) dbPatch.name = patch.name
      if (patch.caloriesPer100g !== undefined) dbPatch.calories_per_100g = patch.caloriesPer100g
      if (patch.unit !== undefined) dbPatch.unit = patch.unit
      if (patch.gramsPerUnit !== undefined) dbPatch.grams_per_unit = patch.gramsPerUnit
      if (patch.quantityInStock !== undefined) dbPatch.quantity_in_stock = patch.quantityInStock
      if (patch.category !== undefined) dbPatch.category = patch.category
      if (patch.proteins !== undefined) dbPatch.proteins = patch.proteins
      if (patch.lipids !== undefined) dbPatch.lipids = patch.lipids
      if (patch.carbs !== undefined) dbPatch.carbs = patch.carbs
      if (patch.fiber !== undefined) dbPatch.fiber = patch.fiber

      await supabase.from('foods').update(dbPatch).eq('id', id)
      setFoods((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      )
    },
    [],
  )

  const deleteFood = useCallback(async (id: string) => {
    await supabase.from('foods').delete().eq('id', id)
    setFoods((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const getFoodById = useCallback((id: string) => foods.find((f) => f.id === id), [foods])

  const value = useMemo(
    () => ({ foods, loading, addFood, updateFood, deleteFood, getFoodById }),
    [foods, loading, addFood, updateFood, deleteFood, getFoodById],
  )
  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>
}

export function useFood() {
  const ctx = useContext(FoodContext)
  if (!ctx) throw new Error('useFood must be used within FoodProvider')
  return ctx
}
