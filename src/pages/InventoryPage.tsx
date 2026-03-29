import { useState } from 'react'
import { useFood } from '@/context/FoodContext'
import { FoodList } from '@/components/food/FoodList'
import { FoodForm } from '@/components/food/FoodForm'
import { Modal } from '@/components/ui/Modal'

export function InventoryPage() {
  const { addFood } = useFood()
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4 flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Mes aliments</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-3 py-2 rounded-xl shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      </div>

      <FoodList />

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvel aliment">
        <FoodForm
          onSubmit={async (data) => {
            await addFood(data)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  )
}
