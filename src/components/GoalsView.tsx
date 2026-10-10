import { useState } from 'react';
import { Plus, X, Target, CheckCircle2, Circle, Trophy, Trash2, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import type { Goal } from '@/lib/types';

interface GoalsViewProps {
  goals: Goal[];
  loading: boolean;
  onAddGoal: (title: string) => Promise<Goal | null>;
  onToggleStatus: (id: string, status: 'in_progress' | 'completed') => Promise<Goal | null>;
  onDelete: (id: string) => Promise<boolean>;
  onGoalCompleted: (xp: number) => void;
}

export function GoalsView({
  goals,
  loading,
  onAddGoal,
  onToggleStatus,
  onDelete,
  onGoalCompleted,
}: GoalsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [expandedCompleted, setExpandedCompleted] = useState(false);
  const [rewardXP, setRewardXP] = useState<number | null>(null);

  const activeGoals = goals.filter((g) => g.status === 'in_progress');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  async function handleAdd() {
    if (!newTitle.trim()) return;
    setAdding(true);
    const result = await onAddGoal(newTitle.trim());
    setAdding(false);
    if (result) {
      setNewTitle('');
      setShowAdd(false);
    }
  }

  async function handleToggle(goal: Goal) {
    const newStatus = goal.status === 'in_progress' ? 'completed' : 'in_progress';
    const result = await onToggleStatus(goal.id, newStatus);
    if (result && newStatus === 'completed') {
      setRewardXP(result.xp_reward);
      onGoalCompleted(result.xp_reward);
      setTimeout(() => setRewardXP(null), 1800);
    }
  }

  return (
    <div className="px-5 pt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Goals</h1>
          <p className="text-sm text-slate-400">
            {activeGoals.length} active · {completedGoals.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition-all active:scale-90"
        >
          {showAdd ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* Add goal form */}
      {showAdd && (
        <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-300">Goal Description</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Complete 100 push-ups in one day"
            className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">+500 XP on completion</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim() || adding}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-40 enabled:hover:brightness-110"
          >
            {adding ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Goal
              </>
            )}
          </button>
        </div>
      )}

      {/* XP reward celebration */}
      {rewardXP !== null && (
        <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/15 py-5 animate-in">
          <Trophy className="h-8 w-8 text-amber-400" />
          <div>
            <p className="text-2xl font-extrabold text-amber-300">+{rewardXP} XP</p>
            <p className="text-xs text-amber-200/70">Goal completed!</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        </div>
      ) : (
        <>
          {/* Active goals */}
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                <Target className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-center text-sm text-slate-500">
                No goals yet.
                <br />
                Set a fitness target to earn bonus XP!
              </p>
            </div>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    In Progress
                  </h2>
                  <div className="flex flex-col gap-2.5">
                    {activeGoals.map((g) => (
                      <GoalCard
                        key={g.id}
                        goal={g}
                        onToggle={handleToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completedGoals.length > 0 && (
                <div>
                  <button
                    onClick={() => setExpandedCompleted(!expandedCompleted)}
                    className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    <span>Completed ({completedGoals.length})</span>
                    {expandedCompleted ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedCompleted && (
                    <div className="flex flex-col gap-2.5">
                      {completedGoals.map((g) => (
                        <GoalCard
                          key={g.id}
                          goal={g}
                          onToggle={handleToggle}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function GoalCard({
  goal,
  onToggle,
  onDelete,
}: {
  goal: Goal;
  onToggle: (goal: Goal) => void;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const isCompleted = goal.status === 'completed';

  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all ${
        isCompleted
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-slate-800 bg-slate-900/80'
      }`}
    >
      <button
        onClick={() => onToggle(goal)}
        className={`shrink-0 transition-all active:scale-90 ${
          isCompleted ? 'text-emerald-400' : 'text-slate-600 hover:text-cyan-400'
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold ${
            isCompleted ? 'text-slate-400 line-through' : 'text-white'
          }`}
        >
          {goal.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <Zap className="h-3 w-3" />
            {goal.xp_reward} XP
          </span>
          {isCompleted && goal.completed_at && (
            <span className="text-emerald-400/70">
              · {new Date(goal.completed_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(goal.id)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
