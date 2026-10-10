import { useState } from 'react';
import type { MuscleGroup } from '@/lib/types';
import { MUSCLE_LABELS } from '@/lib/exercises';

interface BodyMapProps {
  activity: Partial<Record<MuscleGroup, number>>;
  onMuscleClick?: (group: MuscleGroup) => void;
}

interface MusclePart {
  group: MuscleGroup;
  paths: { d: string; className: string }[];
}

const BASE = '#1e293b';
const INACTIVE = '#334155';

function intensityColor(count: number): string {
  if (count <= 0) return INACTIVE;
  if (count >= 9) return '#22d3ee';
  if (count >= 4) return '#0284c7';
  return '#075985';
}

const FRONT_MUSCLES: MusclePart[] = [
  {
    group: 'shoulders',
    paths: [
      { d: 'M 73 88 C 64 86 54 88 48 94 L 53 108 C 60 104 68 102 78 103 Z', className: '' },
      { d: 'M 127 88 C 136 86 146 88 152 94 L 147 108 C 140 104 132 102 122 103 Z', className: '' },
    ],
  },
  {
    group: 'chest',
    paths: [
      { d: 'M 78 106 C 75 106 72 108 71 112 L 73 128 C 80 126 87 125 95 126 L 95 112 C 89 109 83 107 78 106 Z', className: '' },
      { d: 'M 122 106 C 125 106 128 108 129 112 L 127 128 C 120 126 113 125 105 126 L 105 112 C 111 109 117 107 122 106 Z', className: '' },
    ],
  },
  {
    group: 'biceps',
    paths: [
      { d: 'M 46 114 C 42 118 40 124 40 132 C 44 133 48 131 51 127 L 53 116 Z', className: '' },
      { d: 'M 154 114 C 158 118 160 124 160 132 C 156 133 152 131 149 127 L 147 116 Z', className: '' },
    ],
  },
  {
    group: 'forearms',
    paths: [
      { d: 'M 40 134 C 37 140 36 148 36 156 C 38 158 42 158 44 155 L 46 136 Z', className: '' },
      { d: 'M 160 134 C 163 140 164 148 164 156 C 162 158 158 158 156 155 L 154 136 Z', className: '' },
    ],
  },
  {
    group: 'abs',
    paths: [
      { d: 'M 90 134 L 90 160 C 94 162 98 163 100 163 C 102 163 106 162 110 160 L 110 134 Z', className: '' },
    ],
  },
  {
    group: 'obliques',
    paths: [
      { d: 'M 73 132 C 75 138 76 144 76 150 L 71 150 C 70 144 69 138 70 132 Z', className: '' },
      { d: 'M 127 132 C 125 138 124 144 124 150 L 129 150 C 130 144 131 138 130 132 Z', className: '' },
    ],
  },
  {
    group: 'quads',
    paths: [
      { d: 'M 83 168 C 80 174 78 182 77 192 L 82 210 C 86 208 90 206 93 204 L 93 172 C 90 170 87 169 83 168 Z', className: '' },
      { d: 'M 117 168 C 120 174 122 182 123 192 L 118 210 C 114 208 110 206 107 204 L 107 172 C 110 170 113 169 117 168 Z', className: '' },
    ],
  },
  {
    group: 'calves',
    paths: [
      { d: 'M 82 220 C 79 226 78 234 78 242 L 84 248 C 87 246 89 242 89 238 L 87 222 Z', className: '' },
      { d: 'M 118 220 C 121 226 122 234 122 242 L 116 248 C 113 246 111 242 111 238 L 113 222 Z', className: '' },
    ],
  },
];

