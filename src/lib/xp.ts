export interface LevelInfo {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpIntoLevel: number;
  xpToNext: number;
  progress: number;
}

export function xpToLevel(totalXP: number): number {
  return Math.floor((1 + Math.sqrt(1 + (8 * totalXP) / 100)) / 2);
}

export function levelToXP(level: number): number {
  return (level * (level - 1) * 100) / 2;
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
  { minLevel: 25, title: 'Professional' },
  { minLevel: 50, title: 'Veteran' },
  { minLevel: 75, title: 'Expert' },
];

export function getRankTitle(level: number): string {
  let title = RANK_TITLES[0].title;
  for (const rank of RANK_TITLES) {
    if (level >= rank.minLevel) title = rank.title;
  }
  return title;
}
