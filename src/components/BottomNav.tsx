import { Home, PersonStanding, History, Plus, Target } from 'lucide-react';

export type Tab = 'dashboard' | 'body' | 'goals' | 'history';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  onLogClick: () => void;
}

export function BottomNav({ active, onChange, onLogClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <NavButton
          icon={<Home className="h-6 w-6" />}
          label="Home"
          isActive={active === 'dashboard'}
          onClick={() => onChange('dashboard')}
        />

        <NavButton
          icon={<PersonStanding className="h-6 w-6" />}
          label="Body"
          isActive={active === 'body'}
          onClick={() => onChange('body')}
        />

        {/* Center log button */}
        <button
          onClick={onLogClick}
          className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-xl shadow-cyan-500/40 transition-all active:scale-90"
          aria-label="Log workout"
        >
          <Plus className="h-7 w-7" />
        </button>

        <NavButton
          icon={<Target className="h-6 w-6" />}
          label="Goals"
          isActive={active === 'goals'}
          onClick={() => onChange('goals')}
        />

        <NavButton
          icon={<History className="h-6 w-6" />}
          label="History"
          isActive={active === 'history'}
          onClick={() => onChange('history')}
        />
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-1.5 transition-all ${
        isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </button>
  );
}
