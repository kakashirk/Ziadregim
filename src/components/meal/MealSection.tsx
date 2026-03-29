import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { MealItem } from './MealItem'
import { CourseBlock } from './CourseBlock'
import { AddMealItemModal } from './AddMealItemModal'
import { usePlan } from '@/context/PlanContext'
import { useFood } from '@/context/FoodContext'
import { mealKcal } from '@/utils/calories'
import { MEAL_LABELS } from '@/types'
import type { Meal, MealType } from '@/types'

const mealEmojis: Record<MealType, string> = {
  breakfast: '☀️',
  lunch: '🌞',
  dinner: '🌙',
}

interface MealSectionProps {
  dateKey: string
  meal: Meal
}

export function MealSection({ dateKey, meal }: MealSectionProps) {
  const { addMealEntry, removeMealEntry, updateMealEntryQty } = usePlan()
  const { foods } = useFood()
  const [modalOpen, setModalOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const kcal = mealKcal(meal, foods)

  const handleAdd = async (foodId: string, quantity: number) => {
    await addMealEntry(dateKey, meal.type, null, { foodId, quantity })
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{mealEmojis[meal.type]}</span>
          <span className="font-semibold text-gray-900">{MEAL_LABELS[meal.type]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-brand-600">{kcal} kcal</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? '' : '-rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          {meal.type === 'breakfast' ? (
            <>
              <div className="pt-2">
                {(meal.items ?? []).length === 0 ? (
                  <p className="text-sm text-gray-400 italic py-2">Aucun aliment pour ce repas</p>
                ) : (
                  (meal.items ?? []).map((entry) => (
                    <MealItem
                      key={entry.id}
                      entry={entry}
                      onRemove={() => removeMealEntry(dateKey, meal.type, null, entry.id)}
                      onUpdateQty={(qty) => updateMealEntryQty(dateKey, meal.type, null, entry.id, qty)}
                    />
                  ))
                )}
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium px-2 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un aliment
              </button>
              <AddMealItemModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAdd}
                title="Ajouter au petit-déjeuner"
              />
            </>
          ) : (
            <div className="pt-1 flex flex-col divide-y divide-gray-50">
              {(meal.courses ?? []).map((course) => (
                <CourseBlock
                  key={course.type}
                  dateKey={dateKey}
                  mealType={meal.type}
                  course={course}
                  onAdd={(foodId, quantity) =>
                    addMealEntry(dateKey, meal.type, course.type, { foodId, quantity })
                  }
                  onRemove={(entryId) => removeMealEntry(dateKey, meal.type, course.type, entryId)}
                  onUpdateQty={(entryId, qty) =>
                    updateMealEntryQty(dateKey, meal.type, course.type, entryId, qty)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
