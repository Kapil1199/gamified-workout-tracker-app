/*
# Create custom_exercises and goals tables (single-tenant, no auth)

1. New Tables
  - `custom_exercises`
    - `id` (uuid, primary key)
    - `name` (text, not null) — user-entered exercise name
    - `xp_per_set` (int, not null) — XP awarded per set/completion
    - `muscle_group` (text, not null) — primary muscle group
    - `created_at` (timestamptz, default now())

  - `goals`
    - `id` (uuid, primary key)
    - `title` (text, not null) — goal description
    - `status` (text, not null, default 'in_progress') — 'in_progress' or 'completed'
    - `xp_reward` (int, not null, default 500) — XP bonus on completion
    - `created_at` (timestamptz, default now())
    - `completed_at` (timestamptz, nullable) — when goal was marked complete

2. Security
  - Enable RLS on both tables.
  - Single-tenant app with no sign-in: allow anon + authenticated full CRUD.

3. Indexes
  - `custom_exercises_created_at_idx` on `created_at`.
  - `goals_created_at_idx` on `created_at`.
*/

CREATE TABLE IF NOT EXISTS custom_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  xp_per_set int NOT NULL DEFAULT 20,
  muscle_group text NOT NULL DEFAULT 'chest',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE custom_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_custom_exercises" ON custom_exercises;
CREATE POLICY "anon_select_custom_exercises" ON custom_exercises FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_custom_exercises" ON custom_exercises;
CREATE POLICY "anon_insert_custom_exercises" ON custom_exercises FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_custom_exercises" ON custom_exercises;
CREATE POLICY "anon_update_custom_exercises" ON custom_exercises FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_custom_exercises" ON custom_exercises;
CREATE POLICY "anon_delete_custom_exercises" ON custom_exercises FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS custom_exercises_created_at_idx ON custom_exercises (created_at DESC);

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  xp_reward int NOT NULL DEFAULT 500,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_goals" ON goals;
CREATE POLICY "anon_select_goals" ON goals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_goals" ON goals;
CREATE POLICY "anon_insert_goals" ON goals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_goals" ON goals;
CREATE POLICY "anon_update_goals" ON goals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_goals" ON goals;
CREATE POLICY "anon_delete_goals" ON goals FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS goals_created_at_idx ON goals (created_at DESC);
