import { useState } from 'react'
import { MealItem } from './MealItem'
import { AddMealItemModal } from './AddMealItemModal'
import { COURSE_LABELS } from '@/types'
import type { Course, MealType, CourseType } from '@/types'
import type { usePlanActions } from '@/hooks/usePlanActions'

const courseEmojis: Record<CourseType, string> = {
  entree: '🥗',
  plat: '🍽️',
  dessert: '🍮',
}

interface CourseBlockProps {
  course: Course
  actions: ReturnType<typeof usePlanActions>
  mealType: MealType
}

export function CourseBlock({ course, actions, mealType }: CourseBlockProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base shrink-0">{courseEmojis[course.type]}</span>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-gray-700">{COURSE_LABELS[course.type]}</span>
            {course.name && (
              <p className="text-xs text-brand-600 font-medium truncate">{course.name}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      {course.items.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-1 pl-6">Aucun aliment</p>
      ) : (
        <div className="pl-2">
          {course.items.map((entry) => (
            <MealItem
              key={entry.id}
              entry={entry}
              onRemove={() => actions.remove(mealType, course.type, entry.id)}
              onUpdateQty={(qty) => actions.updateQty(mealType, course.type, entry.id, qty)}
            />
          ))}
        </div>
      )}

      <AddMealItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(foodId, quantity) => actions.add(mealType, course.type, foodId, quantity)}
        title={`Ajouter — ${COURSE_LABELS[course.type]}`}
      />
    </div>
  )
}
