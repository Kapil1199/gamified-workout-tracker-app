import { X, Zap, Trophy, Target, TrendingUp, Dumbbell, CheckCircle2, Award } from 'lucide-react';
import { getRankTitle, getLevelInfo, RANK_TITLES } from '@/lib/xp';
import type { Goal } from '@/lib/types';
import { LevelBadge, XPProgressBar } from '@/components/LevelBadge';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  totalXP: number;
  workoutXP: number;
  goalXP: number;
  totalWorkouts: number;
  totalSets: number;
  completedGoals: Goal[];
}

export function ProfileModal({
  open,
  onClose,
  totalXP,
  workoutXP,
  goalXP,
  totalWorkouts,
  totalSets,
  completedGoals,
}: ProfileModalProps) {
  if (!open) return null;

  const info = getLevelInfo(totalXP);
  const rank = getRankTitle(info.level);

  const nextRank = RANK_TITLES.find((r) => r.minLevel > info.level);
  const prevRankLevel = RANK_TITLES.filter((r) => r.minLevel <= info.level).pop()?.minLevel ?? 1;
  const nextRankLevel = nextRank?.minLevel ?? info.level;
  const levelsInRank = nextRankLevel - prevRankLevel;
  const progressInRank = levelsInRank > 0 ? ((info.level - prevRankLevel) / levelsInRank) * 100 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Level badge + rank */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <LevelBadge totalXP={totalXP} size="lg" />
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                Level {info.level}
              </p>
              <h1 className="text-3xl font-extrabold text-white">{rank}</h1>
              <p className="text-sm text-slate-400">{totalXP.toLocaleString()} Lifetime XP</p>
            </div>
            <div className="w-full max-w-xs">
              <XPProgressBar totalXP={totalXP} />
            </div>
          </div>

          {/* Rank progression */}
          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Award className="h-4 w-4 text-cyan-400" />
                Rank Progress
              </span>
              {nextRank && (
                <span className="text-xs text-slate-400">
                  {nextRank.title} at Lv {nextRank.minLevel}
                </span>
              )}
            </div>
            <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700"
                style={{ width: `${Math.min(progressInRank, 100)}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {RANK_TITLES.map((r) => (
                <span
                  key={r.minLevel}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                    info.level >= r.minLevel
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  {r.title} · Lv{r.minLevel}
                </span>
              ))}
            </div>
          </div>

          {/* Lifetime stats grid */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <StatBox
              icon={<TrendingUp className="h-4 w-4" />}
              label="Workout XP"
              value={workoutXP.toLocaleString()}
              color="text-cyan-400"
            />
            <StatBox
              icon={<Trophy className="h-4 w-4" />}
              label="Goal XP"
              value={goalXP.toLocaleString()}
              color="text-amber-400"
            />
            <StatBox
              icon={<Dumbbell className="h-4 w-4" />}
              label="Workouts"
              value={String(totalWorkouts)}
              color="text-blue-400"
            />
            <StatBox
              icon={<Zap className="h-4 w-4" />}
              label="Total Sets"
              value={totalSets.toLocaleString()}
              color="text-emerald-400"
            />
          </div>

          {/* Completed goals */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Completed Goals
              <span className="text-slate-500">({completedGoals.length})</span>
            </h3>
            {completedGoals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 py-8 text-center">
                <Target className="mx-auto mb-2 h-7 w-7 text-slate-600" />
                <p className="text-sm text-slate-500">No goals completed yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {completedGoals.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                      <Trophy className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{g.title}</p>
                      <p className="text-xs text-slate-400">
                        +{g.xp_reward} XP
                        {g.completed_at && (
                          <> · {new Date(g.completed_at).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3.5">
      <div className={`mb-1.5 flex items-center gap-1.5 text-xs font-semibold ${color}`}>
        {icon}
        {label}
      </div>
      <p className="text-xl font-extrabold text-white">{value}</p>
    </div>
  );
}
