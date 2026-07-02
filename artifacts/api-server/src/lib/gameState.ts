import { randomUUID } from "crypto";

export type GameStatus = "waiting" | "playing" | "finished";

export type LadderReward = {
  type: "points" | "snake" | "bonus_roll";
  value: number;
  description: string;
};

export type Player = {
  id: string;
  name: string;
  position: number;
  score: number;
  color: string;
  bonusRolls: number;
  isConnected: boolean;
  streak: number;
};

export type GameState = {
  roomCode: string;
  level: number;
  status: GameStatus;
  players: Player[];
  currentPlayerIndex: number;
  winnerId: string | null;
  hostId: string;
  questionIndex: number;
  awaitingAnswer: boolean;
  pendingDiceValue: number | null;
  lastEvent: string | null;
  createdAt: number;
  boardSnakes: Record<number, number>;
  boardLadders: Record<number, number | { to: number; reward: LadderReward }>;
};

const PLAYER_COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export const SNAKES_LEVEL1: Record<number, number> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

export const LADDERS_LEVEL1: Record<number, number> = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};

export const SNAKES_LEVEL2: Record<number, number> = {
  17: 7,
  24: 5,
  34: 16,
  46: 25,
  48: 10,
  55: 52,
  61: 18,
  64: 60,
  87: 24,
  92: 72,
  95: 75,
  99: 78,
  76: 43,
  82: 44,
};

export const SNAKES_LEVEL3: Record<number, number> = {
  8: 1,
  15: 3,
  22: 5,
  31: 9,
  37: 14,
  44: 18,
  50: 21,
  57: 28,
  62: 34,
  68: 42,
  74: 33,
  81: 47,
  86: 52,
  91: 58,
  96: 67,
  98: 62,
  99: 41,
};

export const LADDERS_LEVEL3: Record<number, { to: number; reward: LadderReward }> = {
  6: { to: 19, reward: { type: "points", value: 5, description: "+5 points — a small mercy!" } },
  26: { to: 38, reward: { type: "snake", value: -5, description: "Trap ladder! Fall back 5!" } },
  53: { to: 65, reward: { type: "bonus_roll", value: 1, description: "1 bonus roll earned!" } },
  72: { to: 85, reward: { type: "snake", value: -8, description: "Trapdoor! Drop 8 squares!" } },
  83: { to: 97, reward: { type: "points", value: 15, description: "+15 points! Almost there!" } },
};

export const LADDERS_LEVEL2: Record<number, { to: number; reward: LadderReward }> = {
  4: { to: 14, reward: { type: "points", value: 10, description: "+10 bonus points!" } },
  9: { to: 31, reward: { type: "bonus_roll", value: 1, description: "Bonus roll!" } },
  20: { to: 38, reward: { type: "points", value: 15, description: "+15 bonus points!" } },
  28: { to: 84, reward: { type: "bonus_roll", value: 1, description: "Extra roll!" } },
  36: { to: 57, reward: { type: "points", value: 20, description: "+20 bonus points!" } },
  40: { to: 59, reward: { type: "snake", value: -2, description: "Surprise snake! -2 squares!" } },
  51: { to: 67, reward: { type: "points", value: 25, description: "+25 bonus points!" } },
  63: { to: 81, reward: { type: "bonus_roll", value: 2, description: "2 bonus rolls!" } },
  71: { to: 91, reward: { type: "snake", value: -3, description: "Hidden trap! -3 squares!" } },
  77: { to: 98, reward: { type: "points", value: 30, description: "+30 bonus points!" } },
};

const games = new Map<string, GameState>();

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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

