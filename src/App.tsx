import { useState } from 'react';
import { Flame, Dumbbell, Target, TrendingUp, Zap, ChevronRight, Trophy } from 'lucide-react';
import { useWorkouts, useMuscleActivity } from '@/hooks/useWorkouts';
import { useStats } from '@/hooks/useStats';
import { useCustomExercises } from '@/hooks/useCustomExercises';
import { useGoals } from '@/hooks/useGoals';
import { BodyMap } from '@/components/BodyMap';
import { LevelBadge, XPProgressBar, getRankTitle } from '@/components/LevelBadge';
import { LogWorkoutModal } from '@/components/LogWorkoutModal';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { BottomNav, type Tab } from '@/components/BottomNav';
import { ProfileModal } from '@/components/ProfileModal';
import { GoalsView } from '@/components/GoalsView';
import { MUSCLE_LABELS } from '@/lib/exercises';
import type { MuscleGroup, NewWorkout, Workout, CustomExercise } from '@/lib/types';

function App() {
  const { workouts, loading, addWorkout, deleteWorkout } = useWorkouts();
  const { customExercises, addCustomExercise } = useCustomExercises();
  const { goals, loading: goalsLoading, addGoal, updateGoalStatus, deleteGoal } = useGoals();
  const stats = useStats(workouts, goals);
  const activity = useMuscleActivity(workouts);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | null>(null);
  const [goalXPFlash, setGoalXPFlash] = useState<number | null>(null);

  function handleMuscleClick(group: MuscleGroup) {
    setFilterMuscle(group);
    setModalOpen(true);
  }

  function handleLogClick() {
    setFilterMuscle(null);
    setModalOpen(true);
  }

  async function handleLog(entry: NewWorkout) {
    const result = await addWorkout(entry);
    if (result) {
      return { xp: result.xp };
    }
    return null;
  }

  async function handleCreateCustom(name: string, xpPerSet: number, muscleGroup: MuscleGroup) {
    return addCustomExercise({ name, xp_per_set: xpPerSet, muscle_group: muscleGroup });
  }

  async function handleAddGoal(title: string) {
    return addGoal({ title, xp_reward: 500 });
  }

  function handleGoalCompleted(xp: number) {
    setGoalXPFlash(xp);
    setTimeout(() => setGoalXPFlash(null), 2000);
  }

  const recentWorkouts = workouts.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-white">
      {/* Goal XP flash banner */}
      {goalXPFlash !== null && (
        <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 animate-in rounded-2xl border border-amber-500/40 bg-amber-500/20 px-6 py-3 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-amber-400" />
            <div>
              <p className="text-lg font-extrabold text-amber-300">+{goalXPFlash} XP</p>
              <p className="text-xs text-amber-200/70">Goal completed!</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            recentWorkouts={recentWorkouts}
            activity={activity}
            loading={loading}
            onLogClick={handleLogClick}
            onSeeAll={() => setActiveTab('history')}
            onViewBody={() => setActiveTab('body')}
            onProfileClick={() => setProfileOpen(true)}
            onGoalsClick={() => setActiveTab('goals')}
          />
        )}

        {activeTab === 'body' && (
          <BodyView activity={activity} onMuscleClick={handleMuscleClick} />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            loading={goalsLoading}
            onAddGoal={handleAddGoal}
            onToggleStatus={updateGoalStatus}
            onDelete={deleteGoal}
            onGoalCompleted={handleGoalCompleted}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            workouts={workouts}
            loading={loading}
            onDelete={deleteWorkout}
          />
        )}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} onLogClick={handleLogClick} />

      <LogWorkoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onLog={handleLog}
        initialMuscle={filterMuscle}
        customExercises={customExercises}
        onCreateCustomExercise={handleCreateCustom}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        totalXP={stats.totalXP}
        workoutXP={stats.workoutXP}
        goalXP={stats.goalXP}
        totalWorkouts={stats.totalWorkouts}
        totalSets={stats.totalSets}
        completedGoals={goals.filter((g) => g.status === 'completed')}
      />
    </div>
  );
}

interface DashboardViewProps {
  stats: ReturnType<typeof useStats>;
  recentWorkouts: Workout[];
  activity: Partial<Record<MuscleGroup, number>>;
  loading: boolean;
  onLogClick: () => void;
  onSeeAll: () => void;
  onViewBody: () => void;
  onProfileClick: () => void;
  onGoalsClick: () => void;
}

