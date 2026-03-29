import { v4 as uuidv4 } from 'uuid'
import type { FoodItem, DailyPlan, MealEntry, Meal } from '@/types'
import { MEAL_COURSES } from '@/types'

const STORAGE_KEY = 'ziadregim_claude_key'

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) ?? ''
}

export function saveApiKey(key: string) {
  if (key.trim()) localStorage.setItem(STORAGE_KEY, key.trim())
  else localStorage.removeItem(STORAGE_KEY)
}

/** Fuzzy match: find a food from the inventory matching the AI's suggested name */
function matchFood(name: string, foods: FoodItem[]): FoodItem | null {
  const q = name.toLowerCase().trim()
  return (
    foods.find((f) => f.name.toLowerCase() === q) ??
    foods.find((f) => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())) ??
    null
  )
}

function makeEntry(foodId: string, grams: number, food: FoodItem): MealEntry {
  const qty =
    food.unit === 'unit'
      ? Math.max(1, Math.round(grams / (food.gramsPerUnit ?? 100)))
      : Math.max(10, Math.min(grams, food.quantityInStock))
  return { id: uuidv4(), foodId, quantity: qty }
}

interface AIItem { foodName: string; grams: number }
interface AICourse { name: string; items: AIItem[] }
interface AIResponse {
  breakfast: { name: string; items: AIItem[] }
  lunch: { entree: AICourse; plat: AICourse; dessert: AICourse }
  dinner: { entree: AICourse; plat: AICourse; dessert: AICourse }
}

function buildEntries(aiItems: AIItem[], foods: FoodItem[], used: Set<string>): MealEntry[] {
  const entries: MealEntry[] = []
  for (const item of aiItems) {
    const food = matchFood(item.foodName, foods.filter((f) => !used.has(f.id) && f.quantityInStock > 0))
    if (food) {
      entries.push(makeEntry(food.id, item.grams, food))
      used.add(food.id)
    }
  }
  return entries
}

export async function generateWithAI(
  dateKey: string,
  foods: FoodItem[],
  goalKcal: number,
  skippedMeals: string[] = [],
): Promise<DailyPlan> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('Clé API non configurée')

  const foodList = foods
    .filter((f) => f.quantityInStock > 0)
    .map((f) => `- ${f.name} (${f.caloriesPer100g} kcal/100g, stock: ${f.quantityInStock}${f.unit === 'unit' ? ' unités' : 'g'})`)
    .join('\n')

  const skippedText = skippedMeals.length > 0
    ? `\nRepas à ignorer (non générés) : ${skippedMeals.join(', ')}.`
    : ''

  const prompt = `Tu es un nutritionniste expert en cuisine française et méditerranéenne.
Génère un plan de repas journalier complet et appétissant pour un objectif de ${goalKcal} kcal/jour.${skippedText}

Aliments disponibles dans le garde-manger :
${foodList}

Règles :
- Utilise UNIQUEMENT les aliments de la liste ci-dessus
- Respecte les stocks (ne dépasse pas les quantités disponibles)
- Crée des plats cohérents et appétissants avec de vrais noms de recettes françaises
- Petit-déjeuner ≈ ${Math.round(goalKcal * 0.22)} kcal
- Déjeuner : entrée ≈ ${Math.round(goalKcal * 0.08)} kcal, plat ≈ ${Math.round(goalKcal * 0.25)} kcal, dessert ≈ ${Math.round(goalKcal * 0.07)} kcal
- Dîner : entrée ≈ ${Math.round(goalKcal * 0.08)} kcal, plat ≈ ${Math.round(goalKcal * 0.22)} kcal, dessert ≈ ${Math.round(goalKcal * 0.08)} kcal

Réponds UNIQUEMENT en JSON valide (sans texte avant ou après) :
{
  "breakfast": {
    "name": "nom appétissant du petit-déjeuner",
    "items": [{"foodName": "nom exact de l'aliment", "grams": 150}]
  },
  "lunch": {
    "entree": {"name": "nom de l'entrée", "items": [{"foodName": "...", "grams": 100}]},
    "plat": {"name": "nom du plat", "items": [{"foodName": "...", "grams": 200}]},
    "dessert": {"name": "nom du dessert", "items": [{"foodName": "...", "grams": 100}]}
  },
  "dinner": {
    "entree": {"name": "nom de l'entrée", "items": [{"foodName": "...", "grams": 100}]},
    "plat": {"name": "nom du plat", "items": [{"foodName": "...", "grams": 200}]},
    "dessert": {"name": "nom du dessert", "items": [{"foodName": "...", "grams": 80}]}
  }
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any)?.error?.message ?? `Erreur API ${res.status}`)
  }

  const data = await res.json()
  const text: string = data.content?.[0]?.text ?? ''

  // Extract JSON from response (sometimes Claude wraps in markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Réponse IA invalide')
  const ai: AIResponse = JSON.parse(jsonMatch[0])

  const used = new Set<string>()

  const meals: Meal[] = [
    {
      type: 'breakfast',
      name: ai.breakfast.name,
      items: skippedMeals.includes('breakfast') ? [] : buildEntries(ai.breakfast.items, foods, used),
    },
    {
      type: 'lunch',
      courses: MEAL_COURSES.map((courseType) => {
        if (skippedMeals.includes('lunch')) return { type: courseType, items: [] }
        const course = ai.lunch[courseType]
        return {
          type: courseType,
          name: course.name,
          items: buildEntries(course.items, foods, used),
        }
      }),
    },
    {
      type: 'dinner',
      courses: MEAL_COURSES.map((courseType) => {
        if (skippedMeals.includes('dinner')) return { type: courseType, items: [] }
        const course = ai.dinner[courseType]
        return {
          type: courseType,
          name: course.name,
          items: buildEntries(course.items, foods, used),
        }
      }),
    },
  ]

  return { dateKey, meals, skippedMeals: skippedMeals as any }
}
