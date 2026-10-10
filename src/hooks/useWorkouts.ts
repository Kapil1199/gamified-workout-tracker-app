import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { NewWorkout, Workout, MuscleGroup } from '@/lib/types';

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
  const [activity, setActivity] = useState<Record<MuscleGroup, number>>(
    {} as Record<MuscleGroup, number>,
  );

  useEffect(() => {
    const map: Partial<Record<MuscleGroup, number>> = {};
    for (const w of workouts) {
      map[w.muscle_group] = (map[w.muscle_group] ?? 0) + 1;
    }
    setActivity(map as Record<MuscleGroup, number>);
  }, [workouts]);

  return activity;
}
