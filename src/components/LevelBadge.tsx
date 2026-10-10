import { getLevelInfo, getRankTitle } from '@/lib/xp';

interface LevelBadgeProps {
  totalXP: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ totalXP, size = 'md' }: LevelBadgeProps) {
  const info = getLevelInfo(totalXP);
  const rank = getRankTitle(info.level);

  const sizeClasses = {
    sm: 'h-10 w-10 text-base',
    md: 'h-14 w-14 text-xl',
    lg: 'h-20 w-20 text-3xl',
  };

  const ringSize = {
    sm: 44,
    md: 58,
    lg: 82,
  };

  const circumference = 2 * Math.PI * (ringSize[size] / 2 - 4);
  const dashOffset = circumference - (info.progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: ringSize[size], height: ringSize[size] }}>
      <svg className="absolute inset-0 -rotate-90" width={ringSize[size]} height={ringSize[size]}>
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={ringSize[size] / 2 - 4}
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
        />
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={ringSize[size] / 2 - 4}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        className={`flex ${sizeClasses[size]} items-center justify-center rounded-full bg-slate-900 font-extrabold text-cyan-400 shadow-inner`}
      >
        {info.level}
      </div>
    </div>
  );
}

export function XPProgressBar({ totalXP }: { totalXP: number }) {
  const info = getLevelInfo(totalXP);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-cyan-400">{info.xpIntoLevel} XP</span>
        <span className="text-slate-500">{info.xpToNext} XP to Lv {info.level + 1}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700 ease-out"
          style={{ width: `${info.progress}%` }}
        />
      </div>
    </div>
  );
}

export { getRankTitle };
