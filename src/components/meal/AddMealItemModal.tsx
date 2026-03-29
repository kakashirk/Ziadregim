import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useFood } from '@/context/FoodContext'
import type { FoodItem } from '@/types'

interface AddMealItemModalProps {
  open: boolean
  onClose: () => void
  onAdd: (foodId: string, quantity: number) => void
  title?: string
}

export function AddMealItemModal({ open, onClose, onAdd, title = 'Ajouter un aliment' }: AddMealItemModalProps) {
  const { foods } = useFood()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState<number>(100)
  const [qtyError, setQtyError] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return foods
    return foods.filter((f) => f.name.toLowerCase().includes(q) || (f.category ?? '').toLowerCase().includes(q))
  }, [foods, search])

  const handleClose = () => {
    setSearch('')
    setSelected(null)
    setQuantity(100)
    setQtyError('')
    onClose()
  }

  const handleAdd = () => {
    if (!selected) return
    if (!quantity || quantity <= 0) {
      setQtyError('Quantité positive requise')
      return
    }
    onAdd(selected.id, quantity)
    handleClose()
  }

  const kcalPreview =
    selected && quantity > 0
      ? Math.round(
          ((selected.unit === 'unit' ? quantity * (selected.gramsPerUnit ?? 100) : quantity) / 100) *
            selected.caloriesPer100g,
        )
      : null

  const unitLabel = selected?.unit === 'unit' ? 'unités' : 'g'

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="flex flex-col gap-4">
        {!selected ? (
          <>
            <Input
              placeholder="Rechercher un aliment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {foods.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                Aucun aliment dans votre inventaire. Ajoutez-en d'abord depuis l'onglet "Aliments".
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun résultat</p>
            ) : (
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                {filtered.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelected(food)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl text-left hover:bg-brand-50 transition-colors border border-transparent hover:border-brand-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{food.name}</p>
                      {food.category && (
                        <p className="text-xs text-gray-400">{food.category}</p>
                      )}
                    </div>
                    <span className="text-xs text-brand-600 font-semibold shrink-0">
                      {food.caloriesPer100g} kcal/100g
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Changer d'aliment
            </button>

            <div className="bg-brand-50 rounded-xl px-4 py-3">
              <p className="font-semibold text-gray-900">{selected.name}</p>
              <p className="text-xs text-gray-500">{selected.caloriesPer100g} kcal/100g</p>
            </div>

            <Input
              label={`Quantité (${unitLabel})`}
              type="number"
              min={1}
              value={quantity || ''}
              onChange={(e) => {
                setQuantity(Number(e.target.value))
                setQtyError('')
              }}
              error={qtyError}
              autoFocus
            />

            {kcalPreview !== null && (
              <div className="bg-gray-50 rounded-xl px-4 py-2 text-center">
                <span className="text-lg font-bold text-brand-600">{kcalPreview}</span>
                <span className="text-sm text-gray-500 ml-1">kcal</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleClose} fullWidth>
                Annuler
              </Button>
              <Button onClick={handleAdd} fullWidth>
                Ajouter
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
