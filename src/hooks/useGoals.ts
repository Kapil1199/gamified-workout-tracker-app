import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Goal, NewGoal, GoalStatus } from '@/lib/types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load goals:', error.message);
    } else {
      setGoals(data as Goal[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (entry: NewGoal) => {
    const { data, error } = await supabase
      .from('goals')
      .insert(entry)
      .select()
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Failed to add goal:', error.message);
      return null;
    }

    const newGoal = (data as Goal[])[0];
    if (newGoal) {
      setGoals((prev) => [newGoal, ...prev]);
    }
    return newGoal;
  }, []);

  const updateGoalStatus = useCallback(
    async (id: string, status: GoalStatus): Promise<Goal | null> => {
      const updates: Record<string, string | null> = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      } else {
        updates.completed_at = null;
      }

      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .limit(1);

      if (error) {
        console.error('Failed to update goal:', error.message);
        return null;
      }

      const updated = (data as Goal[])[0];
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      }
      return updated;
    },
    [],
  );

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete goal:', error.message);
      return false;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    return true;
  }, []);

  return { goals, loading, addGoal, updateGoalStatus, deleteGoal, refetch: fetchGoals };
}
