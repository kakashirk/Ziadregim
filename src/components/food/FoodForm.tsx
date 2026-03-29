import { useState, useMemo, type FormEvent } from 'react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FOOD_CATEGORIES } from '@/types'
import { FOOD_DATABASE, type NutrientInfo } from '@/data/foodDatabase'
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

// Step 1 = search database, Step 2 = fill details/stock
type Step = 'search' | 'details'

export function FoodForm({ initial, onSubmit, onCancel, submitLabel = 'Ajouter' }: FoodFormProps) {
  // If editing (initial provided), skip the search step
  const [step, setStep] = useState<Step>(initial ? 'details' : 'search')
  const [dbSearch, setDbSearch] = useState('')
  const [form, setForm] = useState<FoodFormData>(initial ?? defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({})

  const filteredDB = useMemo(() => {
    const q = dbSearch.toLowerCase().trim()
    if (!q) return FOOD_DATABASE.slice(0, 30)
    return FOOD_DATABASE.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    ).slice(0, 40)
  }, [dbSearch])

  const selectFromDB = (item: NutrientInfo) => {
    setForm({
      name: item.name,
      caloriesPer100g: item.kcalPer100g,
      unit: item.unit,
      gramsPerUnit: item.gramsPerUnit,
      quantityInStock: 0,
      category: item.category,
    })
    setStep('details')
  }

  const goManual = () => {
    setForm({ ...defaultForm, name: dbSearch })
    setStep('details')
  }

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

  // ── Step 1: search the built-in database ─────────────────────────────────
  if (step === 'search') {
    return (
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Rechercher un aliment (ex. poulet, riz, yaourt…)"
          value={dbSearch}
          onChange={(e) => setDbSearch(e.target.value)}
          autoFocus
          hint="Sélectionnez un aliment pour pré-remplir ses valeurs nutritionnelles."
        />

        <div className="max-h-72 overflow-y-auto flex flex-col gap-0.5 -mx-1 px-1">
          {filteredDB.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => selectFromDB(item)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-brand-50 transition-colors border border-transparent hover:border-brand-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
              <span className="text-xs font-semibold text-brand-600 shrink-0 ml-2">
                {item.kcalPer100g} kcal/100g
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
          <p className="text-xs text-gray-500 text-center">Aliment non trouvé dans la liste ?</p>
          <Button type="button" variant="secondary" onClick={goManual} fullWidth>
            Saisir manuellement
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  // ── Step 2: details + stock ───────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!initial && (
        <button
          type="button"
          onClick={() => setStep('search')}
          className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la recherche
        </button>
      )}

      {/* Show a "pre-filled from DB" badge when kcal is already known */}
      {form.caloriesPer100g > 0 && (
        <div className="flex items-center gap-2 bg-brand-50 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xs text-brand-700">
            Valeurs nutritionnelles pré-remplies — <span className="font-semibold">{form.caloriesPer100g} kcal/100g</span>
          </p>
        </div>
      )}

      <Input
        label="Nom de l'aliment"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        error={errors.name}
        placeholder="ex. Poulet grillé"
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
