import type { Exercise, MuscleGroup } from './types';

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; view: 'front' | 'back' }[] = [
  { id: 'chest', label: 'Chest', view: 'front' },
  { id: 'shoulders', label: 'Shoulders', view: 'front' },
  { id: 'biceps', label: 'Biceps', view: 'front' },
  { id: 'forearms', label: 'Forearms', view: 'front' },
  { id: 'abs', label: 'Abs', view: 'front' },
  { id: 'obliques', label: 'Obliques', view: 'front' },
  { id: 'quads', label: 'Quads', view: 'front' },
  { id: 'calves', label: 'Calves', view: 'front' },
  { id: 'traps', label: 'Trapezius', view: 'back' },
  { id: 'lats', label: 'Lats', view: 'back' },
  { id: 'triceps', label: 'Triceps', view: 'back' },
  { id: 'lower_back', label: 'Lower Back', view: 'back' },
  { id: 'glutes', label: 'Glutes', view: 'back' },
  { id: 'hamstrings', label: 'Hamstrings', view: 'back' },
];

export const MUSCLE_LABELS: Record<MuscleGroup, string> = MUSCLE_GROUPS.reduce(
  (acc, mg) => ({ ...acc, [mg.id]: mg.label }),
  {} as Record<MuscleGroup, string>,
);

export const EXERCISES: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', category: 'strength', defaultSets: 4, defaultReps: 8, defaultWeight: 135 },
  { id: 'push-ups', name: 'Push-ups', muscleGroup: 'chest', category: 'strength', defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'incline-press', name: 'Incline Dumbbell Press', muscleGroup: 'chest', category: 'strength', defaultSets: 3, defaultReps: 10, defaultWeight: 50 },
  { id: 'cable-flyes', name: 'Cable Flyes', muscleGroup: 'chest', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 30 },
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', category: 'strength', defaultSets: 4, defaultReps: 8, defaultWeight: 95 },
  { id: 'lateral-raises', name: 'Lateral Raises', muscleGroup: 'shoulders', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 20 },
  { id: 'face-pulls', name: 'Face Pulls', muscleGroup: 'shoulders', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 40 },
  { id: 'bicep-curls', name: 'Bicep Curls', muscleGroup: 'biceps', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 35 },
  { id: 'hammer-curls', name: 'Hammer Curls', muscleGroup: 'biceps', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 30 },
  { id: 'preacher-curls', name: 'Preacher Curls', muscleGroup: 'biceps', category: 'strength', defaultSets: 3, defaultReps: 10, defaultWeight: 40 },
  { id: 'tricep-dips', name: 'Tricep Dips', muscleGroup: 'triceps', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'rope-pushdowns', name: 'Rope Pushdowns', muscleGroup: 'triceps', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 45 },
  { id: 'skull-crushers', name: 'Skull Crushers', muscleGroup: 'triceps', category: 'strength', defaultSets: 3, defaultReps: 10, defaultWeight: 50 },
  { id: 'wrist-curls', name: 'Wrist Curls', muscleGroup: 'forearms', category: 'strength', defaultSets: 3, defaultReps: 20, defaultWeight: 25 },
  { id: 'farmer-walks', name: "Farmer's Walks", muscleGroup: 'forearms', category: 'strength', defaultSets: 3, defaultReps: 1, defaultWeight: 60 },
  { id: 'plank', name: 'Plank', muscleGroup: 'abs', category: 'strength', defaultSets: 3, defaultReps: 1, defaultWeight: 0 },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'abs', category: 'strength', defaultSets: 3, defaultReps: 25, defaultWeight: 0 },
  { id: 'hanging-leg-raises', name: 'Hanging Leg Raises', muscleGroup: 'abs', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'russian-twists', name: 'Russian Twists', muscleGroup: 'obliques', category: 'strength', defaultSets: 3, defaultReps: 20, defaultWeight: 15 },
  { id: 'side-bends', name: 'Side Bends', muscleGroup: 'obliques', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 35 },
  { id: 'squats', name: 'Barbell Squats', muscleGroup: 'quads', category: 'strength', defaultSets: 4, defaultReps: 8, defaultWeight: 185 },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'quads', category: 'strength', defaultSets: 4, defaultReps: 12, defaultWeight: 225 },
  { id: 'lunges', name: 'Walking Lunges', muscleGroup: 'quads', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 50 },
  { id: 'leg-extension', name: 'Leg Extensions', muscleGroup: 'quads', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 80 },
  { id: 'calf-raises', name: 'Calf Raises', muscleGroup: 'calves', category: 'strength', defaultSets: 4, defaultReps: 20, defaultWeight: 100 },
  { id: 'seated-calf-raises', name: 'Seated Calf Raises', muscleGroup: 'calves', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 60 },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'lower_back', category: 'strength', defaultSets: 3, defaultReps: 5, defaultWeight: 225 },
  { id: 'supermans', name: "Superman's", muscleGroup: 'lower_back', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'lats', category: 'strength', defaultSets: 4, defaultReps: 8, defaultWeight: 135 },
  { id: 'pull-ups', name: 'Pull-ups', muscleGroup: 'lats', category: 'strength', defaultSets: 3, defaultReps: 10, defaultWeight: 0 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'lats', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 100 },
  { id: 'seated-row', name: 'Seated Cable Row', muscleGroup: 'lats', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 90 },
  { id: 'shrugs', name: 'Barbell Shrugs', muscleGroup: 'traps', category: 'strength', defaultSets: 4, defaultReps: 12, defaultWeight: 135 },
  { id: 'hip-thrust', name: 'Hip Thrusts', muscleGroup: 'glutes', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 135 },
  { id: 'glute-bridge', name: 'Glute Bridges', muscleGroup: 'glutes', category: 'strength', defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'leg-curls', name: 'Lying Leg Curls', muscleGroup: 'hamstrings', category: 'strength', defaultSets: 3, defaultReps: 12, defaultWeight: 70 },
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', category: 'strength', defaultSets: 3, defaultReps: 10, defaultWeight: 135 },
  { id: 'running', name: 'Running', muscleGroup: 'quads', category: 'cardio', defaultSets: 1, defaultReps: 1, defaultWeight: 0 },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'quads', category: 'cardio', defaultSets: 1, defaultReps: 1, defaultWeight: 0 },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'lats', category: 'cardio', defaultSets: 1, defaultReps: 1, defaultWeight: 0 },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function calculateXP(
  sets: number,
  reps: number,
  weight: number,
  durationMin: number,
  category: 'strength' | 'cardio',
): number {
  if (category === 'cardio') {
    return Math.round(durationMin * 8 + 20);
  }
  const volumeXP = sets * reps * 2;
  const weightXP = weight > 0 ? Math.round(weight * sets * 0.3) : 0;
  const baseXP = sets * 10;
  return Math.round(baseXP + volumeXP + weightXP);
}
