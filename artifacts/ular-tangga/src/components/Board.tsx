import { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SNAKES_LEVEL1, LADDERS_LEVEL1, SNAKES_LEVEL2, LADDERS_LEVEL2, SNAKES_LEVEL3, LADDERS_LEVEL3 } from "@/lib/gameData";
import { sounds } from "@/lib/sounds";

export type TokenBoardEvent = {
  type: "snake" | "ladder";
  from: number;
  to: number;
} | null;

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
  boardEvent?: TokenBoardEvent;
  animationKey?: number;
};

const STEP_MS = 175;

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

function getBezierPoints(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  n: number,
) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return {
      x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
      y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
    };
  });
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

export default function Board({
  players,
  level,
  animatingPlayerId,
  animationPath,
  boardEvent = null,
  animationKey = 0,
}: BoardProps) {
  const CELL_SIZE = 52;
  const BOARD_SIZE = CELL_SIZE * 10;

  const [animStep, setAnimStep] = useState(0);
  const [animPhase, setAnimPhase] = useState<"idle" | "walking" | "snake" | "ladder">("idle");

  const boardEventRef = useRef(boardEvent);
  boardEventRef.current = boardEvent;

  useEffect(() => {
    if (!animatingPlayerId || animationPath.length === 0) return;

    let step = 0;
    setAnimStep(0);
    setAnimPhase("walking");
    sounds.step();

    const timer = setInterval(() => {
      step++;
      if (step < animationPath.length) {
        setAnimStep(step);
        sounds.step();
      } else {
        clearInterval(timer);
        const evt = boardEventRef.current;
        if (evt?.type === "snake") {
          setAnimPhase("snake");
          sounds.snake();
        } else if (evt?.type === "ladder") {
          setAnimPhase("ladder");
          sounds.ladder();
        } else {
          setAnimPhase("idle");
        }
      }
    }, STEP_MS);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey, animatingPlayerId]);

  useEffect(() => {
    if (!animatingPlayerId) {
      setAnimStep(0);
      setAnimPhase("idle");
    }
  }, [animatingPlayerId]);

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
  const snakeKeys = Object.keys(snakes);

  return (
    <div className="relative select-none" style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
      <svg className="absolute inset-0 pointer-events-none z-10" width={BOARD_SIZE} height={BOARD_SIZE}>
        {Object.entries(snakes).map(([from, to], idx) => {
          const fromPos = parseInt(from);
          const toPos = to as number;
          const start = getCellCoords(fromPos, CELL_SIZE);
          const end = getCellCoords(toPos, CELL_SIZE);
          const midX = (start.x + end.x) / 2 + (idx % 2 === 0 ? 20 : -20);
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
                <line x1={start.x - 4} y1={start.y} x2={end.x - 4} y2={end.y} stroke="#22C55E" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                <line x1={start.x + 4} y1={start.y} x2={end.x + 4} y2={end.y} stroke="#22C55E" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
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
              ladder.reward.type === "snake" ? "#F97316" :
              ladder.reward.type === "bonus_roll" ? "#3B82F6" : "#22C55E";
            return (
              <g key={`ladder2-${fromPos}`}>
                <line x1={start.x - 4} y1={start.y} x2={end.x - 4} y2={end.y} stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                <line x1={start.x + 4} y1={start.y} x2={end.x + 4} y2={end.y} stroke={color} strokeWidth="3" opacity="0.7" strokeLinecap="round" />
                {[0.33, 0.66].map((t) => (
                  <line
                    key={t}
                    x1={start.x - 4 + (end.x - start.x) * t - 3}
                    y1={start.y + (end.y - start.y) * t}
                    x2={start.x + 4 + (end.x - start.x) * t + 3}
                    y2={start.y + (end.y - start.y) * t}
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                ))}
                <circle cx={end.x} cy={end.y} r="5" fill={color} opacity="0.8" />
              </g>
            );
          })}
      </svg>

      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {cells.map((pos) => (
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
          const isAnim = animatingPlayerId === player.id;
          const offset = pIdx * 10 - (players.length - 1) * 5;

          if (isAnim && animPhase === "walking" && animationPath.length > 0) {
            const step = Math.min(animStep, animationPath.length - 1);
            const pos = animationPath[step];
            const c = getCellCoords(pos, CELL_SIZE);
            const cx = c.x + offset;
            const cy = c.y;
            return (
              <motion.g key={player.id}>
                <motion.circle
                  key={`${player.id}-pulse-${step}`}
                  cx={cx} cy={cy} r={16}
                  fill="none" stroke="white" strokeWidth="1.5"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.circle
                  r={12}
                  fill={player.color}
                  stroke="white"
                  strokeWidth={2}
                  filter="drop-shadow(0 2px 5px rgba(0,0,0,0.55))"
                  animate={{ cx, cy }}
                  transition={{ type: "spring", damping: 18, stiffness: 500, duration: 0.15 }}
                />
                <motion.text
                  textAnchor="middle"
                  fontSize={10}
                  fill="white"
                  fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  animate={{ x: cx, y: cy + 4 }}
                  transition={{ type: "spring", damping: 18, stiffness: 500, duration: 0.15 }}
                >
                  {player.name[0].toUpperCase()}
                </motion.text>
              </motion.g>
            );
          }

          if (isAnim && animPhase === "snake" && boardEvent?.type === "snake") {
            const start = getCellCoords(boardEvent.from, CELL_SIZE);
            const end = getCellCoords(boardEvent.to, CELL_SIZE);
            const snakeIdx = snakeKeys.indexOf(String(boardEvent.from));
            const midX = (start.x + end.x) / 2 + (snakeIdx % 2 === 0 ? 20 : -20);
            const ctrl = { x: midX, y: (start.y + end.y) / 2 };
            const pts = getBezierPoints(start, ctrl, end, 18);
            const xFrames = pts.map((p) => p.x + offset);
            const yFrames = pts.map((p) => p.y);
            return (
              <motion.g key={`${player.id}-snake`}>
                <motion.circle
                  r={12}
                  fill={player.color}
                  stroke="#EF4444"
                  strokeWidth={3}
                  filter="drop-shadow(0 2px 10px rgba(239,68,68,0.75))"
                  initial={{ cx: xFrames[0], cy: yFrames[0] }}
                  animate={{
                    cx: xFrames,
                    cy: yFrames,
                    rotate: [0, -20, 20, -14, 14, -8, 8, 0],
                  }}
                  transition={{ duration: 0.9, ease: "easeIn" }}
                />
              </motion.g>
            );
          }

          if (isAnim && animPhase === "ladder" && boardEvent?.type === "ladder") {
            const start = getCellCoords(boardEvent.from, CELL_SIZE);
            const end = getCellCoords(boardEvent.to, CELL_SIZE);
            return (
              <motion.g key={`${player.id}-ladder`}>
                <motion.circle
                  r={12}
                  fill={player.color}
                  stroke="#22C55E"
                  strokeWidth={3}
                  filter="drop-shadow(0 2px 12px rgba(34,197,94,0.75))"
                  initial={{ cx: start.x + offset, cy: start.y }}
                  animate={{
                    cx: end.x + offset,
                    cy: end.y,
                    scale: [1, 1.55, 0.8, 1.18, 0.95, 1],
                  }}
                  transition={{ duration: 0.6, type: "spring", damping: 9, stiffness: 220 }}
                />
                <motion.text
                  textAnchor="middle"
                  fontSize={10}
                  fill="white"
                  fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  initial={{ x: start.x + offset, y: start.y + 4 }}
                  animate={{ x: end.x + offset, y: end.y + 4 }}
                  transition={{ duration: 0.6, type: "spring", damping: 9, stiffness: 220 }}
                >
                  {player.name[0].toUpperCase()}
                </motion.text>
              </motion.g>
            );
          }

          const coords = getCellCoords(player.position, CELL_SIZE);
          return (
            <motion.g key={player.id}>
              <motion.circle
                r={12}
                fill={player.color}
                stroke="white"
                strokeWidth={2}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                animate={{ cx: coords.x + offset, cy: coords.y, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              />
              <text
                x={coords.x + offset}
                y={coords.y + 4}
                textAnchor="middle"
                fontSize={10}
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
