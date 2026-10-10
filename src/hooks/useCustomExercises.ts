import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CustomExercise, NewCustomExercise } from '@/lib/types';

export function useCustomExercises() {
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustom = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('custom_exercises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load custom exercises:', error.message);
    } else {
      setCustomExercises(data as CustomExercise[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustom();
  }, [fetchCustom]);

  const addCustomExercise = useCallback(async (entry: NewCustomExercise) => {
    const { data, error } = await supabase
      .from('custom_exercises')
      .insert(entry)
      .select()
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Failed to create custom exercise:', error.message);
      return null;
    }

    const newEx = (data as CustomExercise[])[0];
    if (newEx) {
      setCustomExercises((prev) => [newEx, ...prev]);
    }
    return newEx;
  }, []);

  const deleteCustomExercise = useCallback(async (id: string) => {
    const { error } = await supabase.from('custom_exercises').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete custom exercise:', error.message);
      return false;
    }
    setCustomExercises((prev) => prev.filter((e) => e.id !== id));
    return true;
  }, []);

  return {
    customExercises,
    loading,
    addCustomExercise,
    deleteCustomExercise,
    refetch: fetchCustom,
  };
}
