export type Badge = {
  id: string;
  emoji: string;
  name: string;
  description: string;
};

export const ALL_BADGES: Badge[] = [
  { id: "first_win",       emoji: "🏆", name: "First Victory",    description: "Win your first game" },
  { id: "streak_master",   emoji: "🔥", name: "Streak Master",    description: "Achieve a 7× answer streak" },
  { id: "snake_dodger",    emoji: "🐍", name: "Snake Dodger",     description: "Win without hitting any snake" },
  { id: "perfect_solo",    emoji: "✅", name: "Perfect Run",      description: "Win solo with 100% accuracy" },
  { id: "level3_master",   emoji: "⚡", name: "Level 3 Master",  description: "Win a Level 3 matching game" },
  { id: "comeback",        emoji: "💪", name: "Comeback Kid",     description: "Win from square ≤ 20 while trailing" },
  { id: "speedster",       emoji: "⚡", name: "Speedster",        description: "Answer 5 questions before rolling" },
];

const STORAGE_KEY = "ular_tangga_badges";

export function getUnlockedBadges(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function unlockBadge(id: string): boolean {
  const current = getUnlockedBadges();
  if (current.has(id)) return false;
  current.add(id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
  } catch { /* ignore */ }
  return true;
}

export function checkAndUnlock(conditions: {
  won: boolean;
  level: number;
  streak: number;
  snakesHit: number;
  accuracy: number;
  finalPosition?: number;
  wasTrailing?: boolean;
}): Badge[] {
  const newBadges: Badge[] = [];
  const { won, level, streak, snakesHit, accuracy } = conditions;

  if (won && unlockBadge("first_win"))       newBadges.push(ALL_BADGES.find(b => b.id === "first_win")!);
  if (streak >= 7 && unlockBadge("streak_master")) newBadges.push(ALL_BADGES.find(b => b.id === "streak_master")!);
  if (won && snakesHit === 0 && unlockBadge("snake_dodger")) newBadges.push(ALL_BADGES.find(b => b.id === "snake_dodger")!);
  if (won && accuracy === 100 && unlockBadge("perfect_solo")) newBadges.push(ALL_BADGES.find(b => b.id === "perfect_solo")!);
  if (won && level === 3 && unlockBadge("level3_master")) newBadges.push(ALL_BADGES.find(b => b.id === "level3_master")!);

  return newBadges;
}
