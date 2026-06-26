import { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SNAKES_LEVEL1, LADDERS_LEVEL1, SNAKES_LEVEL2, LADDERS_LEVEL2, SNAKES_LEVEL3, LADDERS_LEVEL3 } from "@/lib/gameData";

type Player = {
  id: string;
  name: string;
  position: number;
  color: string;
  score: number;
  bonusRolls: number;
};

type BoardProps = {
  players: Player[];
  level: number;
  animatingPlayerId: string | null;
  animationPath: number[];
};

function getCellCoords(pos: number, cellSize: number): { x: number; y: number } {
  if (pos === 0) return { x: -1, y: -1 };
  const idx = pos - 1;
  const row = Math.floor(idx / 10);
  const col = idx % 10;
  const actualCol = row % 2 === 0 ? col : 9 - col;
  const boardRow = 9 - row;
  return {
    x: actualCol * cellSize + cellSize / 2,
    y: boardRow * cellSize + cellSize / 2,
  };
}

type LadderRecord = Record<number, { to: number; reward: { type: string } }>;

function getSnakes(level: number): Record<number, number> {
  if (level === 3) return SNAKES_LEVEL3;
  if (level === 2) return SNAKES_LEVEL2;
  return SNAKES_LEVEL1;
}

function getLadders(level: number): Record<number, number> | LadderRecord {
  if (level === 3) return LADDERS_LEVEL3 as LadderRecord;
  if (level === 2) return LADDERS_LEVEL2 as LadderRecord;
  return LADDERS_LEVEL1;
}

function CellContent({ pos, level }: { pos: number; level: number }) {
  const snakes = getSnakes(level);
  const ladders = getLadders(level);

  if (snakes[pos]) return <span className="text-base select-none">{level === 3 ? "☠️" : "🐍"}</span>;
  if (level === 1 && (ladders as Record<number, number>)[pos]) return <span className="text-base select-none">🪜</span>;
  if ((level === 2 || level === 3) && (ladders as LadderRecord)[pos]) {
    const ladder = (ladders as LadderRecord)[pos];
    if (ladder.reward.type === "snake") return <span className="text-base select-none">{level === 3 ? "💀" : "🎭"}</span>;
    if (ladder.reward.type === "bonus_roll") return <span className="text-base select-none">🎲</span>;
    return <span className="text-base select-none">🪜</span>;
  }
  if (pos === 100) return <span className="text-base select-none">🏆</span>;
  return null;
}

function getCellColor(pos: number, level: number): string {
  const snakes = getSnakes(level);
  const ladders = getLadders(level);

  if (pos === 100) return "bg-yellow-500/30 border-yellow-400/60";
  if (snakes[pos]) return level === 3 ? "bg-purple-950/60 border-purple-500/50" : "bg-red-900/40 border-red-500/40";
  if (level === 1 && (ladders as Record<number, number>)[pos]) return "bg-green-900/40 border-green-500/40";
  if ((level === 2 || level === 3) && (ladders as LadderRecord)[pos]) {
    const ladder = (ladders as LadderRecord)[pos];
    if (ladder.reward.type === "snake") return level === 3 ? "bg-fuchsia-950/60 border-fuchsia-500/50" : "bg-orange-900/40 border-orange-500/40";
    if (ladder.reward.type === "bonus_roll") return "bg-blue-900/40 border-blue-500/40";
    return "bg-green-900/40 border-green-500/40";
  }

  const idx = pos - 1;
  const row = Math.floor(idx / 10);
  const col = idx % 10;
  const isEven = (row + col) % 2 === 0;
  if (level === 3) return isEven ? "bg-purple-950/30 border-purple-800/30" : "bg-slate-800/60 border-slate-700/40";
  return isEven ? "bg-slate-700/60 border-slate-600/40" : "bg-slate-800/60 border-slate-700/40";
}