function ri(min: number, max: number): number {
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

function generateBoard(level: number): {
  boardSnakes: Record<number, number>;
  boardLadders: Record<number, number | { to: number; reward: LadderReward }>;
} {
  const boardSnakes: Record<number, number> = {};
  const boardLadders: Record<number, number | { to: number; reward: LadderReward }> = {};
  const forbidden = new Set<number>([1, 99, 100]);
  const rowUse: Record<number, number> = {};

  const cfg =
    level === 3 ? { numSnakes: 12, numLadders: 8 } :
    level === 2 ? { numSnakes: 10, numLadders: 8 } :
                  { numSnakes: 8,  numLadders: 7 };

  // Varied lengths like classic boards: mix of short and long
  const pickLen = (): { min: number; max: number } =>
    Math.random() < 0.45 ? { min: 8, max: 16 } : { min: 18, max: 42 };

  let placed = 0, tries = 0;
  while (placed < cfg.numSnakes && tries < 5000) {
    tries++;
    const len = pickLen();
    const head = ri(25, 99);
    if (forbidden.has(head)) continue;
    const hRow = rowOf(head);
    if ((rowUse[hRow] ?? 0) >= 2) continue;
    const minTail = Math.max(2, head - len.max);
    const maxTail = head - len.min;
    if (maxTail < minTail) continue;
    const tail = ri(minTail, maxTail);
    if (forbidden.has(tail)) continue;
    if (Math.abs(colOf(head) - colOf(tail)) > 3) continue;
    boardSnakes[head] = tail;
    forbidden.add(head);
    forbidden.add(tail);
    rowUse[hRow] = (rowUse[hRow] ?? 0) + 1;
    placed++;
  }

  placed = 0; tries = 0;
  const lRowUse: Record<number, number> = {};
  const pool = level === 3 ? REWARDS_L3 : REWARDS_L2;
  let rewardIdx = 0;
  while (placed < cfg.numLadders && tries < 5000) {
    tries++;
    const len = pickLen();
    const bottom = ri(2, 88);
    if (forbidden.has(bottom)) continue;
    const bRow = rowOf(bottom);
    if ((lRowUse[bRow] ?? 0) >= 2) continue;
    const minTop = bottom + len.min;
    const maxTop = Math.min(98, bottom + len.max);
    if (minTop > maxTop) continue;
    const top = ri(minTop, maxTop);
    if (forbidden.has(top)) continue;
    if (Math.abs(colOf(bottom) - colOf(top)) > 3) continue;
    if (level === 1) {
      boardLadders[bottom] = top;
    } else {
      const reward = pool[rewardIdx % pool.length];
      rewardIdx++;
      boardLadders[bottom] = { to: top, reward };
    }
    forbidden.add(bottom);
    forbidden.add(top);
    lRowUse[bRow] = (lRowUse[bRow] ?? 0) + 1;
    placed++;
  }

  return { boardSnakes, boardLadders };
}

export function createGame(hostName: string, level: number, color?: string): GameState {
  const roomCode = generateRoomCode();
  const hostId = randomUUID();

  const host: Player = {
    id: hostId,
    name: hostName,
    position: 0,
    score: 0,
    color: color || PLAYER_COLORS[0],
    bonusRolls: 0,
    isConnected: true,
    streak: 0,
  };

  const { boardSnakes, boardLadders } = generateBoard(level);
  const game: GameState = {
    roomCode,
    level,
    status: "waiting",
    players: [host],
    currentPlayerIndex: 0,
    winnerId: null,
    hostId,
    questionIndex: 0,
    awaitingAnswer: false,
    pendingDiceValue: null,
    lastEvent: null,
    createdAt: Date.now(),
    boardSnakes,
    boardLadders,
  };

  games.set(roomCode, game);

  setTimeout(() => {
    if (games.has(roomCode) && games.get(roomCode)!.status === "waiting") {
      games.delete(roomCode);
    }
  }, 30 * 60 * 1000);

  return game;
}

export function joinGame(
  roomCode: string,
  playerName: string,
  color?: string,
): { game: GameState; player: Player } | null {
  const game = games.get(roomCode);
  if (!game) return null;
  if (game.status !== "waiting") return null;
  if (game.players.length >= 5) return null;

  const player: Player = {
    id: randomUUID(),
    name: playerName,
    position: 0,
    score: 0,
    color: color || PLAYER_COLORS[game.players.length],
    bonusRolls: 0,
    isConnected: true,
    streak: 0,
  };

  game.players.push(player);
  return { game, player };
}

export function getGame(roomCode: string): GameState | undefined {
  return games.get(roomCode);
}

export function rematchGame(roomCode: string): GameState | null {
  const game = games.get(roomCode);
  if (!game) return null;
  game.status = "waiting";
  game.winnerId = null;
  game.currentPlayerIndex = 0;
  game.awaitingAnswer = false;
  game.pendingDiceValue = null;
  game.lastEvent = null;
  game.questionIndex = 0;
  for (const player of game.players) {
    player.position = 0;
    player.score = 0;
    player.bonusRolls = 0;
    player.streak = 0;
  }
  const { boardSnakes, boardLadders } = generateBoard(game.level);
  game.boardSnakes = boardSnakes;
  game.boardLadders = boardLadders;
  return game;
}

export function startGame(roomCode: string): GameState | null {
  const game = games.get(roomCode);
  if (!game) return null;
  if (game.players.length < 1) return null;
  game.status = "playing";
  return game;
}

export function movePlayer(
  roomCode: string,
  playerId: string,
  diceValue: number,
  answeredCorrectly: boolean,
): {
  game: GameState;
  moved: boolean;
  newPosition: number;
  event: string | null;
  reward: LadderReward | null;
  streakBonus: number;
} | null {
  const game = games.get(roomCode);
  if (!game || game.status !== "playing") return null;

  const playerIdx = game.players.findIndex((p) => p.id === playerId);
  if (playerIdx < 0) return null;

  const player = game.players[playerIdx];

  if (!answeredCorrectly) {
    player.streak = 0;
    game.awaitingAnswer = false;
    game.pendingDiceValue = null;
    game.lastEvent = `${player.name} answered incorrectly. Stay in place!`;
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    return { game, moved: false, newPosition: player.position, event: game.lastEvent, reward: null, streakBonus: 0 };
  }

  player.streak += 1;
  player.score += diceValue * 10;

  // Streak bonus points
  let streakBonus = 0;
  if (player.streak === 3) { streakBonus = 30; player.score += streakBonus; }
  else if (player.streak === 5) { streakBonus = 50; player.score += streakBonus; }
  else if (player.streak >= 7 && player.streak % 2 === 1) { streakBonus = 100; player.score += streakBonus; }

  let newPos = player.position + diceValue;
  if (newPos > 100) newPos = 100;

  let event: string | null = null;
  let reward: LadderReward | null = null;

  const bSnakes = game.boardSnakes;
  const bLadders = game.boardLadders;

  if (bSnakes[newPos] !== undefined) {
    const from = newPos;
    newPos = bSnakes[newPos];
    const emoji = game.level === 3 ? "☠️" : "🐍";
    event = `${emoji} Snake! ${player.name} slid from ${from} to ${newPos}!`;
  } else if (bLadders[newPos] !== undefined) {
    const ladderVal = bLadders[newPos];
    const from = newPos;
    if (typeof ladderVal === "number") {
      newPos = ladderVal;
      event = `🪜 Ladder! ${player.name} climbed from ${from} to ${newPos}!`;
    } else {
      newPos = ladderVal.to;
      reward = ladderVal.reward;
      event = `🪜 Ladder! ${player.name} climbed from ${from} to ${newPos}! ${reward.description}`;
      if (reward.type === "points") {
        player.score += reward.value;
      } else if (reward.type === "bonus_roll") {
        player.bonusRolls += reward.value;
      } else if (reward.type === "snake") {
        newPos = Math.max(1, newPos + reward.value);
        const trapEmoji = game.level === 3 ? "💀" : "🎭";
        event = `${trapEmoji} Surprise! ${ladderVal.reward.description}`;
      }
    }
  }

  player.position = newPos;
  game.awaitingAnswer = false;
  game.pendingDiceValue = null;
  game.lastEvent = event;

  if (newPos >= 100) {
    game.status = "finished";
    game.winnerId = player.id;
    event = `🏆 ${player.name} wins the game!`;
    game.lastEvent = event;
  } else {
    let nextIdx = (game.currentPlayerIndex + 1) % game.players.length;
    if (reward?.type === "bonus_roll" && player.bonusRolls > 0) {
      player.bonusRolls -= 1;
      nextIdx = playerIdx;
    }
    game.currentPlayerIndex = nextIdx;
  }

  return { game, moved: true, newPosition: newPos, event, reward, streakBonus };
}

export function setAwaitingAnswer(roomCode: string, diceValue: number): GameState | null {
  const game = games.get(roomCode);
  if (!game) return null;
  game.awaitingAnswer = true;
  game.pendingDiceValue = diceValue;
  return game;
}

export function disconnectPlayer(roomCode: string, playerId: string): void {
  const game = games.get(roomCode);
  if (!game) return;
  const player = game.players.find((p) => p.id === playerId);
  if (player) player.isConnected = false;
}

export function reconnectPlayer(roomCode: string, playerId: string): void {
  const game = games.get(roomCode);
  if (!game) return;
  const player = game.players.find((p) => p.id === playerId);
  if (player) player.isConnected = true;
}
