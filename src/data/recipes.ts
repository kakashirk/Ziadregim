/**
 * Recipe template database.
 * Each recipe defines named dishes with ingredient slots mapped to food categories.
 * The meal generator picks matching recipes based on available stock.
 */

export type MealRole =
  | 'breakfast'
  | 'lunch_entree'
  | 'lunch_plat'
  | 'lunch_dessert'
  | 'dinner_entree'
  | 'dinner_plat'
  | 'dinner_dessert'

type FoodCat =
  | 'Légumes'
  | 'Fruits'
  | 'Viandes & Poissons'
  | 'Féculents'
  | 'Produits laitiers'
  | 'Matières grasses'
  | 'Snacks & Sucreries'
  | 'Autre'
  | 'Boissons'

export interface RecipeSlot {
  cats: FoodCat[]
  ratio: number      // fraction of total recipe calories
  optional?: boolean
}

export interface RecipeTemplate {
  id: string
  name: string
  role: MealRole
  slots: RecipeSlot[]
}

export const RECIPES: RecipeTemplate[] = [
  // ── BREAKFAST ─────────────────────────────────────────────────────────────
  { id: 'b1',  name: 'Porridge aux fruits',              role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.60 }, { cats: ['Fruits'],              ratio: 0.25 }, { cats: ['Produits laitiers'],   ratio: 0.15, optional: true }] },
  { id: 'b2',  name: 'Toast au beurre et confiture',     role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Matières grasses'],    ratio: 0.20, optional: true }, { cats: ['Snacks & Sucreries'],  ratio: 0.25 }] },
  { id: 'b3',  name: 'Yaourt granola et fruits',         role: 'breakfast', slots: [{ cats: ['Produits laitiers'],  ratio: 0.45 }, { cats: ['Snacks & Sucreries'], ratio: 0.35 }, { cats: ['Fruits'],              ratio: 0.20, optional: true }] },
  { id: 'b4',  name: 'Œufs au plat',                    role: 'breakfast', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.80 }, { cats: ['Matières grasses'],    ratio: 0.20, optional: true }] },
  { id: 'b5',  name: 'Bol de céréales au lait',         role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.60 }, { cats: ['Produits laitiers'],   ratio: 0.40 }] },
  { id: 'b6',  name: 'Pain au fromage blanc et fruits', role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.45 }, { cats: ['Produits laitiers'],   ratio: 0.35 }, { cats: ['Fruits'],              ratio: 0.20, optional: true }] },
  { id: 'b7',  name: 'Muesli aux fruits et au lait',    role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Produits laitiers'],   ratio: 0.30 }, { cats: ['Fruits'],              ratio: 0.15, optional: true }] },
  { id: 'b8',  name: 'Pancakes maison au miel',         role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.60 }, { cats: ['Snacks & Sucreries'], ratio: 0.25 }, { cats: ['Produits laitiers'],   ratio: 0.15, optional: true }] },
  { id: 'b9',  name: 'Smoothie bowl aux fruits',        role: 'breakfast', slots: [{ cats: ['Fruits'],             ratio: 0.65 }, { cats: ['Produits laitiers'],   ratio: 0.25 }, { cats: ['Snacks & Sucreries'],  ratio: 0.10, optional: true }] },
  { id: 'b10', name: 'Œufs brouillés',                  role: 'breakfast', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Féculents'],           ratio: 0.30, optional: true }] },
  { id: 'b11', name: 'Fromage blanc et fruits',         role: 'breakfast', slots: [{ cats: ['Produits laitiers'],  ratio: 0.60 }, { cats: ['Fruits'],              ratio: 0.40 }] },
  { id: 'b12', name: 'Pain complet au fromage',         role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Produits laitiers'],   ratio: 0.45 }] },
  { id: 'b13', name: 'Tartines aux fruits secs',        role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.50 }, { cats: ['Snacks & Sucreries'], ratio: 0.35 }, { cats: ['Produits laitiers'],   ratio: 0.15, optional: true }] },
  { id: 'b14', name: 'Salade de fruits au yaourt',      role: 'breakfast', slots: [{ cats: ['Fruits'],             ratio: 0.55 }, { cats: ['Produits laitiers'],   ratio: 0.45 }] },
  { id: 'b15', name: 'Toast avocat et fruits',          role: 'breakfast', slots: [{ cats: ['Féculents'],          ratio: 0.45 }, { cats: ['Fruits'],              ratio: 0.55 }] },

  // ── LUNCH ENTRÉE ──────────────────────────────────────────────────────────
  { id: 'le1',  name: 'Salade verte',                   role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'le2',  name: 'Tomates mozzarella',             role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 0.60 }, { cats: ['Produits laitiers'], ratio: 0.40 }] },
  { id: 'le3',  name: 'Soupe de légumes',               role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'le4',  name: 'Taboulé maison',                 role: 'lunch_entree', slots: [{ cats: ['Féculents'], ratio: 0.55 }, { cats: ['Légumes'], ratio: 0.45 }] },
  { id: 'le5',  name: 'Carottes râpées vinaigrette',   role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 0.85 }, { cats: ['Matières grasses'], ratio: 0.15, optional: true }] },
  { id: 'le6',  name: 'Salade de concombre',           role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'le7',  name: 'Salade niçoise',                role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 0.60 }, { cats: ['Viandes & Poissons'], ratio: 0.40 }] },
  { id: 'le8',  name: 'Velouté de légumes',            role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'le9',  name: 'Crudités maison',               role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'le10', name: 'Salade composée',               role: 'lunch_entree', slots: [{ cats: ['Légumes'], ratio: 0.70 }, { cats: ['Viandes & Poissons', 'Produits laitiers'], ratio: 0.30, optional: true }] },

  // ── LUNCH PLAT ────────────────────────────────────────────────────────────
  { id: 'lp1',  name: 'Poulet rôti aux légumes',        role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp2',  name: 'Pasta bolognaise',               role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Viandes & Poissons'], ratio: 0.45 }] },
  { id: 'lp3',  name: 'Riz sauté au poulet',            role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.50 }, { cats: ['Viandes & Poissons'], ratio: 0.40 }, { cats: ['Légumes'], ratio: 0.10, optional: true }] },
  { id: 'lp4',  name: 'Saumon grillé aux épinards',     role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp5',  name: 'Omelette aux champignons',       role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp6',  name: 'Steak et haricots verts',        role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp7',  name: 'Thon et légumes du soleil',      role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'],  ratio: 0.35 }] },
  { id: 'lp8',  name: 'Lentilles à la viande',          role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.50 }, { cats: ['Viandes & Poissons'], ratio: 0.50 }] },
  { id: 'lp9',  name: 'Bowl quinoa et poulet',          role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.40 }, { cats: ['Viandes & Poissons'], ratio: 0.50 }, { cats: ['Légumes'], ratio: 0.10, optional: true }] },
  { id: 'lp10', name: 'Sauté de tofu aux légumes',      role: 'lunch_plat', slots: [{ cats: ['Autre'],              ratio: 0.65 }, { cats: ['Légumes'],  ratio: 0.35 }] },
  { id: 'lp11', name: 'Poêlée de légumes et riz',       role: 'lunch_plat', slots: [{ cats: ['Légumes'],            ratio: 0.50 }, { cats: ['Féculents'], ratio: 0.50 }] },
  { id: 'lp12', name: 'Poisson au four aux légumes',    role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp13', name: 'Poulet au curry et riz',         role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.60 }, { cats: ['Féculents'], ratio: 0.40 }] },
  { id: 'lp14', name: 'Pasta au saumon',                role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Viandes & Poissons'], ratio: 0.45 }] },
  { id: 'lp15', name: 'Escalope de dinde vapeur',       role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },
  { id: 'lp16', name: 'Riz complet aux légumes',        role: 'lunch_plat', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Légumes'],  ratio: 0.45 }] },
  { id: 'lp17', name: 'Poulet basquaise',               role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'],  ratio: 0.35 }] },
  { id: 'lp18', name: 'Sardines poêlées et légumes',    role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'],  ratio: 0.35 }] },
  { id: 'lp19', name: 'Gratin de légumes',              role: 'lunch_plat', slots: [{ cats: ['Légumes'],            ratio: 0.60 }, { cats: ['Produits laitiers'], ratio: 0.30 }, { cats: ['Féculents'], ratio: 0.10, optional: true }] },
  { id: 'lp20', name: 'Crevettes sautées ail-persil',   role: 'lunch_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'],  ratio: 0.30 }] },

  // ── LUNCH DESSERT ─────────────────────────────────────────────────────────
  { id: 'ld1', name: 'Fruit frais de saison',           role: 'lunch_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'ld2', name: 'Yaourt nature',                   role: 'lunch_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 1.00 }] },
  { id: 'ld3', name: 'Yaourt et fruits frais',          role: 'lunch_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 0.60 }, { cats: ['Fruits'], ratio: 0.40, optional: true }] },
  { id: 'ld4', name: 'Compote de fruits maison',        role: 'lunch_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'ld5', name: 'Carré de chocolat noir',          role: 'lunch_dessert', slots: [{ cats: ['Snacks & Sucreries'], ratio: 1.00 }] },
  { id: 'ld6', name: 'Salade de fruits frais',          role: 'lunch_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'ld7', name: 'Fromage blanc',                   role: 'lunch_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 1.00 }] },
  { id: 'ld8', name: 'Fruits et noix',                  role: 'lunch_dessert', slots: [{ cats: ['Fruits'], ratio: 0.65 }, { cats: ['Snacks & Sucreries'], ratio: 0.35 }] },

  // ── DINNER ENTRÉE ─────────────────────────────────────────────────────────
  { id: 'de1', name: 'Salade verte du soir',            role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'de2', name: 'Velouté de courgettes',           role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'de3', name: 'Soupe du soir',                   role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'de4', name: 'Salade d\'avocat',                role: 'dinner_entree', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'de5', name: 'Champignons sautés',              role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'de6', name: 'Crudités maison',                 role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },
  { id: 'de7', name: 'Minestrone léger',                role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 0.70 }, { cats: ['Féculents'], ratio: 0.30, optional: true }] },
  { id: 'de8', name: 'Salade mixte',                    role: 'dinner_entree', slots: [{ cats: ['Légumes'], ratio: 1.00 }] },

  // ── DINNER PLAT ───────────────────────────────────────────────────────────
  { id: 'dp1',  name: 'Filet de poisson vapeur',        role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },
  { id: 'dp2',  name: 'Poulet basquaise du soir',       role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'], ratio: 0.35 }] },
  { id: 'dp3',  name: 'Bœuf mijoté aux légumes',        role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'], ratio: 0.35 }] },
  { id: 'dp4',  name: 'Dinde rôtie au thym',            role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.75 }, { cats: ['Légumes'], ratio: 0.25 }] },
  { id: 'dp5',  name: 'Pasta primavera',                role: 'dinner_plat', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Légumes'], ratio: 0.45 }] },
  { id: 'dp6',  name: 'Riz aux légumes du soir',        role: 'dinner_plat', slots: [{ cats: ['Féculents'],          ratio: 0.55 }, { cats: ['Légumes'], ratio: 0.45 }] },
  { id: 'dp7',  name: 'Sardines grillées au citron',    role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },
  { id: 'dp8',  name: 'Lentilles aux légumes',          role: 'dinner_plat', slots: [{ cats: ['Féculents'],          ratio: 0.60 }, { cats: ['Légumes'], ratio: 0.40 }] },
  { id: 'dp9',  name: 'Tofu sauté aux légumes',         role: 'dinner_plat', slots: [{ cats: ['Autre'],              ratio: 0.60 }, { cats: ['Légumes'], ratio: 0.40 }] },
  { id: 'dp10', name: 'Saumon en papillote',            role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },
  { id: 'dp11', name: 'Escalope milanaise légère',      role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },
  { id: 'dp12', name: 'Crevettes à l\'ail et légumes',  role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },
  { id: 'dp13', name: 'Poulet rôti aux herbes',         role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.75 }, { cats: ['Légumes'], ratio: 0.25 }] },
  { id: 'dp14', name: 'Morue aux légumes méditerranéens', role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'], ratio: 0.35 }] },
  { id: 'dp15', name: 'Truite aux herbes',              role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.80 }, { cats: ['Légumes'], ratio: 0.20 }] },
  { id: 'dp16', name: 'Agneau aux légumes',             role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.65 }, { cats: ['Légumes'], ratio: 0.35 }] },
  { id: 'dp17', name: 'Poêlée de légumes gratinée',     role: 'dinner_plat', slots: [{ cats: ['Légumes'],            ratio: 0.70 }, { cats: ['Produits laitiers'], ratio: 0.30 }] },
  { id: 'dp18', name: 'Thon grillé et légumes verts',   role: 'dinner_plat', slots: [{ cats: ['Viandes & Poissons'], ratio: 0.70 }, { cats: ['Légumes'], ratio: 0.30 }] },

  // ── DINNER DESSERT ────────────────────────────────────────────────────────
  { id: 'dd1', name: 'Fruit frais du soir',             role: 'dinner_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'dd2', name: 'Yaourt au miel',                  role: 'dinner_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 0.70 }, { cats: ['Snacks & Sucreries'], ratio: 0.30 }] },
  { id: 'dd3', name: 'Plateau de fromages',             role: 'dinner_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 1.00 }] },
  { id: 'dd4', name: 'Compote maison',                  role: 'dinner_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'dd5', name: 'Fruits rouges frais',             role: 'dinner_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
  { id: 'dd6', name: 'Yaourt nature du soir',           role: 'dinner_dessert', slots: [{ cats: ['Produits laitiers'], ratio: 1.00 }] },
  { id: 'dd7', name: 'Salade de fruits',                role: 'dinner_dessert', slots: [{ cats: ['Fruits'], ratio: 1.00 }] },
]