const BACK_MUSCLES: MusclePart[] = [
  {
    group: 'traps',
    paths: [
      { d: 'M 75 88 C 80 85 90 84 100 84 C 110 84 120 85 125 88 L 120 100 C 115 98 108 97 100 97 C 92 97 85 98 80 100 Z', className: '' },
    ],
  },
  {
    group: 'shoulders',
    paths: [
      { d: 'M 73 88 C 64 86 54 88 48 94 L 53 108 C 60 104 68 102 78 103 Z', className: '' },
      { d: 'M 127 88 C 136 86 146 88 152 94 L 147 108 C 140 104 132 102 122 103 Z', className: '' },
    ],
  },
  {
    group: 'triceps',
    paths: [
      { d: 'M 46 114 C 42 118 40 124 40 132 C 44 133 48 131 51 127 L 53 116 Z', className: '' },
      { d: 'M 154 114 C 158 118 160 124 160 132 C 156 133 152 131 149 127 L 147 116 Z', className: '' },
    ],
  },
  {
    group: 'lats',
    paths: [
      { d: 'M 72 104 C 70 110 69 118 70 126 L 78 130 C 84 126 88 122 90 118 L 88 104 Z', className: '' },
      { d: 'M 128 104 C 130 110 131 118 130 126 L 122 130 C 116 126 112 122 110 118 L 112 104 Z', className: '' },
    ],
  },
  {
    group: 'lower_back',
    paths: [
      { d: 'M 78 132 C 82 134 90 135 100 135 C 110 135 118 134 122 132 L 120 146 C 114 148 107 149 100 149 C 93 149 86 148 80 146 Z', className: '' },
    ],
  },
  {
    group: 'forearms',
    paths: [
      { d: 'M 40 134 C 37 140 36 148 36 156 C 38 158 42 158 44 155 L 46 136 Z', className: '' },
      { d: 'M 160 134 C 163 140 164 148 164 156 C 162 158 158 158 156 155 L 154 136 Z', className: '' },
    ],
  },
  {
    group: 'glutes',
    paths: [
      { d: 'M 76 152 C 74 160 74 170 76 178 C 82 180 88 179 92 176 L 92 158 C 88 155 82 153 76 152 Z', className: '' },
      { d: 'M 124 152 C 126 160 126 170 124 178 C 118 180 112 179 108 176 L 108 158 C 112 155 118 153 124 152 Z', className: '' },
    ],
  },
  {
    group: 'hamstrings',
    paths: [
      { d: 'M 83 182 C 80 188 78 196 77 206 L 82 218 C 86 216 90 214 93 212 L 93 184 C 90 183 87 182 83 182 Z', className: '' },
      { d: 'M 117 182 C 120 188 122 196 123 206 L 118 218 C 114 216 110 214 107 212 L 107 184 C 110 183 113 182 117 182 Z', className: '' },
    ],
  },
  {
    group: 'calves',
    paths: [
      { d: 'M 82 220 C 79 226 78 234 78 242 L 84 248 C 87 246 89 242 89 238 L 87 222 Z', className: '' },
      { d: 'M 118 220 C 121 226 122 234 122 242 L 116 248 C 113 246 111 242 111 238 L 113 222 Z', className: '' },
    ],
  },
];

