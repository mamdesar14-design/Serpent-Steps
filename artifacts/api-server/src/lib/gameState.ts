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

export function createGame(hostName: string, level: number): GameState {
  const roomCode = generateRoomCode();
  const hostId = randomUUID();

  const host: Player = {
    id: hostId,
    name: hostName,
    position: 0,
    score: 0,
    color: PLAYER_COLORS[0],
    bonusRolls: 0,
    isConnected: true,
  };

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
    color: PLAYER_COLORS[game.players.length],
    bonusRolls: 0,
    isConnected: true,
  };

  game.players.push(player);
  return { game, player };
}

export function getGame(roomCode: string): GameState | undefined {
  return games.get(roomCode);
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
} | null {
  const game = games.get(roomCode);
  if (!game || game.status !== "playing") return null;

  const playerIdx = game.players.findIndex((p) => p.id === playerId);
  if (playerIdx < 0) return null;

  const player = game.players[playerIdx];

  if (!answeredCorrectly) {
    game.awaitingAnswer = false;
    game.pendingDiceValue = null;
    game.lastEvent = `${player.name} answered incorrectly. Stay in place!`;
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    return { game, moved: false, newPosition: player.position, event: game.lastEvent, reward: null };
  }

  player.score += diceValue * 10;

  let newPos = player.position + diceValue;
  if (newPos > 100) newPos = 100;

  let event: string | null = null;
  let reward: LadderReward | null = null;

  if (game.level === 1) {
    if (SNAKES_LEVEL1[newPos]) {
      const from = newPos;
      newPos = SNAKES_LEVEL1[newPos];
      event = `🐍 Snake! ${player.name} slid from ${from} to ${newPos}!`;
    } else if (LADDERS_LEVEL1[newPos]) {
      const from = newPos;
      newPos = LADDERS_LEVEL1[newPos];
      event = `🪜 Ladder! ${player.name} climbed from ${from} to ${newPos}!`;
    }
  } else if (game.level === 2) {
    if (SNAKES_LEVEL2[newPos]) {
      const from = newPos;
      newPos = SNAKES_LEVEL2[newPos];
      event = `🐍 Snake! ${player.name} slid from ${from} to ${newPos}!`;
    } else if (LADDERS_LEVEL2[newPos]) {
      const ladder = LADDERS_LEVEL2[newPos];
      const from = newPos;
      newPos = ladder.to;
      reward = ladder.reward;
      event = `🪜 Ladder! ${player.name} climbed from ${from} to ${newPos}! ${reward.description}`;

      if (reward.type === "points") {
        player.score += reward.value;
      } else if (reward.type === "bonus_roll") {
        player.bonusRolls += reward.value;
      } else if (reward.type === "snake") {
        newPos = Math.max(1, newPos + reward.value);
        event = `🎭 Surprise! ${ladder.reward.description}`;
      }
    }
  } else {
    // Level 3
    if (SNAKES_LEVEL3[newPos]) {
      const from = newPos;
      newPos = SNAKES_LEVEL3[newPos];
      event = `☠️ Deadly Snake! ${player.name} crashed from ${from} to ${newPos}!`;
    } else if (LADDERS_LEVEL3[newPos]) {
      const ladder = LADDERS_LEVEL3[newPos];
      const from = newPos;
      newPos = ladder.to;
      reward = ladder.reward;
      event = `🪜 Ladder! ${player.name} climbed from ${from} to ${newPos}! ${reward.description}`;

      if (reward.type === "points") {
        player.score += reward.value;
      } else if (reward.type === "bonus_roll") {
        player.bonusRolls += reward.value;
      } else if (reward.type === "snake") {
        newPos = Math.max(1, newPos + reward.value);
        event = `💀 Trapdoor! ${ladder.reward.description}`;
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

  return { game, moved: true, newPosition: newPos, event, reward };
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
