export interface NutrientInfo {
  name: string
  kcalPer100g: number
  unit: 'g' | 'unit'
  gramsPerUnit?: number
  category: string
  mealRole: MealRole[]
}

// Which meal slot this food is suitable for
export type MealRole =
  | 'breakfast'
  | 'lunch_entree'
  | 'lunch_plat'
  | 'lunch_dessert'
  | 'dinner_entree'
  | 'dinner_plat'
  | 'dinner_dessert'
  | 'any'

export const FOOD_DATABASE: NutrientInfo[] = [
  // ── Fruits ──────────────────────────────────────────────────────────────
  { name: 'Pomme', kcalPer100g: 52, unit: 'unit', gramsPerUnit: 182, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Banane', kcalPer100g: 89, unit: 'unit', gramsPerUnit: 118, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Orange', kcalPer100g: 47, unit: 'unit', gramsPerUnit: 200, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Fraise', kcalPer100g: 32, unit: 'g', category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Raisin', kcalPer100g: 69, unit: 'g', category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Kiwi', kcalPer100g: 61, unit: 'unit', gramsPerUnit: 80, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Poire', kcalPer100g: 57, unit: 'unit', gramsPerUnit: 178, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Mangue', kcalPer100g: 60, unit: 'g', category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Pastèque', kcalPer100g: 30, unit: 'g', category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Melon', kcalPer100g: 34, unit: 'g', category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Abricot', kcalPer100g: 48, unit: 'unit', gramsPerUnit: 35, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Pêche', kcalPer100g: 39, unit: 'unit', gramsPerUnit: 150, category: 'Fruits', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },

  // ── Légumes ──────────────────────────────────────────────────────────────
  { name: 'Tomate', kcalPer100g: 18, unit: 'unit', gramsPerUnit: 123, category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Salade verte', kcalPer100g: 15, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Concombre', kcalPer100g: 16, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Carotte', kcalPer100g: 41, unit: 'unit', gramsPerUnit: 80, category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Poivron rouge', kcalPer100g: 31, unit: 'unit', gramsPerUnit: 160, category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Poivron vert', kcalPer100g: 20, unit: 'unit', gramsPerUnit: 150, category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Courgette', kcalPer100g: 17, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Aubergine', kcalPer100g: 25, unit: 'g', category: 'Légumes', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Brocoli', kcalPer100g: 34, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Épinards', kcalPer100g: 23, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Champignons', kcalPer100g: 22, unit: 'g', category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Haricots verts', kcalPer100g: 31, unit: 'g', category: 'Légumes', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Petits pois', kcalPer100g: 81, unit: 'g', category: 'Légumes', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Avocat', kcalPer100g: 160, unit: 'unit', gramsPerUnit: 200, category: 'Légumes', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Oignon', kcalPer100g: 40, unit: 'unit', gramsPerUnit: 110, category: 'Légumes', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Ail', kcalPer100g: 149, unit: 'g', category: 'Légumes', mealRole: ['lunch_plat', 'dinner_plat'] },

  // ── Viandes ──────────────────────────────────────────────────────────────
  { name: 'Blanc de poulet', kcalPer100g: 165, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Cuisse de poulet', kcalPer100g: 209, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Bœuf haché 5%', kcalPer100g: 137, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Bœuf haché 15%', kcalPer100g: 215, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Steak de bœuf', kcalPer100g: 250, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Côte de porc', kcalPer100g: 242, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Filet de dinde', kcalPer100g: 157, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Jambon blanc', kcalPer100g: 107, unit: 'g', category: 'Viandes & Poissons', mealRole: ['breakfast', 'lunch_entree', 'dinner_entree'] },
  { name: 'Jambon de pays', kcalPer100g: 268, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Lardons', kcalPer100g: 337, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },

  // ── Poissons & Fruits de mer ──────────────────────────────────────────────
  { name: 'Saumon', kcalPer100g: 208, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Saumon fumé', kcalPer100g: 172, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Thon (en boîte)', kcalPer100g: 116, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Cabillaud', kcalPer100g: 82, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Crevettes', kcalPer100g: 99, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_entree', 'dinner_entree', 'lunch_plat', 'dinner_plat'] },
  { name: 'Sardines (en boîte)', kcalPer100g: 208, unit: 'g', category: 'Viandes & Poissons', mealRole: ['lunch_entree', 'dinner_entree'] },

  // ── Œufs ──────────────────────────────────────────────────────────────
  { name: 'Œuf entier', kcalPer100g: 155, unit: 'unit', gramsPerUnit: 60, category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_plat', 'dinner_plat'] },
  { name: 'Blanc d\'œuf', kcalPer100g: 52, unit: 'unit', gramsPerUnit: 33, category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_plat', 'dinner_plat'] },

  // ── Produits laitiers ──────────────────────────────────────────────────
  { name: 'Lait entier', kcalPer100g: 61, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast'] },
  { name: 'Lait demi-écrémé', kcalPer100g: 46, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast'] },
  { name: 'Lait écrémé', kcalPer100g: 34, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast'] },
  { name: 'Yaourt nature', kcalPer100g: 59, unit: 'unit', gramsPerUnit: 125, category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Yaourt grec nature', kcalPer100g: 97, unit: 'unit', gramsPerUnit: 150, category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Fromage blanc 0%', kcalPer100g: 47, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Fromage blanc 3%', kcalPer100g: 69, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Emmental', kcalPer100g: 382, unit: 'g', category: 'Produits laitiers', mealRole: ['breakfast', 'lunch_plat', 'dinner_plat'] },
  { name: 'Mozzarella', kcalPer100g: 280, unit: 'g', category: 'Produits laitiers', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Feta', kcalPer100g: 264, unit: 'g', category: 'Produits laitiers', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Camembert', kcalPer100g: 299, unit: 'g', category: 'Produits laitiers', mealRole: ['lunch_dessert', 'dinner_dessert'] },
  { name: 'Beurre', kcalPer100g: 717, unit: 'g', category: 'Matières grasses', mealRole: ['breakfast', 'lunch_plat', 'dinner_plat'] },

  // ── Féculents & Céréales ──────────────────────────────────────────────────
  { name: 'Pain de mie', kcalPer100g: 265, unit: 'g', category: 'Féculents', mealRole: ['breakfast'] },
  { name: 'Pain complet', kcalPer100g: 247, unit: 'g', category: 'Féculents', mealRole: ['breakfast', 'lunch_entree', 'dinner_entree'] },
  { name: 'Baguette', kcalPer100g: 270, unit: 'g', category: 'Féculents', mealRole: ['breakfast', 'lunch_entree', 'dinner_entree'] },
  { name: 'Riz blanc cuit', kcalPer100g: 130, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Riz basmati cuit', kcalPer100g: 121, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Pâtes cuites', kcalPer100g: 131, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Pâtes sèches', kcalPer100g: 358, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Pomme de terre', kcalPer100g: 77, unit: 'unit', gramsPerUnit: 150, category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Patate douce', kcalPer100g: 86, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Quinoa cuit', kcalPer100g: 120, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Lentilles cuites', kcalPer100g: 116, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Pois chiches cuits', kcalPer100g: 164, unit: 'g', category: 'Féculents', mealRole: ['lunch_plat', 'dinner_plat', 'lunch_entree', 'dinner_entree'] },
  { name: 'Flocons d\'avoine', kcalPer100g: 389, unit: 'g', category: 'Féculents', mealRole: ['breakfast'] },
  { name: 'Corn flakes', kcalPer100g: 378, unit: 'g', category: 'Féculents', mealRole: ['breakfast'] },
  { name: 'Muesli', kcalPer100g: 367, unit: 'g', category: 'Féculents', mealRole: ['breakfast'] },

  // ── Matières grasses ──────────────────────────────────────────────────────
  { name: 'Huile d\'olive', kcalPer100g: 884, unit: 'g', category: 'Matières grasses', mealRole: ['lunch_plat', 'dinner_plat', 'lunch_entree', 'dinner_entree'] },
  { name: 'Huile de tournesol', kcalPer100g: 884, unit: 'g', category: 'Matières grasses', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Crème fraîche épaisse', kcalPer100g: 292, unit: 'g', category: 'Matières grasses', mealRole: ['lunch_plat', 'dinner_plat', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Crème légère 15%', kcalPer100g: 163, unit: 'g', category: 'Matières grasses', mealRole: ['lunch_plat', 'dinner_plat'] },

  // ── Snacks & Sucreries ────────────────────────────────────────────────────
  { name: 'Chocolat noir 70%', kcalPer100g: 546, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['lunch_dessert', 'dinner_dessert'] },
  { name: 'Chocolat au lait', kcalPer100g: 535, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['lunch_dessert', 'dinner_dessert'] },
  { name: 'Miel', kcalPer100g: 304, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast'] },
  { name: 'Confiture', kcalPer100g: 250, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast'] },
  { name: 'Nutella', kcalPer100g: 539, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast'] },
  { name: 'Amandes', kcalPer100g: 579, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Noix', kcalPer100g: 654, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },
  { name: 'Noisettes', kcalPer100g: 628, unit: 'g', category: 'Snacks & Sucreries', mealRole: ['breakfast', 'lunch_dessert', 'dinner_dessert'] },

  // ── Boissons ──────────────────────────────────────────────────────────────
  { name: 'Jus d\'orange', kcalPer100g: 45, unit: 'g', category: 'Boissons', mealRole: ['breakfast'] },
  { name: 'Café (noir)', kcalPer100g: 2, unit: 'g', category: 'Boissons', mealRole: ['breakfast'] },
  { name: 'Thé (infusion)', kcalPer100g: 1, unit: 'g', category: 'Boissons', mealRole: ['breakfast'] },

  // ── Légumineuses & divers ──────────────────────────────────────────────────
  { name: 'Tofu ferme', kcalPer100g: 76, unit: 'g', category: 'Autre', mealRole: ['lunch_plat', 'dinner_plat'] },
  { name: 'Hummus', kcalPer100g: 177, unit: 'g', category: 'Autre', mealRole: ['lunch_entree', 'dinner_entree'] },
  { name: 'Soupe de légumes', kcalPer100g: 35, unit: 'g', category: 'Autre', mealRole: ['lunch_entree', 'dinner_entree'] },
]

export const DB_CATEGORIES = [...new Set(FOOD_DATABASE.map((f) => f.category))]
