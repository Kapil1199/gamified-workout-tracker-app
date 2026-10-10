import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { NewWorkout, Workout, MuscleGroup } from '@/lib/types';
import { ALL_MUSCLE_GROUPS } from '@/lib/exercises';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('logged_at', { ascending: false });

    if (error) {
      console.error('Failed to load workouts:', error.message);
    } else {
      setWorkouts(data as Workout[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const addWorkout = useCallback(
    async (entry: NewWorkout) => {
      const { data, error } = await supabase
        .from('workouts')
        .insert(entry)
        .select()
        .order('logged_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Failed to log workout:', error.message);
        return null;
      }

      const newWorkout = (data as Workout[])[0];
      if (newWorkout) {
        setWorkouts((prev) => [newWorkout, ...prev]);
      }
      return newWorkout;
    },
    [],
  );

  const deleteWorkout = useCallback(async (id: string) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete workout:', error.message);
      return false;
    }
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    return true;
  }, []);

  return { workouts, loading, addWorkout, deleteWorkout, refetch: fetchWorkouts };
}

export function useMuscleActivity(workouts: Workout[]) {
  const [activity, setActivity] = useState<Partial<Record<MuscleGroup, number>>>({});

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const map: Partial<Record<MuscleGroup, number>> = {};
    for (const w of workouts) {
      if (new Date(w.logged_at) < thirtyDaysAgo) continue;
      const mg = w.muscle_group as MuscleGroup;
      if (ALL_MUSCLE_GROUPS.includes(mg)) {
        map[mg] = (map[mg] ?? 0) + 1;
      }
    }
    setActivity(map);
  }, [workouts]);

  return activity;
}
