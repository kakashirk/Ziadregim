import { useState, useMemo } from 'react'
import { useFood } from '@/context/FoodContext'
import { FoodCard } from './FoodCard'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'

export function FoodList() {
  const { foods, loading, dbError } = useFood()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return foods
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.category ?? '').toLowerCase().includes(q),
    )
  }, [foods, search])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 font-mono break-all">
        Erreur DB : {dbError}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {foods.length > 0 && (
        <Input
          placeholder="Rechercher un aliment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🥦"
          title={foods.length === 0 ? 'Aucun aliment' : 'Aucun résultat'}
          description={
            foods.length === 0
              ? 'Ajoutez vos aliments pour commencer à planifier vos repas.'
              : 'Aucun aliment ne correspond à votre recherche.'
          }
        />
      ) : (
        filtered.map((food) => <FoodCard key={food.id} food={food} />)
      )}
    </div>
  )
}
