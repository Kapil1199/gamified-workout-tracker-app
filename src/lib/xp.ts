export interface LevelInfo {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpIntoLevel: number;
  xpToNext: number;
  progress: number;
}

const XP_PER_LEVEL = 1000;

export function xpToLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function levelToXP(level: number): number {
  return (level - 1) * XP_PER_LEVEL;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  const level = xpToLevel(totalXP);
  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);
  const xpIntoLevel = totalXP - currentLevelXP;
  const xpToNext = nextLevelXP - totalXP;
  const levelSpan = nextLevelXP - currentLevelXP;
  const progress = levelSpan > 0 ? (xpIntoLevel / levelSpan) * 100 : 0;

  return {
    level,
    totalXP,
    currentLevelXP,
    nextLevelXP,
    xpIntoLevel,
    xpToNext,
    progress: Math.min(progress, 100),
  };
}

export const RANK_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Rookie' },
  { minLevel: 10, title: 'Associate' },
  { minLevel: 30, title: 'Professional' },
  { minLevel: 60, title: 'Veteran' },
  { minLevel: 90, title: 'Expert' },
];

export function getRankTitle(level: number): string {
  let title = RANK_TITLES[0].title;
  for (const rank of RANK_TITLES) {
    if (level >= rank.minLevel) title = rank.title;
  }
  return title;
}
