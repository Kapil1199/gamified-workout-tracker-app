import { useState, useMemo } from 'react';
import { Dumbbell, X, Plus, Check, Flame, Zap, Sparkles } from 'lucide-react';
import { EXERCISES, MUSCLE_GROUPS, MUSCLE_LABELS, calculateXP } from '@/lib/exercises';
import type { MuscleGroup, NewWorkout, CustomExercise } from '@/lib/types';

interface LogWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  onLog: (entry: NewWorkout) => Promise<{ xp: number } | null>;
  initialMuscle?: MuscleGroup | null;
  customExercises: CustomExercise[];
  onCreateCustomExercise: (name: string, xpPerSet: number, muscleGroup: MuscleGroup) => Promise<CustomExercise | null>;
}

type View = 'log' | 'create-custom';

export function LogWorkoutModal({
  open,
  onClose,
  onLog,
  initialMuscle,
  customExercises,
  onCreateCustomExercise,
}: LogWorkoutModalProps) {
  const [view, setView] = useState<View>('log');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(initialMuscle ?? null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [weight, setWeight] = useState(0);
  const [duration, setDuration] = useState(20);
  const [logging, setLogging] = useState(false);
  const [earnedXP, setEarnedXP] = useState<number | null>(null);

  // Custom exercise form state
  const [customName, setCustomName] = useState('');
  const [customXP, setCustomXP] = useState(20);
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('chest');
  const [creating, setCreating] = useState(false);

  const filteredCustomExercises = useMemo(
    () => (selectedMuscle ? customExercises.filter((e) => e.muscle_group === selectedMuscle) : customExercises),
    [customExercises, selectedMuscle],
  );

  const filteredExercises = useMemo(
    () => (selectedMuscle ? EXERCISES.filter((e) => e.muscleGroup === selectedMuscle) : EXERCISES),
    [selectedMuscle],
  );

  const selectedBuiltinExercise = EXERCISES.find((e) => e.id === selectedExerciseId);
  const selectedCustomExercise = !selectedBuiltinExercise
    ? filteredCustomExercises.find((e) => e.id === selectedExerciseId)
    : undefined;
  const selectedExercise = selectedBuiltinExercise ?? selectedCustomExercise;
  const isCardio = selectedBuiltinExercise?.category === 'cardio';

  const previewXP = useMemo(() => {
    if (!selectedExercise) return 0;
    if (isCustom && selectedCustomExercise) {
      return selectedCustomExercise.xp_per_set * sets;
    }
    if (selectedBuiltinExercise) {
      return calculateXP(sets, reps, weight, duration, selectedBuiltinExercise.category);
    }
    return 0;
  }, [selectedExercise, selectedBuiltinExercise, selectedCustomExercise, isCustom, sets, reps, weight, duration]);

  function selectMuscle(mg: MuscleGroup) {
    setSelectedMuscle(mg);
    setSelectedExerciseId(null);
    setIsCustom(false);
    const first = EXERCISES.find((e) => e.muscleGroup === mg);
    if (first) {
      setSets(first.defaultSets);
      setReps(first.defaultReps);
      setWeight(first.defaultWeight);
      setDuration(20);
    }
  }

  function selectExercise(id: string) {
    setSelectedExerciseId(id);
    const builtin = EXERCISES.find((e) => e.id === id);
    if (builtin) {
      setIsCustom(false);
      setSets(builtin.defaultSets);
      setReps(builtin.defaultReps);
      setWeight(builtin.defaultWeight);
    } else {
      const custom = filteredCustomExercises.find((e) => e.id === id);
      if (custom) {
        setIsCustom(true);
        setSets(3);
        setReps(10);
        setWeight(0);
      }
    }
  }

  async function handleLog() {
    if (!selectedExercise) return;
    setLogging(true);
    setEarnedXP(null);

    const muscleGroup = isCustom && selectedCustomExercise
      ? selectedCustomExercise.muscle_group
      : selectedBuiltinExercise?.muscleGroup ?? selectedMuscle ?? 'chest';

    const entry: NewWorkout = {
      exercise_id: selectedExercise.id,
      exercise_name: isCustom && selectedCustomExercise ? selectedCustomExercise.name : (selectedBuiltinExercise?.name ?? ''),
      muscle_group: muscleGroup,
      sets,
      reps,
      weight,
      duration_min: isCardio ? duration : 0,
      xp: previewXP,
    };

    const result = await onLog(entry);
    setLogging(false);
    if (result) {
      setEarnedXP(result.xp);
      setTimeout(() => handleClose(), 1400);
    }
  }

  async function handleCreateCustom() {
    if (!customName.trim()) return;
    setCreating(true);
    const result = await onCreateCustomExercise(customName.trim(), customXP, customMuscle);
    setCreating(false);
    if (result) {
      setCustomName('');
      setCustomXP(20);
      setView('log');
      setSelectedMuscle(result.muscle_group);
      setSelectedExerciseId(result.id);
      setIsCustom(true);
      setSets(3);
      setReps(10);
      setWeight(0);
    }
  }

  function handleClose() {
    setView('log');
    setSelectedMuscle(initialMuscle ?? null);
    setSelectedExerciseId(null);
    setIsCustom(false);
    setSets(3);
    setReps(12);
    setWeight(0);
    setDuration(20);
    setEarnedXP(null);
    setCustomName('');
    setCustomXP(20);
    setCustomMuscle('chest');
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20">
              {view === 'create-custom' ? (
                <Sparkles className="h-5 w-5 text-cyan-400" />
              ) : (
                <Dumbbell className="h-5 w-5 text-cyan-400" />
              )}
            </div>
            <h2 className="text-lg font-bold text-white">
              {view === 'create-custom' ? 'Create Custom Exercise' : 'Log Workout'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {earnedXP !== null ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 animate-pulse">
              <Zap className="h-12 w-12 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">+{earnedXP} XP</p>
            <p className="text-sm text-slate-400">Great work! Keep the streak alive.</p>
          </div>
        ) : view === 'create-custom' ? (
          /* Custom exercise creation form */
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Exercise Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Kettlebell Swings"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Target Muscle Group
              </label>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg.id}
                    onClick={() => setCustomMuscle(mg.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      customMuscle === mg.id
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {mg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                XP per Set / Completion
              </label>
              <NumberStepper value={customXP} onChange={setCustomXP} step={5} min={5} max={200} />
              <p className="mt-2 text-xs text-slate-500">
                Total XP = this value × number of sets logged
              </p>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                <Zap className="h-4 w-4" />
                Preview: 3 sets = +{customXP * 3} XP
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setView('log')}
                className="rounded-xl bg-slate-800 px-5 py-3.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-700"
              >
                Back
              </button>
              <button
                onClick={handleCreateCustom}
                disabled={!customName.trim() || creating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-40 enabled:hover:brightness-110"
              >
                {creating ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Save Exercise
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Step 1: Muscle group */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Target Muscle
              </p>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg.id}
                    onClick={() => selectMuscle(mg.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      selectedMuscle === mg.id
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {mg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Exercise */}
            {selectedMuscle && (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. Exercise
                  </p>
                  <button
                    onClick={() => setView('create-custom')}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Create Custom
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => selectExercise(ex.id)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                        selectedExerciseId === ex.id && !isCustom
                          ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-300'
                          : 'border border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{ex.name}</span>
                      {ex.category === 'cardio' && (
                        <Flame className="h-4 w-4 text-orange-400" />
                      )}
                    </button>
                  ))}
                  {filteredCustomExercises.length > 0 && (
                    <div className="mt-1 border-t border-slate-800 pt-2">
                      <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Custom Exercises
                      </p>
                      {filteredCustomExercises.map((ex) => (
                        <button
                          key={ex.id}
                          onClick={() => selectExercise(ex.id)}
                          className={`mb-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                            selectedExerciseId === ex.id && isCustom
                              ? 'border border-cyan-500 bg-cyan-500/20 text-cyan-300'
                              : 'border border-transparent bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-400/60" />
                            {ex.name}
                          </span>
                          <span className="text-xs text-slate-500">{ex.xp_per_set}/set</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {selectedExercise && (
              <div className="mb-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Details
                </p>

                {isCardio ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                      Duration (min)
                    </label>
                    <NumberStepper
                      value={duration}
                      onChange={setDuration}
                      step={5}
                      min={5}
                      max={180}
                      suffix="min"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1.5 block text-center text-sm font-semibold text-slate-300">
                        Sets
                      </label>
                      <NumberStepper value={sets} onChange={setSets} step={1} min={1} max={20} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-center text-sm font-semibold text-slate-300">
                        Reps
                      </label>
                      <NumberStepper value={reps} onChange={setReps} step={1} min={1} max={100} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-center text-sm font-semibold text-slate-300">
                        lbs
                      </label>
                      <NumberStepper value={weight} onChange={setWeight} step={5} min={0} max={1000} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* XP preview */}
            {selectedExercise && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
                  <Zap className="h-4 w-4" />
                  XP Earned
                </span>
                <span className="text-lg font-extrabold text-cyan-400">+{previewXP}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {earnedXP === null && view === 'log' && (
          <div className="border-t border-slate-800 px-5 py-4">
            <button
              onClick={handleLog}
              disabled={!selectedExercise || logging}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3.5 text-base font-bold text-white shadow-lg shadow-cyan-500/30 transition-all disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:brightness-110 enabled:active:scale-[0.98]"
            >
              {logging ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Complete Workout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  step,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex w-10 items-center justify-center text-lg font-bold text-slate-400 hover:bg-slate-700 hover:text-white active:bg-slate-600"
      >
        −
      </button>
      <div className="flex flex-1 items-center justify-center px-2 text-center text-base font-bold text-white">
        {value}
        {suffix && <span className="ml-0.5 text-xs text-slate-500">{suffix}</span>}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex w-10 items-center justify-center text-lg font-bold text-slate-400 hover:bg-slate-700 hover:text-white active:bg-slate-600"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
