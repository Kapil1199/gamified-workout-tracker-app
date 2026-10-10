/*
# Create workouts table (single-tenant, no auth)

1. New Tables
  - `workouts`
    - `id` (uuid, primary key)
    - `exercise_id` (text, not null) — references a hardcoded exercise catalog key
    - `exercise_name` (text, not null) — denormalized for history display
    - `muscle_group` (text, not null) — primary muscle group (e.g. "chest", "quads")
    - `sets` (int, not null) — number of sets performed
    - `reps` (int, not null) — reps per set
    - `weight` (numeric, default 0) — weight used in lbs
    - `duration_min` (int, default 0) — duration in minutes (for cardio)
    - `xp` (int, not null) — XP earned for this workout entry
    - `logged_at` (timestamptz, default now()) — when the workout was logged

2. Security
  - Enable RLS on `workouts`.
  - Single-tenant app with no sign-in: allow anon + authenticated full CRUD.
    Data is intentionally public/shared within this app instance.

3. Indexes
  - `workouts_logged_at_idx` on `logged_at` (descending) for history queries.
  - `workouts_muscle_group_idx` on `muscle_group` for body-map aggregation.
*/

CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id text NOT NULL,
  exercise_name text NOT NULL,
  muscle_group text NOT NULL,
  sets int NOT NULL DEFAULT 3,
  reps int NOT NULL DEFAULT 12,
  weight numeric NOT NULL DEFAULT 0,
  duration_min int NOT NULL DEFAULT 0,
  xp int NOT NULL DEFAULT 0,
  logged_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workouts" ON workouts;
CREATE POLICY "anon_select_workouts" ON workouts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workouts" ON workouts;
CREATE POLICY "anon_insert_workouts" ON workouts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workouts" ON workouts;
CREATE POLICY "anon_update_workouts" ON workouts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workouts" ON workouts;
CREATE POLICY "anon_delete_workouts" ON workouts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS workouts_logged_at_idx ON workouts (logged_at DESC);
CREATE INDEX IF NOT EXISTS workouts_muscle_group_idx ON workouts (muscle_group);
