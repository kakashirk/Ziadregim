import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { DailyGoal } from '@/types'

interface GoalContextValue {
  goal: DailyGoal
  setGoal: (kcal: number) => void
}

const GoalContext = createContext<GoalContextValue | null>(null)

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goal, setGoalState] = useLocalStorage<DailyGoal>('ziadregim-goal', { kcal: 2000 })

  const setGoal = (kcal: number) => setGoalState({ kcal })

  return <GoalContext.Provider value={{ goal, setGoal }}>{children}</GoalContext.Provider>
}

export function useGoal() {
  const ctx = useContext(GoalContext)
  if (!ctx) throw new Error('useGoal must be used within GoalProvider')
  return ctx
}
