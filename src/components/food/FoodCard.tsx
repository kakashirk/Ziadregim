import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FoodForm } from './FoodForm'
import { useFood } from '@/context/FoodContext'
import type { FoodItem } from '@/types'

interface FoodCardProps {
  food: FoodItem
}

export function FoodCard({ food }: FoodCardProps) {
  const { updateFood, deleteFood } = useFood()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const stockLabel =
    food.unit === 'g'
      ? `${food.quantityInStock} g`
      : `${food.quantityInStock} unité${food.quantityInStock > 1 ? 's' : ''}`

  return (
    <>
      <Card className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{food.name}</p>
            {food.category && (
              <Badge color="gray">{food.category}</Badge>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              aria-label="Modifier"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Supprimer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-brand-600 font-semibold">{food.caloriesPer100g}</span>
            <span className="text-xs text-gray-400">kcal/100g</span>
          </span>
          <span className="text-gray-300">|</span>
          <span>Stock: <span className="font-medium text-gray-800">{stockLabel}</span></span>
        </div>

        {food.unit === 'unit' && food.gramsPerUnit && (
          <p className="text-xs text-gray-400">{food.gramsPerUnit}g / unité</p>
        )}
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`Modifier — ${food.name}`}>
        <FoodForm
          initial={{
            name: food.name,
            caloriesPer100g: food.caloriesPer100g,
            unit: food.unit,
            gramsPerUnit: food.gramsPerUnit,
            quantityInStock: food.quantityInStock,
            category: food.category,
          }}
          onSubmit={async (data) => {
            await updateFood(food.id, data)
            setEditOpen(false)
          }}
          onCancel={() => setEditOpen(false)}
          submitLabel="Enregistrer"
        />
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer cet aliment ?">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Voulez-vous vraiment supprimer <strong>{food.name}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)} fullWidth>
              Annuler
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={async () => {
                await deleteFood(food.id)
                setConfirmDelete(false)
              }}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
