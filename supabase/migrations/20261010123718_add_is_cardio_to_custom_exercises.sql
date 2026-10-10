/*
# Add is_cardio column to custom_exercises

1. Modified Tables
  - `custom_exercises`
    - Added `is_cardio` (boolean, not null, default false) to distinguish cardio vs strength custom exercises.

2. Security
  - No policy changes needed — existing RLS policies cover the new column.
*/

ALTER TABLE custom_exercises
  ADD COLUMN IF NOT EXISTS is_cardio boolean NOT NULL DEFAULT false;
