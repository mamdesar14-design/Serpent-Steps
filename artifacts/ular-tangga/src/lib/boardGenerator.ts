export type LadderReward = {
  type: "points" | "snake" | "bonus_roll";
  value: number;
  description: string;
};

export type GeneratedLadder = number | { to: number; reward: LadderReward };
export type GeneratedSnakes = Record<number, number>;
export type GeneratedLadders = Record<number, GeneratedLadder>;

export type GeneratedBoard = {
  snakes: GeneratedSnakes;
  ladders: GeneratedLadders;
};

const REWARDS_L2: LadderReward[] = [
  { type: "points",     value: 10, description: "+10 bonus points!" },
  { type: "bonus_roll", value: 1,  description: "Bonus roll!" },
  { type: "points",     value: 20, description: "+20 bonus points!" },
  { type: "snake",      value: -2, description: "Surprise snake! Slide back!" },
  { type: "points",     value: 15, description: "+15 bonus points!" },
  { type: "bonus_roll", value: 1,  description: "Extra roll!" },
  { type: "points",     value: 25, description: "+25 bonus points!" },
  { type: "snake",      value: -3, description: "Hidden trap! Slide back!" },
  { type: "bonus_roll", value: 2,  description: "2 bonus rolls!" },
  { type: "points",     value: 30, description: "+30 bonus points!" },
];

const REWARDS_L3: LadderReward[] = [
  { type: "points",     value: 5,  description: "+5 points — small mercy!" },
  { type: "snake",      value: -5, description: "Trap ladder! Fall back!" },
  { type: "bonus_roll", value: 1,  description: "Bonus roll earned!" },
  { type: "snake",      value: -8, description: "Trapdoor! Drop down!" },
  { type: "points",     value: 15, description: "+15 points!" },
  { type: "snake",      value: -4, description: "Fake ladder! Watch out!" },
  { type: "bonus_roll", value: 1,  description: "Lucky roll!" },
  { type: "snake",      value: -6, description: "Hidden snake! Slide back!" },
  { type: "points",     value: 10, description: "+10 points!" },
  { type: "snake",      value: -3, description: "Trap! Fall back!" },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colOf(pos: number): number {
  const idx = pos - 1;
  const row = Math.floor(idx / 10);
  const col = idx % 10;
  return row % 2 === 0 ? col : 9 - col;
}

function rowOf(pos: number): number {
  return Math.floor((pos - 1) / 10);
}

export function generateRandomBoard(level: number): GeneratedBoard {
  const snakes: GeneratedSnakes = {};
  const ladders: GeneratedLadders = {};
  const forbidden = new Set<number>([1, 100]);
  const rowUse: Record<number, number> = {};

  const cfg =
    level === 3 ? { numSnakes: 12, numLadders: 8 } :
    level === 2 ? { numSnakes: 10, numLadders: 8 } :
                  { numSnakes: 8,  numLadders: 7 };

  // Varied lengths like classic boards: mix of short and long
  const pickLen = (): { min: number; max: number } =>
    Math.random() < 0.45 ? { min: 8, max: 16 } : { min: 18, max: 42 };

  // Snakes: distributed heads, mostly-vertical bodies, varied length
  let placed = 0;
  let tries  = 0;
  while (placed < cfg.numSnakes && tries < 5000) {
    tries++;
    const len = pickLen();
    const head = randInt(25, 99);
    if (forbidden.has(head)) continue;
    const hRow = rowOf(head);
    if ((rowUse[hRow] ?? 0) >= 2) continue;
    const minTail = Math.max(2, head - len.max);
    const maxTail = head - len.min;
    if (maxTail < minTail) continue;
    const tail = randInt(minTail, maxTail);
    if (forbidden.has(tail)) continue;
    if (Math.abs(colOf(head) - colOf(tail)) > 3) continue;
    snakes[head] = tail;
    forbidden.add(head);
    forbidden.add(tail);
    rowUse[hRow] = (rowUse[hRow] ?? 0) + 1;
    placed++;
  }

  // Ladders: same tidy constraints, varied lengths
  placed = 0;
  tries  = 0;
  const lRowUse: Record<number, number> = {};
  const rewardPool = level === 3 ? REWARDS_L3 : REWARDS_L2;
  let rewardIdx = 0;
  while (placed < cfg.numLadders && tries < 5000) {
    tries++;
    const len = pickLen();
    const bottom = randInt(2, 88);
    if (forbidden.has(bottom)) continue;
    const bRow = rowOf(bottom);
    if ((lRowUse[bRow] ?? 0) >= 2) continue;
    const minTop = bottom + len.min;
    const maxTop = Math.min(98, bottom + len.max);
    if (minTop > maxTop) continue;
    const top = randInt(minTop, maxTop);
    if (forbidden.has(top)) continue;
    if (Math.abs(colOf(bottom) - colOf(top)) > 3) continue;

    if (level === 1) {
      ladders[bottom] = top;
    } else {
      const reward = rewardPool[rewardIdx % rewardPool.length];
      rewardIdx++;
      ladders[bottom] = { to: top, reward };
    }
    forbidden.add(bottom);
    forbidden.add(top);
    lRowUse[bRow] = (lRowUse[bRow] ?? 0) + 1;
    placed++;
  }

  return { snakes, ladders };
}
