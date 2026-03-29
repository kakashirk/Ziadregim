import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { MealItem } from './MealItem'
import { CourseBlock } from './CourseBlock'
import { AddMealItemModal } from './AddMealItemModal'
import { usePlanActions } from '@/hooks/usePlanActions'
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
  skipped: boolean
  onToggleSkip: () => void
}

export function MealSection({ dateKey, meal, skipped, onToggleSkip }: MealSectionProps) {
  const actions = usePlanActions(dateKey)
  const { foods } = useFood()
  const [modalOpen, setModalOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const kcal = mealKcal(meal, foods)

  return (
    <Card className={`overflow-hidden transition-opacity ${skipped ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center px-4 py-3 gap-2">
        {/* Skip toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSkip() }}
          className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            skipped ? 'border-gray-300 bg-gray-100' : 'border-brand-500 bg-brand-500'
          }`}
          aria-label={skipped ? 'Inclure ce repas' : 'Passer ce repas'}
        >
          {!skipped && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <button
          className="flex-1 flex items-center justify-between min-w-0"
          onClick={() => !skipped && setExpanded((v) => !v)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">{mealEmojis[meal.type]}</span>
            <span className={`font-semibold truncate ${skipped ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {MEAL_LABELS[meal.type]}
            </span>
            {skipped && <span className="text-xs text-gray-400 font-normal shrink-0">— ignoré</span>}
          </div>
          {!skipped && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-brand-600">{kcal} kcal</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? '' : '-rotate-90'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Body */}
      {!skipped && expanded && (
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
                      onRemove={() => actions.remove(meal.type, null, entry.id)}
                      onUpdateQty={(qty) => actions.updateQty(meal.type, null, entry.id, qty)}
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
                onAdd={(foodId, qty) => actions.add(meal.type, null, foodId, qty)}
                title="Ajouter au petit-déjeuner"
              />
            </>
          ) : (
            <div className="pt-1 flex flex-col divide-y divide-gray-50">
              {(meal.courses ?? []).map((course) => (
                <CourseBlock
                  key={course.type}
                  course={course}
                  mealType={meal.type}
                  actions={actions}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
