export interface NutrientInfo {
  name: string
  kcalPer100g: number
  unit: 'g' | 'unit'
  gramsPerUnit?: number
  category: string
  mealRole: MealRole[]
  proteins: number   // g per 100g
  lipids: number     // g per 100g
  carbs: number      // g per 100g
  fiber: number      // g per 100g
}

export type MealRole =
  | 'breakfast'
  | 'lunch_entree'
  | 'lunch_plat'
  | 'lunch_dessert'
  | 'dinner_entree'
  | 'dinner_plat'
  | 'dinner_dessert'
  | 'any'

// prettier-ignore
export const FOOD_DATABASE: NutrientInfo[] = [
  // ── Fruits ────────────────────────────────────────────────────────────────
  { name:'Pomme',          kcalPer100g:52,  unit:'unit', gramsPerUnit:182, category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.3, lipids:0.2, carbs:14,  fiber:2.4 },
  { name:'Banane',         kcalPer100g:89,  unit:'unit', gramsPerUnit:118, category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:1.1, lipids:0.3, carbs:23,  fiber:2.6 },
  { name:'Orange',         kcalPer100g:47,  unit:'unit', gramsPerUnit:200, category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.9, lipids:0.1, carbs:12,  fiber:2.4 },
  { name:'Fraise',         kcalPer100g:32,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.7, lipids:0.3, carbs:7.7, fiber:2.0 },
  { name:'Raisin',         kcalPer100g:69,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.6, lipids:0.2, carbs:18,  fiber:0.9 },
  { name:'Kiwi',           kcalPer100g:61,  unit:'unit', gramsPerUnit:80,  category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:1.1, lipids:0.5, carbs:15,  fiber:3.0 },
  { name:'Poire',          kcalPer100g:57,  unit:'unit', gramsPerUnit:178, category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.4, lipids:0.1, carbs:15,  fiber:3.1 },
  { name:'Mangue',         kcalPer100g:60,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.8, lipids:0.4, carbs:15,  fiber:1.6 },
  { name:'Pastèque',       kcalPer100g:30,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.6, lipids:0.2, carbs:7.6, fiber:0.4 },
  { name:'Melon',          kcalPer100g:34,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.8, lipids:0.2, carbs:8.2, fiber:0.9 },
  { name:'Abricot',        kcalPer100g:48,  unit:'unit', gramsPerUnit:35,  category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:1.4, lipids:0.4, carbs:11,  fiber:2.0 },
  { name:'Pêche',          kcalPer100g:39,  unit:'unit', gramsPerUnit:150, category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.9, lipids:0.3, carbs:10,  fiber:1.5 },
  { name:'Ananas',         kcalPer100g:50,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.5, lipids:0.1, carbs:13,  fiber:1.4 },
  { name:'Myrtilles',      kcalPer100g:57,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.7, lipids:0.3, carbs:14,  fiber:2.4 },
  { name:'Framboises',     kcalPer100g:52,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:1.2, lipids:0.7, carbs:12,  fiber:6.5 },
  { name:'Citron',         kcalPer100g:29,  unit:'unit', gramsPerUnit:80,  category:'Fruits', mealRole:['any'],                                        proteins:1.1, lipids:0.3, carbs:9.3, fiber:2.8 },
  { name:'Cerise',         kcalPer100g:63,  unit:'g',                      category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:1.0, lipids:0.3, carbs:16,  fiber:2.1 },
  { name:'Prune',          kcalPer100g:46,  unit:'unit', gramsPerUnit:66,  category:'Fruits', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.7, lipids:0.3, carbs:11,  fiber:1.4 },

  // ── Légumes ───────────────────────────────────────────────────────────────
  { name:'Tomate',         kcalPer100g:18,  unit:'unit', gramsPerUnit:123, category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:0.9, lipids:0.2, carbs:3.9, fiber:1.2 },
  { name:'Salade verte',   kcalPer100g:15,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:1.4, lipids:0.2, carbs:2.9, fiber:1.3 },
  { name:'Concombre',      kcalPer100g:16,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:0.7, lipids:0.1, carbs:3.6, fiber:0.5 },
  { name:'Carotte',        kcalPer100g:41,  unit:'unit', gramsPerUnit:80,  category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:0.9, lipids:0.2, carbs:10,  fiber:2.8 },
  { name:'Poivron rouge',  kcalPer100g:31,  unit:'unit', gramsPerUnit:160, category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:1.0, lipids:0.3, carbs:6.0, fiber:2.1 },
  { name:'Poivron vert',   kcalPer100g:20,  unit:'unit', gramsPerUnit:150, category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:0.9, lipids:0.2, carbs:4.6, fiber:1.7 },
  { name:'Courgette',      kcalPer100g:17,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:1.2, lipids:0.3, carbs:3.1, fiber:1.0 },
  { name:'Aubergine',      kcalPer100g:25,  unit:'g',                      category:'Légumes', mealRole:['lunch_plat','dinner_plat'],                   proteins:1.0, lipids:0.2, carbs:5.7, fiber:3.0 },
  { name:'Brocoli',        kcalPer100g:34,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:2.8, lipids:0.4, carbs:6.6, fiber:2.6 },
  { name:'Épinards',       kcalPer100g:23,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:2.9, lipids:0.4, carbs:3.6, fiber:2.2 },
  { name:'Champignons',    kcalPer100g:22,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:3.1, lipids:0.3, carbs:3.3, fiber:1.0 },
  { name:'Haricots verts', kcalPer100g:31,  unit:'g',                      category:'Légumes', mealRole:['lunch_plat','dinner_plat'],                   proteins:1.8, lipids:0.1, carbs:7.1, fiber:3.4 },
  { name:'Petits pois',    kcalPer100g:81,  unit:'g',                      category:'Légumes', mealRole:['lunch_plat','dinner_plat'],                   proteins:5.4, lipids:0.4, carbs:14,  fiber:5.1 },
  { name:'Avocat',         kcalPer100g:160, unit:'unit', gramsPerUnit:200, category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:2.0, lipids:15,  carbs:9.0, fiber:6.7 },
  { name:'Oignon',         kcalPer100g:40,  unit:'unit', gramsPerUnit:110, category:'Légumes', mealRole:['lunch_plat','dinner_plat'],                   proteins:1.1, lipids:0.1, carbs:9.3, fiber:1.7 },
  { name:'Ail',            kcalPer100g:149, unit:'g',                      category:'Légumes', mealRole:['lunch_plat','dinner_plat'],                   proteins:6.4, lipids:0.5, carbs:33,  fiber:2.1 },
  { name:'Poireau',        kcalPer100g:31,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:1.5, lipids:0.3, carbs:7.6, fiber:1.8 },
  { name:'Céleri',         kcalPer100g:16,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:0.7, lipids:0.2, carbs:3.5, fiber:1.6 },
  { name:'Radis',          kcalPer100g:16,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:0.7, lipids:0.1, carbs:3.4, fiber:1.6 },
  { name:'Betterave',      kcalPer100g:43,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:1.6, lipids:0.2, carbs:10,  fiber:2.8 },
  { name:'Chou-fleur',     kcalPer100g:25,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:1.9, lipids:0.3, carbs:5.0, fiber:2.0 },
  { name:'Chou vert',      kcalPer100g:25,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:1.3, lipids:0.1, carbs:5.8, fiber:2.5 },
  { name:'Asperge',        kcalPer100g:20,  unit:'g',                      category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:2.2, lipids:0.1, carbs:3.9, fiber:2.1 },
  { name:'Artichaut',      kcalPer100g:53,  unit:'unit', gramsPerUnit:120, category:'Légumes', mealRole:['lunch_entree','dinner_entree'],               proteins:2.9, lipids:0.2, carbs:11,  fiber:8.6 },

  // ── Viandes ───────────────────────────────────────────────────────────────
  { name:'Blanc de poulet',    kcalPer100g:165, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:31,  lipids:3.6,  carbs:0,   fiber:0 },
  { name:'Cuisse de poulet',   kcalPer100g:209, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:26,  lipids:11,   carbs:0,   fiber:0 },
  { name:'Bœuf haché 5%',      kcalPer100g:137, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:21,  lipids:5.0,  carbs:0,   fiber:0 },
  { name:'Bœuf haché 15%',     kcalPer100g:215, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:19,  lipids:15,   carbs:0,   fiber:0 },
  { name:'Steak de bœuf',      kcalPer100g:250, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:26,  lipids:16,   carbs:0,   fiber:0 },
  { name:'Côte de porc',       kcalPer100g:242, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:23,  lipids:16,   carbs:0,   fiber:0 },
  { name:'Filet de dinde',     kcalPer100g:157, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:30,  lipids:3.2,  carbs:0,   fiber:0 },
  { name:'Jambon blanc',       kcalPer100g:107, unit:'g', category:'Viandes & Poissons', mealRole:['breakfast','lunch_entree','dinner_entree'], proteins:16, lipids:3.8, carbs:1.5, fiber:0 },
  { name:'Jambon de pays',     kcalPer100g:268, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree'], proteins:25, lipids:18, carbs:0.5, fiber:0 },
  { name:'Lardons',            kcalPer100g:337, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:14,  lipids:30,   carbs:0.5, fiber:0 },
  { name:'Agneau (gigot)',      kcalPer100g:282, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:25,  lipids:19,   carbs:0,   fiber:0 },
  { name:'Canard (magret)',     kcalPer100g:201, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:24,  lipids:11,   carbs:0,   fiber:0 },
  { name:'Veau (escalope)',     kcalPer100g:110, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:22,  lipids:2.4,  carbs:0,   fiber:0 },

  // ── Poissons & Fruits de mer ───────────────────────────────────────────────
  { name:'Saumon',             kcalPer100g:208, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:20,  lipids:13,   carbs:0,   fiber:0 },
  { name:'Saumon fumé',        kcalPer100g:172, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree'], proteins:25, lipids:8.0, carbs:0, fiber:0 },
  { name:'Thon (en boîte)',    kcalPer100g:116, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:26, lipids:1.0, carbs:0, fiber:0 },
  { name:'Cabillaud',          kcalPer100g:82,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:18,  lipids:0.7,  carbs:0,   fiber:0 },
  { name:'Crevettes',          kcalPer100g:99,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:18, lipids:1.1, carbs:1.5, fiber:0 },
  { name:'Sardines (en boîte)',kcalPer100g:208, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree'], proteins:25, lipids:11, carbs:1.5, fiber:0 },
  { name:'Truite',             kcalPer100g:149, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:21,  lipids:7.2,  carbs:0,   fiber:0 },
  { name:'Lieu noir',          kcalPer100g:90,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:18,  lipids:1.5,  carbs:0,   fiber:0 },
  { name:'Dorade',             kcalPer100g:96,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:18,  lipids:2.3,  carbs:0,   fiber:0 },
  { name:'Moules',             kcalPer100g:86,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_entree','dinner_entree','lunch_plat','dinner_plat'], proteins:12, lipids:2.2, carbs:3.7, fiber:0 },
  { name:'Calamars',           kcalPer100g:92,  unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:16,  lipids:1.4,  carbs:3.1, fiber:0 },
  { name:'Maquereau',          kcalPer100g:205, unit:'g', category:'Viandes & Poissons', mealRole:['lunch_plat','dinner_plat'], proteins:19,  lipids:14,   carbs:0,   fiber:0 },

  // ── Œufs ──────────────────────────────────────────────────────────────────
  { name:"Œuf entier",         kcalPer100g:155, unit:'unit', gramsPerUnit:60,  category:'Produits laitiers', mealRole:['breakfast','lunch_plat','dinner_plat'], proteins:13, lipids:11, carbs:1.1, fiber:0 },
  { name:"Blanc d'œuf",        kcalPer100g:52,  unit:'unit', gramsPerUnit:33,  category:'Produits laitiers', mealRole:['breakfast','lunch_plat','dinner_plat'], proteins:11, lipids:0.2,carbs:0.7, fiber:0 },

  // ── Produits laitiers ──────────────────────────────────────────────────────
  { name:'Lait entier',        kcalPer100g:61,  unit:'g', category:'Produits laitiers', mealRole:['breakfast'], proteins:3.2, lipids:3.5, carbs:4.8, fiber:0 },
  { name:'Lait demi-écrémé',   kcalPer100g:46,  unit:'g', category:'Produits laitiers', mealRole:['breakfast'], proteins:3.2, lipids:1.5, carbs:4.8, fiber:0 },
  { name:'Lait écrémé',        kcalPer100g:34,  unit:'g', category:'Produits laitiers', mealRole:['breakfast'], proteins:3.4, lipids:0.1, carbs:5.0, fiber:0 },
  { name:'Yaourt nature',      kcalPer100g:59,  unit:'unit', gramsPerUnit:125, category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:5.0, lipids:3.2, carbs:4.7, fiber:0 },
  { name:'Yaourt grec nature', kcalPer100g:97,  unit:'unit', gramsPerUnit:150, category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:9.0, lipids:5.0, carbs:3.6, fiber:0 },
  { name:'Fromage blanc 0%',   kcalPer100g:47,  unit:'g', category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:8.0, lipids:0.2, carbs:4.0, fiber:0 },
  { name:'Fromage blanc 3%',   kcalPer100g:69,  unit:'g', category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:7.2, lipids:3.0, carbs:4.0, fiber:0 },
  { name:'Emmental',           kcalPer100g:382, unit:'g', category:'Produits laitiers', mealRole:['breakfast','lunch_plat','dinner_plat'], proteins:28, lipids:30, carbs:0.5, fiber:0 },
  { name:'Mozzarella',         kcalPer100g:280, unit:'g', category:'Produits laitiers', mealRole:['lunch_entree','dinner_entree'], proteins:20, lipids:22, carbs:2.5, fiber:0 },
  { name:'Feta',               kcalPer100g:264, unit:'g', category:'Produits laitiers', mealRole:['lunch_entree','dinner_entree'], proteins:14, lipids:21, carbs:4.1, fiber:0 },
  { name:'Camembert',          kcalPer100g:299, unit:'g', category:'Produits laitiers', mealRole:['lunch_dessert','dinner_dessert'], proteins:20, lipids:24, carbs:0.5, fiber:0 },
  { name:'Beurre',             kcalPer100g:717, unit:'g', category:'Matières grasses', mealRole:['breakfast','lunch_plat','dinner_plat'], proteins:0.9, lipids:81, carbs:0.1, fiber:0 },
  { name:'Ricotta',            kcalPer100g:174, unit:'g', category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:11, lipids:13, carbs:3.0, fiber:0 },
  { name:'Parmesan',           kcalPer100g:431, unit:'g', category:'Produits laitiers', mealRole:['lunch_plat','dinner_plat'], proteins:38, lipids:29, carbs:4.1, fiber:0 },
  { name:'Gruyère',            kcalPer100g:413, unit:'g', category:'Produits laitiers', mealRole:['breakfast','lunch_plat','dinner_plat'], proteins:29, lipids:32, carbs:0.4, fiber:0 },
  { name:'Crème dessert',      kcalPer100g:130, unit:'unit', gramsPerUnit:125, category:'Produits laitiers', mealRole:['lunch_dessert','dinner_dessert'], proteins:3.5, lipids:4.5, carbs:20, fiber:0 },
  { name:'Skyr nature',        kcalPer100g:63,  unit:'unit', gramsPerUnit:150, category:'Produits laitiers', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:11, lipids:0.2, carbs:4.0, fiber:0 },

  // ── Féculents & Céréales ───────────────────────────────────────────────────
  { name:'Pain de mie',        kcalPer100g:265, unit:'g', category:'Féculents', mealRole:['breakfast'], proteins:8.0, lipids:3.5, carbs:49, fiber:2.8 },
  { name:'Pain complet',       kcalPer100g:247, unit:'g', category:'Féculents', mealRole:['breakfast','lunch_entree','dinner_entree'], proteins:9.0, lipids:3.5, carbs:41, fiber:6.5 },
  { name:'Baguette',           kcalPer100g:270, unit:'g', category:'Féculents', mealRole:['breakfast','lunch_entree','dinner_entree'], proteins:9.0, lipids:1.5, carbs:55, fiber:3.0 },
  { name:'Riz blanc cuit',     kcalPer100g:130, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:2.7, lipids:0.3, carbs:28, fiber:0.4 },
  { name:'Riz basmati cuit',   kcalPer100g:121, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:2.6, lipids:0.3, carbs:25, fiber:0.4 },
  { name:'Riz complet cuit',   kcalPer100g:112, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:2.6, lipids:0.9, carbs:23, fiber:1.8 },
  { name:'Pâtes cuites',       kcalPer100g:131, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:5.0, lipids:0.9, carbs:25, fiber:1.8 },
  { name:'Pâtes sèches',       kcalPer100g:358, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:13, lipids:1.8, carbs:71, fiber:3.2 },
  { name:'Pomme de terre',     kcalPer100g:77,  unit:'unit', gramsPerUnit:150, category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:2.0, lipids:0.1, carbs:17, fiber:2.2 },
  { name:'Patate douce',       kcalPer100g:86,  unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:1.6, lipids:0.1, carbs:20, fiber:3.0 },
  { name:'Quinoa cuit',        kcalPer100g:120, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:4.4, lipids:1.9, carbs:21, fiber:2.8 },
  { name:'Lentilles cuites',   kcalPer100g:116, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:9.0, lipids:0.4, carbs:20, fiber:7.9 },
  { name:'Pois chiches cuits', kcalPer100g:164, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat','lunch_entree','dinner_entree'], proteins:9.0, lipids:2.6, carbs:27, fiber:7.6 },
  { name:"Flocons d'avoine",   kcalPer100g:389, unit:'g', category:'Féculents', mealRole:['breakfast'], proteins:17, lipids:7.0, carbs:66, fiber:10 },
  { name:'Corn flakes',        kcalPer100g:378, unit:'g', category:'Féculents', mealRole:['breakfast'], proteins:7.0, lipids:0.9, carbs:84, fiber:3.0 },
  { name:'Muesli',             kcalPer100g:367, unit:'g', category:'Féculents', mealRole:['breakfast'], proteins:10, lipids:7.0, carbs:66, fiber:7.0 },
  { name:'Semoule cuite',      kcalPer100g:112, unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:3.8, lipids:0.2, carbs:23, fiber:1.4 },
  { name:'Boulgour cuit',      kcalPer100g:83,  unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:3.1, lipids:0.2, carbs:19, fiber:4.5 },
  { name:'Haricots rouges cuits',kcalPer100g:127,unit:'g',category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:8.7, lipids:0.5, carbs:23, fiber:6.4 },
  { name:'Pain de seigle',     kcalPer100g:259, unit:'g', category:'Féculents', mealRole:['breakfast','lunch_entree','dinner_entree'], proteins:8.5, lipids:3.3, carbs:48, fiber:7.0 },
  { name:'Farine de blé T55',  kcalPer100g:364, unit:'g', category:'Féculents', mealRole:['any'], proteins:10, lipids:1.2, carbs:76, fiber:2.7 },
  { name:'Polenta cuite',      kcalPer100g:71,  unit:'g', category:'Féculents', mealRole:['lunch_plat','dinner_plat'], proteins:1.7, lipids:0.6, carbs:15, fiber:1.0 },

  // ── Matières grasses ───────────────────────────────────────────────────────
  { name:"Huile d'olive",       kcalPer100g:884, unit:'g', category:'Matières grasses', mealRole:['lunch_plat','dinner_plat','lunch_entree','dinner_entree'], proteins:0, lipids:100, carbs:0, fiber:0 },
  { name:'Huile de tournesol',  kcalPer100g:884, unit:'g', category:'Matières grasses', mealRole:['lunch_plat','dinner_plat'], proteins:0, lipids:100, carbs:0, fiber:0 },
  { name:'Crème fraîche épaisse',kcalPer100g:292,unit:'g', category:'Matières grasses', mealRole:['lunch_plat','dinner_plat','lunch_dessert','dinner_dessert'], proteins:2.1, lipids:30, carbs:2.8, fiber:0 },
  { name:'Crème légère 15%',    kcalPer100g:163, unit:'g', category:'Matières grasses', mealRole:['lunch_plat','dinner_plat'], proteins:2.7, lipids:15, carbs:3.4, fiber:0 },
  { name:'Margarine',           kcalPer100g:717, unit:'g', category:'Matières grasses', mealRole:['breakfast'], proteins:0.2, lipids:80, carbs:0.5, fiber:0 },
  { name:'Huile de noix de coco',kcalPer100g:862,unit:'g', category:'Matières grasses', mealRole:['lunch_plat','dinner_plat'], proteins:0, lipids:100, carbs:0, fiber:0 },

  // ── Snacks & Sucreries ─────────────────────────────────────────────────────
  { name:'Chocolat noir 70%',  kcalPer100g:546, unit:'g', category:'Snacks & Sucreries', mealRole:['lunch_dessert','dinner_dessert'], proteins:8.0, lipids:31, carbs:60, fiber:11 },
  { name:'Chocolat au lait',   kcalPer100g:535, unit:'g', category:'Snacks & Sucreries', mealRole:['lunch_dessert','dinner_dessert'], proteins:8.0, lipids:30, carbs:60, fiber:3.5 },
  { name:'Miel',               kcalPer100g:304, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast'], proteins:0.3, lipids:0,   carbs:82,  fiber:0.2 },
  { name:'Confiture',          kcalPer100g:250, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast'], proteins:0.4, lipids:0.1, carbs:65,  fiber:1.0 },
  { name:'Nutella',            kcalPer100g:539, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast'], proteins:6.3, lipids:31,  carbs:58,  fiber:3.4 },
  { name:'Amandes',            kcalPer100g:579, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:21, lipids:50, carbs:22, fiber:12 },
  { name:'Noix',               kcalPer100g:654, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:15, lipids:65, carbs:14, fiber:6.7 },
  { name:'Noisettes',          kcalPer100g:628, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:15, lipids:61, carbs:17, fiber:9.7 },
  { name:'Noix de cajou',      kcalPer100g:553, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:18, lipids:44, carbs:30, fiber:3.3 },
  { name:'Beurre de cacahuète',kcalPer100g:588, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast'], proteins:25, lipids:50, carbs:20, fiber:6.0 },
  { name:'Granola',            kcalPer100g:471, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast'], proteins:10, lipids:20, carbs:64, fiber:7.0 },
  { name:'Biscuits secs',      kcalPer100g:430, unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:7.5, lipids:14, carbs:68, fiber:2.5 },
  { name:'Compote de pommes',  kcalPer100g:47,  unit:'g', category:'Snacks & Sucreries', mealRole:['breakfast','lunch_dessert','dinner_dessert'], proteins:0.2, lipids:0.1, carbs:12, fiber:1.0 },

  // ── Boissons ──────────────────────────────────────────────────────────────
  { name:"Jus d'orange",      kcalPer100g:45,  unit:'g', category:'Boissons', mealRole:['breakfast'], proteins:0.7, lipids:0.2, carbs:10,  fiber:0.2 },
  { name:'Café (noir)',        kcalPer100g:2,   unit:'g', category:'Boissons', mealRole:['breakfast'], proteins:0.3, lipids:0,   carbs:0.3, fiber:0 },
  { name:'Thé (infusion)',     kcalPer100g:1,   unit:'g', category:'Boissons', mealRole:['breakfast'], proteins:0,   lipids:0,   carbs:0.2, fiber:0 },
  { name:'Lait végétal soja',  kcalPer100g:33,  unit:'g', category:'Boissons', mealRole:['breakfast'], proteins:3.3, lipids:1.8, carbs:2.0, fiber:0.5 },
  { name:'Lait végétal avoine',kcalPer100g:47,  unit:'g', category:'Boissons', mealRole:['breakfast'], proteins:1.0, lipids:1.5, carbs:7.0, fiber:0.8 },

  // ── Autre / Légumineuses ───────────────────────────────────────────────────
  { name:'Tofu ferme',         kcalPer100g:76,  unit:'g', category:'Autre', mealRole:['lunch_plat','dinner_plat'], proteins:8.0, lipids:4.8, carbs:1.9, fiber:0.3 },
  { name:'Hummus',             kcalPer100g:177, unit:'g', category:'Autre', mealRole:['lunch_entree','dinner_entree'], proteins:8.0, lipids:10, carbs:14, fiber:6.0 },
  { name:'Soupe de légumes',   kcalPer100g:35,  unit:'g', category:'Autre', mealRole:['lunch_entree','dinner_entree'], proteins:1.5, lipids:0.8, carbs:6.0, fiber:1.5 },
  { name:'Edamame',            kcalPer100g:122, unit:'g', category:'Autre', mealRole:['lunch_entree','dinner_entree'], proteins:11, lipids:5.2, carbs:10, fiber:5.2 },
  { name:'Tempeh',             kcalPer100g:193, unit:'g', category:'Autre', mealRole:['lunch_plat','dinner_plat'], proteins:19, lipids:11, carbs:9.4, fiber:7.4 },
  { name:'Seitan',             kcalPer100g:120, unit:'g', category:'Autre', mealRole:['lunch_plat','dinner_plat'], proteins:25, lipids:2.0, carbs:4.0, fiber:0.6 },
  { name:'Guacamole',          kcalPer100g:155, unit:'g', category:'Autre', mealRole:['lunch_entree','dinner_entree'], proteins:2.0, lipids:15, carbs:8.5, fiber:6.4 },
  { name:'Taboulé',            kcalPer100g:130, unit:'g', category:'Autre', mealRole:['lunch_entree','dinner_entree'], proteins:3.5, lipids:4.0, carbs:20, fiber:2.5 },
]

export const DB_CATEGORIES = [...new Set(FOOD_DATABASE.map((f) => f.category))]
