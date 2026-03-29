-- ============================================================
-- ZiadRegim — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES (infos utilisateur + rôle)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  last_name  text not null,
  role       text not null default 'user' check (role in ('admin', 'user')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. INVITE TOKENS (codes d'invitation générés par l'admin)
create table if not exists public.invite_tokens (
  id         uuid primary key default gen_random_uuid(),
  token      text not null unique,
  label      text,
  used_by    uuid references public.profiles(id),
  used_at    timestamptz,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. FOODS (garde-manger par utilisateur)
create table if not exists public.foods (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users on delete cascade not null,
  name              text not null,
  calories_per_100g numeric not null,
  unit              text not null default 'g',
  grams_per_unit    numeric,
  quantity_in_stock numeric not null default 0,
  category          text,
  proteins          numeric,
  lipids            numeric,
  carbs             numeric,
  fiber             numeric,
  created_at        timestamptz not null default now()
);

-- 4. DAILY PLANS (repas par utilisateur)
create table if not exists public.daily_plans (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete cascade not null,
  date_key      text not null,
  meals         jsonb not null default '[]',
  skipped_meals jsonb not null default '[]',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(user_id, date_key)
);

-- 5. USER SETTINGS (objectif calorique)
create table if not exists public.user_settings (
  user_id          uuid references auth.users on delete cascade primary key,
  daily_goal_kcal  integer not null default 2000
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.invite_tokens enable row level security;
alter table public.foods         enable row level security;
alter table public.daily_plans   enable row level security;
alter table public.user_settings enable row level security;

-- Profiles : chaque utilisateur voit + modifie son propre profil
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- Profiles : admin voit tous les profils (via metadata JWT pour éviter la récursion)
create policy "profiles_admin_read" on public.profiles
  for select using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "profiles_admin_update" on public.profiles
  for update using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Invite tokens : admin peut tout faire
create policy "tokens_admin" on public.invite_tokens
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Invite tokens : n'importe qui peut lire les tokens actifs (pour valider à l'inscription)
create policy "tokens_read_active" on public.invite_tokens
  for select using (is_active = true and used_by is null);

-- Foods : chaque utilisateur gère son propre garde-manger
create policy "foods_own" on public.foods
  for all using (auth.uid() = user_id);

-- Daily plans : chaque utilisateur gère ses propres repas
create policy "plans_own" on public.daily_plans
  for all using (auth.uid() = user_id);

-- User settings : chaque utilisateur gère ses propres réglages
create policy "settings_own" on public.user_settings
  for all using (auth.uid() = user_id);

-- ============================================================
-- ADMIN : donner le rôle admin à Yassine Jost
-- À exécuter UNE FOIS après la première connexion de Yassine
-- ============================================================
-- update auth.users
--   set app_metadata = jsonb_set(coalesce(app_metadata, '{}'), '{role}', '"admin"')
--   where email like '%yassinjost%';
