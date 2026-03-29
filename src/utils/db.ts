import { openDB, type IDBPDatabase } from 'idb'
import type { FoodItem, DailyPlan } from '@/types'

const DB_NAME = 'ziadregim-db'
const DB_VERSION = 1

interface ZiadRegimDB {
  foods: {
    key: string
    value: FoodItem
  }
  plans: {
    key: string
    value: DailyPlan
  }
}

let dbPromise: Promise<IDBPDatabase<ZiadRegimDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ZiadRegimDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('foods')) {
          db.createObjectStore('foods', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('plans')) {
          db.createObjectStore('plans', { keyPath: 'dateKey' })
        }
      },
    })
  }
  return dbPromise
}

// ── Foods ─────────────────────────────────────────────────────────────────
export async function getAllFoods(): Promise<FoodItem[]> {
  const db = await getDB()
  return db.getAll('foods')
}

export async function putFood(food: FoodItem): Promise<void> {
  const db = await getDB()
  await db.put('foods', food)
}

export async function deleteFood(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('foods', id)
}

// ── Plans ─────────────────────────────────────────────────────────────────
export async function getAllPlans(): Promise<DailyPlan[]> {
  const db = await getDB()
  return db.getAll('plans')
}

export async function getPlan(dateKey: string): Promise<DailyPlan | undefined> {
  const db = await getDB()
  return db.get('plans', dateKey)
}

export async function putPlan(plan: DailyPlan): Promise<void> {
  const db = await getDB()
  await db.put('plans', plan)
}

// ── Reset ─────────────────────────────────────────────────────────────────
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['foods', 'plans'], 'readwrite')
  await Promise.all([tx.objectStore('foods').clear(), tx.objectStore('plans').clear()])
  await tx.done
}