export default function Board({ players, level, animatingPlayerId, animationPath }: BoardProps) {
  const CELL_SIZE = 52;
  const BOARD_SIZE = CELL_SIZE * 10;

  const cells = useMemo(() => {
    const result: number[] = [];
    for (let row = 9; row >= 0; row--) {
      const isEvenRow = (9 - row) % 2 === 0;
      for (let col = 0; col < 10; col++) {
        const actualCol = isEvenRow ? col : 9 - col;
        const pos = row * 10 + actualCol + 1;
        result.push(pos);
      }
    }
    return result;
  }, []);

  const snakes = getSnakes(level);
  const ladders = getLadders(level);

  return (
    <div className="relative select-none" style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
      <svg
        className="absolute inset-0 pointer-events-none z-10"
        width={BOARD_SIZE}
        height={BOARD_SIZE}
      >
        {Object.entries(snakes).map(([from, to]) => {
          const fromPos = parseInt(from);
          const toPos = to as number;
          const start = getCellCoords(fromPos, CELL_SIZE);
          const end = getCellCoords(toPos, CELL_SIZE);
          const midX = (start.x + end.x) / 2 + (Math.random() > 0.5 ? 20 : -20);
          const midY = (start.y + end.y) / 2;
          return (
            <g key={`snake-${fromPos}`}>
              <path
                d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                stroke="#EF4444"
                strokeWidth="3"
                strokeDasharray="6,3"
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />
              <circle cx={start.x} cy={start.y} r="5" fill="#EF4444" opacity="0.8" />
              <circle cx={end.x} cy={end.y} r="4" fill="#EF4444" opacity="0.5" />
            </g>
          );
        })}

        {level === 1 &&
          Object.entries(ladders as Record<number, number>).map(([from, to]) => {
            const fromPos = parseInt(from);
            const start = getCellCoords(fromPos, CELL_SIZE);
            const end = getCellCoords(to, CELL_SIZE);
            return (
              <g key={`ladder-${fromPos}`}>
                <line
                  x1={start.x - 4} y1={start.y}
                  x2={end.x - 4} y2={end.y}
                  stroke="#22C55E"
                  strokeWidth="3"
                  opacity="0.7"
                  strokeLinecap="round"
                />
                <line
                  x1={start.x + 4} y1={start.y}
                  x2={end.x + 4} y2={end.y}
                  stroke="#22C55E"
                  strokeWidth="3"
                  opacity="0.7"
                  strokeLinecap="round"
                />
                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={t}
                    x1={start.x - 4 + (end.x - start.x) * t - 4}
                    y1={start.y + (end.y - start.y) * t}
                    x2={start.x + 4 + (end.x - start.x) * t + 4}
                    y2={start.y + (end.y - start.y) * t}
                    stroke="#22C55E"
                    strokeWidth="2"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                ))}
                <circle cx={end.x} cy={end.y} r="4" fill="#22C55E" opacity="0.8" />
              </g>
            );
          })}

        {(level === 2 || level === 3) &&
          Object.entries(ladders as Record<number, { to: number; reward: { type: string } }>).map(([from, ladder]) => {
            const fromPos = parseInt(from);
            const start = getCellCoords(fromPos, CELL_SIZE);
            const end = getCellCoords(ladder.to, CELL_SIZE);
            const color =
              ladder.reward.type === "snake"
                ? "#F97316"
                : ladder.reward.type === "bonus_roll"
                ? "#3B82F6"
                : "#22C55E";
            return (
              <g key={`ladder2-${fromPos}`}>
                <line x1={start.x - 4} y1={start.y} x2={end.x - 4} y2={end.y} stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                <line x1={start.x + 4} y1={start.y} x2={end.x + 4} y2={end.y} stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                {[0.33, 0.66].map((t) => (
                  <line key={t} x1={start.x - 4 + (end.x - start.x) * t - 3} y1={start.y + (end.y - start.y) * t} x2={start.x + 4 + (end.x - start.x) * t + 3} y2={start.y + (end.y - start.y) * t} stroke={color} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                ))}
                <circle cx={end.x} cy={end.y} r="5" fill={color} opacity="0.8" />
              </g>
            );
          })}
      </svg>

      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {cells.map((pos, idx) => (
          <div
            key={pos}
            className={`relative flex flex-col items-center justify-center border ${getCellColor(pos, level)} transition-colors`}
          >
            <span className="text-[9px] text-muted-foreground/60 absolute top-0.5 left-1 leading-none font-mono">
              {pos}
            </span>
            <CellContent pos={pos} level={level} />
          </div>
        ))}
      </div>

      <svg className="absolute inset-0 pointer-events-none z-20" width={BOARD_SIZE} height={BOARD_SIZE}>
        {players.map((player, pIdx) => {
          if (player.position === 0) return null;
          const isAnimating = animatingPlayerId === player.id;
          const displayPos = isAnimating && animationPath.length > 0
            ? animationPath[animationPath.length - 1]
            : player.position;
          const coords = getCellCoords(displayPos, CELL_SIZE);
          const offset = pIdx * 10 - (players.length - 1) * 5;

          return (
            <motion.g key={player.id}>
              <motion.circle
                cx={coords.x + offset}
                cy={coords.y}
                r="12"
                fill={player.color}
                stroke="white"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                animate={
                  isAnimating
                    ? { scale: [1, 1.3, 1], y: [0, -6, 0] }
                    : { scale: 1, y: 0 }
                }
                transition={isAnimating ? { duration: 0.3, repeat: Infinity } : { duration: 0.4, type: "spring" }}
              />
              <text
                x={coords.x + offset}
                y={coords.y + 4}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {player.name[0].toUpperCase()}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