function DashboardView({
  stats,
  recentWorkouts,
  activity,
  loading,
  onLogClick,
  onSeeAll,
  onViewBody,
  onProfileClick,
  onGoalsClick,
}: DashboardViewProps) {
  const rank = getRankTitle(stats.levelInfo.level);

  return (
    <div className="px-5 pt-12">
      {/* Header / Hero card — clickable */}
      <button
        onClick={onProfileClick}
        className="mb-6 block w-full overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-left shadow-2xl transition-all hover:border-slate-700 active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <LevelBadge totalXP={stats.totalXP} size="lg" />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Level {stats.levelInfo.level}
            </p>
            <h1 className="text-2xl font-extrabold text-white">{rank}</h1>
            <p className="text-sm text-slate-400">{stats.totalXP.toLocaleString()} Total XP</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </div>

        <div className="mt-5">
          <XPProgressBar totalXP={stats.totalXP} />
        </div>
        <p className="mt-2 text-right text-xs text-slate-600">Tap to view profile</p>
      </button>

      {/* Quick log button */}
      <button
        onClick={onLogClick}
        className="mb-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <Dumbbell className="h-5 w-5" />
        Log New Workout
      </button>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Today"
          value={String(stats.todayCount)}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="This Week"
          value={String(stats.weekCount)}
          color="cyan"
        />
        <StatCard
          icon={<Dumbbell className="h-5 w-5" />}
          label="Total Sets"
          value={stats.totalSets.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Muscles Hit"
          value={`${stats.uniqueMuscles}/14`}
          color="green"
        />
      </div>

      {/* Goals quick access */}
      <div className="mb-6">
        <button
          onClick={onGoalsClick}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Goals</p>
              <p className="text-xs text-slate-400">
                {stats.activeGoals} active · {stats.completedGoals} completed
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Body preview */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Muscle Map</h2>
          <button
            onClick={onViewBody}
            className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Full View
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <BodyMap activity={activity} onMuscleClick={onViewBody} />
      </div>

      {/* Recent workouts */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          {recentWorkouts.length > 0 && (
            <button
              onClick={onSeeAll}
              className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              See All
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
          </div>
        ) : recentWorkouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 py-10 text-center">
            <Flame className="mx-auto mb-2 h-8 w-8 text-slate-600" />
            <p className="text-sm text-slate-500">No workouts yet — start training!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
                  <Zap className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{w.exercise_name}</p>
                  <p className="text-xs text-slate-400">
                    {MUSCLE_LABELS[w.muscle_group as MuscleGroup]} · +{w.xp} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const COLOR_MAP = {
  orange: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  green: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
} as const;

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: keyof typeof COLOR_MAP;
}) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function BodyView({
  activity,
  onMuscleClick,
}: {
  activity: Partial<Record<MuscleGroup, number>>;
  onMuscleClick: (group: MuscleGroup) => void;
}) {
  const trainedCount = Object.values(activity).filter((v) => v && v > 0).length;

  return (
    <div className="px-5 pt-12">
      <h1 className="mb-1 text-2xl font-extrabold text-white">Muscle Body Map</h1>
      <p className="mb-6 text-sm text-slate-400">
        Tap a muscle to log a workout for that group. {trainedCount} of 14 muscles trained.
      </p>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5">
        <BodyMap activity={activity} onMuscleClick={onMuscleClick} />
      </div>

      {/* Muscle breakdown */}
      <div className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-white">Muscle Breakdown</h2>
        <div className="flex flex-col gap-2">
          {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((mg) => {
            const count = activity[mg] ?? 0;
            const maxCount = Math.max(...Object.values(activity).map((v) => v ?? 0), 1);
            const pct = count > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div
                key={mg}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5"
              >
                <span className="w-24 shrink-0 text-sm font-semibold text-slate-300">
                  {MUSCLE_LABELS[mg]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      count > 0 ? 'bg-gradient-to-r from-cyan-500 to-sky-400' : ''
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-bold text-slate-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HistoryView({
  workouts,
  loading,
  onDelete,
}: {
  workouts: import('@/lib/types').Workout[];
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="px-5 pt-12">
      <h1 className="mb-1 text-2xl font-extrabold text-white">Workout History</h1>
      <p className="mb-6 text-sm text-slate-400">
        {workouts.length} workout{workouts.length !== 1 ? 's' : ''} logged
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        </div>
      ) : (
        <WorkoutHistory workouts={workouts} onDelete={onDelete} />
      )}
    </div>
  );
}

export default App;
