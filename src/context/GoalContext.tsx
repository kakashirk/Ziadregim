import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { DailyGoal } from '@/types'

interface GoalContextValue {
  goal: DailyGoal
  setGoal: (kcal: number) => void
}

const GoalContext = createContext<GoalContextValue | null>(null)

export function GoalProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [goal, setGoalState] = useState<DailyGoal>({ kcal: 2000 })

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_settings')
      .select('daily_goal_kcal')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setGoalState({ kcal: data.daily_goal_kcal })
      })
  }, [user])

  const setGoal = useCallback(
    async (kcal: number) => {
      setGoalState({ kcal })
      if (!user) return
      await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, daily_goal_kcal: kcal }, { onConflict: 'user_id' })
    },
    [user],
  )

  const value = useMemo(() => ({ goal, setGoal }), [goal, setGoal])
  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>
}

export function useGoal() {
  const ctx = useContext(GoalContext)
  if (!ctx) throw new Error('useGoal must be used within GoalProvider')
  return ctx
}
