import { useState } from 'react'
import { MealItem } from './MealItem'
import { AddMealItemModal } from './AddMealItemModal'
import { COURSE_LABELS } from '@/types'
import type { Course, MealType, CourseType } from '@/types'

const courseEmojis: Record<CourseType, string> = {
  entree: '🥗',
  plat: '🍽️',
  dessert: '🍮',
}

interface CourseBlockProps {
  dateKey: string
  mealType: MealType
  course: Course
  onAdd: (foodId: string, quantity: number) => void
  onRemove: (entryId: string) => void
  onUpdateQty: (entryId: string, qty: number) => void
}

export function CourseBlock({ course, onAdd, onRemove, onUpdateQty }: CourseBlockProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{courseEmojis[course.type]}</span>
          <span className="text-sm font-semibold text-gray-700">{COURSE_LABELS[course.type]}</span>
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
              onRemove={() => onRemove(entry.id)}
              onUpdateQty={(qty) => onUpdateQty(entry.id, qty)}
            />
          ))}
        </div>
      )}

      <AddMealItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAdd}
        title={`Ajouter — ${COURSE_LABELS[course.type]}`}
      />
    </div>
  )
}
