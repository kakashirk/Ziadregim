import { useState } from 'react'
import { useFood } from '@/context/FoodContext'
import { entryKcal } from '@/utils/calories'
import type { MealEntry } from '@/types'

interface MealItemProps {
  entry: MealEntry
  onRemove: () => void
  onUpdateQty: (qty: number) => void
}

export function MealItem({ entry, onRemove, onUpdateQty }: MealItemProps) {
  const { getFoodById, foods } = useFood()
  const food = getFoodById(entry.foodId)
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(entry.quantity)

  if (!food) return null

  const kcal = entryKcal(entry, foods)
  const unitLabel = food.unit === 'unit' ? (entry.quantity > 1 ? 'unités' : 'unité') : 'g'

  const commitEdit = () => {
    if (qty > 0) {
      onUpdateQty(qty)
    } else {
      setQty(entry.quantity)
    }
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{food.name}</p>
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              type="number"
              min={1}
              value={qty}
              autoFocus
              onChange={(e) => setQty(Number(e.target.value))}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') { setQty(entry.quantity); setEditing(false) }
              }}
              className="w-20 text-xs border border-brand-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-500 hover:text-brand-600 underline decoration-dotted transition-colors"
            >
              {entry.quantity} {unitLabel}
            </button>
          )}
        </div>
      </div>

      <span className="text-sm font-semibold text-brand-600 shrink-0">{kcal} kcal</span>

      <button
        onClick={onRemove}
        className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
        aria-label="Retirer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
