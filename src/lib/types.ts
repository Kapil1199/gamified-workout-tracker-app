export type MuscleGroup =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'glutes'
  | 'lats'
  | 'traps'
  | 'lower_back';

export type ExerciseType = 'strength' | 'cardio';

export interface StrengthExerciseDef {
  baseXpPerRep: number;
  weightMultiplier?: number;
  isDuration?: boolean;
}

export interface CardioExerciseDef {
  xpPerMinute: number;
}

export interface ExerciseCatalog {
  MuscleGroup: Partial<Record<MuscleGroup, Record<string, StrengthExerciseDef>>>;
  Cardio: Record<string, CardioExerciseDef>;
}

export interface FlattenedExercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroup?: MuscleGroup;
  baseXpPerRep?: number;
  weightMultiplier?: number;
  isDuration?: boolean;
  xpPerMinute?: number;
}

export interface Workout {
  id: string;
  exercise_id: string;
  exercise_name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: number;
  duration_min: number;
  xp: number;
  logged_at: string;
}

export interface NewWorkout {
  exercise_id: string;
  exercise_name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: number;
  duration_min: number;
  xp: number;
}

export interface CustomExercise {
  id: string;
  name: string;
  xp_per_set: number;
  muscle_group: string;
  is_cardio: boolean;
  created_at: string;
}

export interface NewCustomExercise {
  name: string;
  xp_per_set: number;
  muscle_group: string;
  is_cardio: boolean;
}

export type GoalStatus = 'in_progress' | 'completed';

export interface Goal {
  id: string;
  title: string;
  status: GoalStatus;
  xp_reward: number;
  created_at: string;
  completed_at: string | null;
}

export interface NewGoal {
  title: string;
  xp_reward: number;
}