function BodyOutline({ view }: { view: 'front' | 'back' }) {
  return (
    <g>
      {/* Head */}
      <ellipse
        cx="100"
        cy="46"
        rx="18"
        ry="22"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Neck */}
      <path d="M 92 66 L 88 82 L 112 82 L 108 66 Z" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      {/* Torso */}
      <path
        d="M 70 84 C 60 90 52 100 50 116 C 48 130 48 142 52 152 L 58 156 L 58 168 C 56 175 55 182 55 188 L 60 195 L 66 188 C 68 180 70 172 72 164 L 72 156 C 76 150 78 142 78 136 L 78 128 L 88 126 L 100 126 L 112 126 L 122 128 L 122 136 C 122 142 124 150 128 156 L 128 164 C 130 172 132 180 134 188 L 140 195 L 145 188 C 145 182 144 175 142 168 L 142 156 L 148 152 C 152 142 152 130 150 116 C 148 100 140 90 130 84 Z"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Hips */}
      <path d="M 72 160 L 72 170 L 82 172 L 82 166 Z" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      <path d="M 128 160 L 128 170 L 118 172 L 118 166 Z" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      {/* Legs */}
      <path
        d="M 82 168 C 78 180 76 195 76 210 C 76 222 77 235 78 250 L 84 252 L 86 238 L 88 222 C 88 210 90 198 93 188 L 93 174 Z"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      <path
        d="M 118 168 C 122 180 124 195 124 210 C 124 222 123 235 122 250 L 116 252 L 114 238 L 112 222 C 112 210 110 198 107 188 L 107 174 Z"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Feet */}
      <path d="M 76 250 L 72 258 L 74 262 L 88 262 L 88 252 Z" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      <path d="M 124 250 L 128 258 L 126 262 L 112 262 L 112 252 Z" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      {/* Arms */}
      <path
        d="M 50 110 C 44 116 40 126 38 138 C 36 148 36 158 38 162 C 42 164 46 163 48 158 L 52 144 L 54 128 L 54 116 Z"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      <path
        d="M 150 110 C 156 116 160 126 162 138 C 164 148 164 158 162 162 C 158 164 154 163 152 158 L 148 144 L 146 128 L 146 116 Z"
        fill={BASE}
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Hands */}
      <ellipse cx="40" cy="168" rx="6" ry="10" fill={BASE} stroke="#475569" strokeWidth="1.5" />
      <ellipse cx="160" cy="168" rx="6" ry="10" fill={BASE} stroke="#475569" strokeWidth="1.5" />

      {view === 'back' && (
        <text x="100" y="50" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="500">
          BACK
        </text>
      )}
    </g>
  );
}

export function BodyMap({ activity, onMuscleClick }: BodyMapProps) {
  const [hovered, setHovered] = useState<MuscleGroup | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');

  const muscles = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;

  return (
    <div className="flex flex-col items-center">
      {/* View toggle */}
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-800 p-1">
        <button
          onClick={() => setView('front')}
          className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition-all ${
            view === 'front'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          className={`rounded-lg px-5 py-1.5 text-sm font-semibold transition-all ${
            view === 'back'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Back
        </button>
      </div>

      {/* SVG Body */}
      <svg
        viewBox="0 0 200 280"
        className="h-[340px] w-auto max-w-full drop-shadow-2xl"
      >
        <BodyOutline view={view} />

        {muscles.map((part) => {
          const count = activity[part.group] ?? 0;
          const isHovered = hovered === part.group;
          const color = intensityColor(count);

          return (
            <g
              key={part.group}
              onMouseEnter={() => setHovered(part.group)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onMuscleClick?.(part.group)}
              style={{ cursor: 'pointer' }}
            >
              {part.paths.map((path, i) => (
                <path
                  key={i}
                  d={path.d}
                  fill={color}
                  stroke={isHovered ? '#22d3ee' : '#0f172a'}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={count > 0 ? 0.85 : 0.4}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'brightness(1.3)' : 'none',
                  }}
                />
              ))}
              {count > 0 && part.paths.length > 0 && (
                <text
                  x={part.paths[0].d.split('M ')[1]?.split(' ')[0] ?? '100'}
                  y={part.paths[0].d.split('M ')[1]?.split(' ')[1]?.replace('C', '') ?? '100'}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#f8fafc"
                  fontWeight="700"
                  pointerEvents="none"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: INACTIVE }} />
          Not trained
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: intensityColor(2) }} />
          Low (1-3)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: intensityColor(5) }} />
          Medium (4-8)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: intensityColor(9) }} />
          High (9+)
        </span>
      </div>

      {/* Hovered label */}
      {hovered && (
        <div className="mt-3 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300 transition-all">
          {MUSCLE_LABELS[hovered]} — {activity[hovered] ?? 0} workout{(activity[hovered] ?? 0) !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
