import { useState, type FormEvent } from 'react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FOOD_CATEGORIES } from '@/types'
import type { FoodItem } from '@/types'

type FoodFormData = Omit<FoodItem, 'id' | 'createdAt'>

interface FoodFormProps {
  initial?: FoodFormData
  onSubmit: (data: FoodFormData) => void
  onCancel: () => void
  submitLabel?: string
}

const defaultForm: FoodFormData = {
  name: '',
  caloriesPer100g: 0,
  unit: 'g',
  gramsPerUnit: undefined,
  quantityInStock: 0,
  category: '',
}

export function FoodForm({ initial, onSubmit, onCancel, submitLabel = 'Ajouter' }: FoodFormProps) {
  const [form, setForm] = useState<FoodFormData>(initial ?? defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({})

  const set = <K extends keyof FoodFormData>(key: K, value: FoodFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Le nom est requis'
    if (form.caloriesPer100g <= 0) e.caloriesPer100g = 'Valeur positive requise'
    if (form.unit === 'unit' && (!form.gramsPerUnit || form.gramsPerUnit <= 0))
      e.gramsPerUnit = 'Poids par unité requis'
    if (form.quantityInStock < 0) e.quantityInStock = 'Quantité positive ou nulle'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, name: form.name.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nom de l'aliment"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
        placeholder="ex. Poulet grillé"
        autoFocus
      />

      <Input
        label="Calories pour 100g"
        type="number"
        min={0}
        step={1}
        value={form.caloriesPer100g || ''}
        onChange={(e) => set('caloriesPer100g', Number(e.target.value))}
        error={errors.caloriesPer100g}
        placeholder="ex. 165"
        hint="kcal pour 100g de produit"
      />

      <Select
        label="Unité de mesure"
        value={form.unit}
        onChange={(e) => set('unit', e.target.value as 'g' | 'unit')}
      >
        <option value="g">Grammes (g)</option>
        <option value="unit">Unité (ex. œuf, pomme)</option>
      </Select>

      {form.unit === 'unit' && (
        <Input
          label="Poids d'une unité (g)"
          type="number"
          min={1}
          value={form.gramsPerUnit || ''}
          onChange={(e) => set('gramsPerUnit', Number(e.target.value))}
          error={errors.gramsPerUnit}
          placeholder="ex. 60 pour un œuf"
        />
      )}

      <Input
        label={`Stock disponible (${form.unit === 'g' ? 'g' : 'unités'})`}
        type="number"
        min={0}
        value={form.quantityInStock || ''}
        onChange={(e) => set('quantityInStock', Number(e.target.value))}
        error={errors.quantityInStock}
        placeholder="ex. 500"
      />

      <Select
        label="Catégorie"
        value={form.category ?? ''}
        onChange={(e) => set('category', e.target.value)}
      >
        <option value="">— Choisir une catégorie —</option>
        {FOOD_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          Annuler
        </Button>
        <Button type="submit" fullWidth>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
