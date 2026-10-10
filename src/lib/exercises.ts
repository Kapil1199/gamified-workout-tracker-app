import type { ExerciseCatalog, FlattenedExercise, MuscleGroup } from './types';

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

export const ALL_MUSCLE_GROUPS = MUSCLE_GROUPS.map((mg) => mg.id);

export const EXERCISE_CATALOG: ExerciseCatalog = {
  MuscleGroup: {
    chest: {
      'Push-ups': { baseXpPerRep: 2.2 },
      'Dumbbell Floor Press': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Band Chest Press': { baseXpPerRep: 1.8 },
    },
    shoulders: {
      'Pike Push-ups': { baseXpPerRep: 2.5 },
      'Dumbbell Overhead Press': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Band Lateral Raises': { baseXpPerRep: 1.5 },
    },
    biceps: {
      'Dumbbell Curls': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Band Curls': { baseXpPerRep: 1.5 },
    },
    forearms: {
      'Dumbbell Wrist Curls': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Towel Hangs': { baseXpPerRep: 2.0 },
    },
    abs: {
      'Crunches': { baseXpPerRep: 1.5 },
      'Plank': { baseXpPerRep: 1.0, isDuration: true },
      'Leg Raises': { baseXpPerRep: 2.0 },
    },
    obliques: {
      'Russian Twists': { baseXpPerRep: 1.5 },
      'Side Plank': { baseXpPerRep: 1.0, isDuration: true },
    },
    quads: {
      'Bodyweight Squats': { baseXpPerRep: 1.8 },
      'Dumbbell Goblet Squats': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Jump Squats': { baseXpPerRep: 2.2 },
    },
    calves: {
      'Standing Calf Raises': { baseXpPerRep: 1.0 },
      'Skipping Rope': { baseXpPerRep: 0.5 },
    },
    traps: {
      'Dumbbell Shrugs': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Downward Dog Holds': { baseXpPerRep: 2.0 },
    },
    lats: {
      'Dumbbell Rows': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Band Pulldowns': { baseXpPerRep: 1.8 },
    },
    triceps: {
      'Chair Dips': { baseXpPerRep: 2.2 },
      'Dumbbell Overhead Extension': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
    },
    lower_back: {
      'Superman Holds': { baseXpPerRep: 2.0 },
    },
    glutes: {
      'Glute Bridges': { baseXpPerRep: 1.8 },
      'Dumbbell Romanian Deadlifts': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
    },
    hamstrings: {
      'Dumbbell RDLs': { baseXpPerRep: 1.5, weightMultiplier: 0.5 },
      'Sliding Leg Curls': { baseXpPerRep: 2.0 },
    },
  },
  Cardio: {
    'Running': { xpPerMinute: 10 },
    'Cycling': { xpPerMinute: 10 },
    'Swimming': { xpPerMinute: 10 },
    'Football': { xpPerMinute: 10 },
    'Badminton': { xpPerMinute: 10 },
  },
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const _flattened: FlattenedExercise[] = [];

for (const [mgName, exercises] of Object.entries(EXERCISE_CATALOG.MuscleGroup)) {
  const muscleGroup = mgName as MuscleGroup;
  if (!exercises) continue;
  for (const [exName, def] of Object.entries(exercises)) {
    _flattened.push({
      id: `builtin-${slugify(exName)}`,
      name: exName,
      type: 'strength' as const,
      muscleGroup,
      baseXpPerRep: def.baseXpPerRep,
      weightMultiplier: def.weightMultiplier,
      isDuration: def.isDuration,
    });
  }
}

for (const [exName, def] of Object.entries(EXERCISE_CATALOG.Cardio)) {
  _flattened.push({
    id: `builtin-${slugify(exName)}`,
    name: exName,
    type: 'cardio' as const,
    xpPerMinute: def.xpPerMinute,
  });
}

export const EXERCISES: FlattenedExercise[] = _flattened;

export function getExerciseById(id: string): FlattenedExercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(mg: MuscleGroup): FlattenedExercise[] {
  return EXERCISES.filter((e) => e.type === 'strength' && e.muscleGroup === mg);
}

export function getCardioExercises(): FlattenedExercise[] {
  return EXERCISES.filter((e) => e.type === 'cardio');
}

export function calculateStrengthXP(
  sets: number,
  reps: number,
  weight: number,
  baseXpPerRep: number,
  weightMultiplier?: number,
): number {
  if (sets === 0 || reps === 0) return 0;
  const volumeXP = sets * reps * baseXpPerRep;
  const totalWeight = sets * reps * weight;
  const weightXP = weight > 0 && weightMultiplier ? totalWeight * weightMultiplier : 0;
  return Math.round(volumeXP + weightXP);
}

export function calculateDurationXP(
  sets: number,
  durationSec: number,
  baseXpPerRep: number,
): number {
  if (sets === 0 || durationSec === 0) return 0;
  return Math.round(sets * durationSec * baseXpPerRep);
}

export function calculateCardioXP(durationMin: number, xpPerMinute: number): number {
  return Math.round(durationMin * xpPerMinute);
}
