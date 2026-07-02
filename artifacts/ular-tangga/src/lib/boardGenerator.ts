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

export function generateRandomBoard(level: number): GeneratedBoard {
  const snakes: GeneratedSnakes = {};
  const ladders: GeneratedLadders = {};
  const forbidden = new Set<number>([1, 100]);

  const cfg =
    level === 3 ? { numSnakes: 15, numLadders: 10, minDrop: 5, minClimb: 7 } :
    level === 2 ? { numSnakes: 12, numLadders: 9,  minDrop: 6, minClimb: 8 } :
                  { numSnakes: 10, numLadders: 8,  minDrop: 8, minClimb: 10 };

  let placed = 0;
  let tries  = 0;
  while (placed < cfg.numSnakes && tries < 3000) {
    tries++;
    const head = randInt(15, 99);
    if (forbidden.has(head)) continue;
    const maxTail = head - cfg.minDrop;
    if (maxTail < 2) continue;
    const tail = randInt(2, maxTail);
    if (forbidden.has(tail)) continue;
    snakes[head] = tail;
    forbidden.add(head);
    forbidden.add(tail);
    placed++;
  }

  placed = 0;
  tries  = 0;
  const rewardPool = level === 3 ? REWARDS_L3 : REWARDS_L2;
  let rewardIdx = 0;
  while (placed < cfg.numLadders && tries < 3000) {
    tries++;
    const bottom = randInt(2, 88);
    if (forbidden.has(bottom)) continue;
    const maxTop = Math.min(98, bottom + 60);
    const minTop = bottom + cfg.minClimb;
    if (minTop > maxTop) continue;
    const top = randInt(minTop, maxTop);
    if (forbidden.has(top)) continue;

    if (level === 1) {
      ladders[bottom] = top;
    } else {
      const reward = rewardPool[rewardIdx % rewardPool.length];
      rewardIdx++;
      ladders[bottom] = { to: top, reward };
    }
    forbidden.add(bottom);
    forbidden.add(top);
    placed++;
  }

  return { snakes, ladders };
}
