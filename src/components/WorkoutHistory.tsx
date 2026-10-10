import { Trash2, Zap, Flame, Clock } from 'lucide-react';
import type { Workout } from '@/lib/types';
import { MUSCLE_LABELS } from '@/lib/exercises';

interface WorkoutHistoryProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const workoutDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (workoutDate.getTime() === today.getTime()) return 'Today';
  if (workoutDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export function WorkoutHistory({ workouts, onDelete }: WorkoutHistoryProps) {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
          <Flame className="h-8 w-8 text-slate-600" />
        </div>
        <p className="text-center text-sm text-slate-500">
          No workouts logged yet.
          <br />
          Start your journey by logging one!
        </p>
      </div>
    );
  }

  const grouped: { label: string; items: Workout[] }[] = [];
  for (const w of workouts) {
    const label = formatDateGroup(w.logged_at);
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(w);
    } else {
      grouped.push({ label, items: [w] });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {grouped.map((group) => (
        <div key={group.label}>
          <h3 className="mb-2.5 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {group.label}
          </h3>
          <div className="flex flex-col gap-2.5">
            {group.items.map((w) => (
              <div
                key={w.id}
                className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700"
              >
                {/* XP badge */}
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-500/15">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400">+{w.xp}</span>
                </div>

                {/* Exercise info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">{w.exercise_name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-semibold text-slate-300">
                      {MUSCLE_LABELS[w.muscle_group]}
                    </span>
                    {w.duration_min > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {w.duration_min} min
                      </span>
                    ) : (
                      <span>
                        {w.sets} × {w.reps}
                        {w.weight > 0 ? ` @ ${w.weight} lbs` : ''}
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    <span>{formatRelativeTime(w.logged_at)}</span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => onDelete(w.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
