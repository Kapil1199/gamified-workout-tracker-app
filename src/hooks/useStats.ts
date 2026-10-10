import { useMemo } from 'react';
import type { Workout, Goal } from '@/lib/types';
import { getLevelInfo } from '@/lib/xp';

export function useStats(workouts: Workout[], goals: Goal[] = []) {
  return useMemo(() => {
    const workoutXP = workouts.reduce((sum, w) => sum + w.xp, 0);
    const goalXP = goals
      .filter((g) => g.status === 'completed')
      .reduce((sum, g) => sum + g.xp_reward, 0);
    const totalXP = workoutXP + goalXP;
    const levelInfo = getLevelInfo(totalXP);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = workouts.filter((w) => new Date(w.logged_at) >= today).length;

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    thisWeek.setHours(0, 0, 0, 0);
    const weekCount = workouts.filter((w) => new Date(w.logged_at) >= thisWeek).length;

    const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);
    const totalReps = workouts.reduce((sum, w) => sum + w.sets * w.reps, 0);
    const totalVolume = workouts.reduce(
      (sum, w) => sum + w.sets * w.reps * Number(w.weight),
      0,
    );

    const uniqueMuscles = new Set(workouts.map((w) => w.muscle_group)).size;
    const completedGoals = goals.filter((g) => g.status === 'completed').length;
    const activeGoals = goals.filter((g) => g.status === 'in_progress').length;

    return {
      totalXP,
      workoutXP,
      goalXP,
      levelInfo,
      todayCount,
      weekCount,
      totalSets,
      totalReps,
      totalVolume,
      uniqueMuscles,
      totalWorkouts: workouts.length,
      completedGoals,
      activeGoals,
      totalGoals: goals.length,
    };
  }, [workouts, goals]);
}
