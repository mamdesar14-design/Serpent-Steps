import { useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GeneratedSnakes, GeneratedLadders } from "@/lib/boardGenerator";
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
  snakes: GeneratedSnakes;
  ladders: GeneratedLadders;
  animatingPlayerId: string | null;
  animationPath: number[];
  boardEvent?: TokenBoardEvent;
  animationKey?: number;
};

const CELL_SIZE = 52;
const BOARD_SIZE = CELL_SIZE * 10;
const STEP_MS = 280;


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

function f(n: number): string { return n.toFixed(1); }

function getCellBg(pos: number, _level: number, isEven: boolean): React.CSSProperties {
  if (pos === 100) return { background: "linear-gradient(145deg,#3d2208,#78350f)", borderColor: "#d97706" };
  if (pos === 1)   return { background: "linear-gradient(145deg,#0c1a42,#1e3a8a)", borderColor: "#3b82f6" };

  return isEven
    ? { background: "linear-gradient(145deg,#1a2c42,#152236)", borderColor: "#263a54" }
    : { background: "linear-gradient(145deg,#111c2e,#0d1726)", borderColor: "#1a2840" };
}

function getCellLabel(pos: number): string {
  if (pos === 100) return "🏆";
  if (pos === 1)   return "▶";
  return "";
}

/* ─── Snake body ─── */
function buildSnakePath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  dir: 1 | -1,
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const amp = Math.min(46, Math.max(16, len * 0.24));
  const px = (-dy / len) * amp * dir;
  const py = (dx / len) * amp * dir;
  const c1x = start.x + dx * 0.28 + px;
  const c1y = start.y + dy * 0.28 + py;
  const c2x = start.x + dx * 0.72 - px;
  const c2y = start.y + dy * 0.72 - py;
  return `M ${f(start.x)} ${f(start.y)} C ${f(c1x)} ${f(c1y)},${f(c2x)} ${f(c2y)},${f(end.x)} ${f(end.y)}`;
}

/* ─── Ladder geometry ─── */
function ladderGeo(
  start: { x: number; y: number },
  end: { x: number; y: number },
  hw: number,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = (-dy / len) * hw;
  const py = (dx / len) * hw;
  const lS = { x: start.x - px, y: start.y - py };
  const lE = { x: end.x - px, y: end.y - py };
  const rS = { x: start.x + px, y: start.y + py };
  const rE = { x: end.x + px, y: end.y + py };
  const n = Math.max(3, Math.round(len / 20));
  const rungs = Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    return {
      x1: lS.x + (lE.x - lS.x) * t, y1: lS.y + (lE.y - lS.y) * t,
      x2: rS.x + (rE.x - rS.x) * t, y2: rS.y + (rE.y - rS.y) * t,
    };
  });
  return { lS, lE, rS, rE, rungs };
}

/* ─── Snake head ─── */
function SnakeHead({ hx, hy, tx, ty, headColor }: { hx: number; hy: number; tx: number; ty: number; headColor: string }) {
  const dx = tx - hx; const dy = ty - hy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len; const uy = dy / len;
  const px = -uy; const py = ux;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const e1x = hx + ux * 2 + px * 3.5; const e1y = hy + uy * 2 + py * 3.5;
  const e2x = hx + ux * 2 - px * 3.5; const e2y = hy + uy * 2 - py * 3.5;
  const tongX = hx - ux * 9; const tongY = hy - uy * 9;
  return (
    <g>
      <ellipse cx={hx} cy={hy} rx={10} ry={7.5} fill={headColor}
        transform={`rotate(${f(angle)},${f(hx)},${f(hy)})`}
        stroke="rgba(0,0,0,0.35)" strokeWidth={0.8} />
      <circle cx={e1x} cy={e1y} r={2.4} fill="white" />
      <circle cx={e2x} cy={e2y} r={2.4} fill="white" />
      <circle cx={e1x + ux * 0.9} cy={e1y + uy * 0.9} r={1.3} fill="#0f172a" />
      <circle cx={e2x + ux * 0.9} cy={e2y + uy * 0.9} r={1.3} fill="#0f172a" />
      <path d={`M ${f(hx - ux * 7)} ${f(hy - uy * 7)} L ${f(tongX)} ${f(tongY)} M ${f(tongX)} ${f(tongY)} l ${f(-ux * 4 + px * 2.5)} ${f(-uy * 4 + py * 2.5)} M ${f(tongX)} ${f(tongY)} l ${f(-ux * 4 - px * 2.5)} ${f(-uy * 4 - py * 2.5)}`}
        stroke="#f87171" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ─── Snake SVG ─── */
function SnakeSVG({ from, to, idx, level }: { from: number; to: number; idx: number; level: number }) {
  const s = getCellCoords(from, CELL_SIZE);
  const e = getCellCoords(to, CELL_SIZE);
  const dir: 1 | -1 = idx % 2 === 0 ? 1 : -1;
  const path = buildSnakePath(s, e, dir);

  const isLevel3 = level === 3;
  const outerColor  = isLevel3 ? "#4c1d95" : "#7f1d1d";
  const innerColor  = isLevel3 ? "#9333ea" : "#ef4444";
  const headColor   = isLevel3 ? "#7c3aed" : "#dc2626";
  const scaleColor  = isLevel3 ? "rgba(200,160,255,0.35)" : "rgba(255,160,160,0.35)";

  return (
    <g>
      {/* Shadow */}
      <path d={path} stroke="rgba(0,0,0,0.4)" strokeWidth={13} fill="none" strokeLinecap="round"
        transform="translate(1.5,1.5)" />
      {/* Outer body */}
      <path d={path} stroke={outerColor} strokeWidth={12} fill="none" strokeLinecap="round" />
      {/* Inner body */}
      <path d={path} stroke={innerColor} strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* Scale pattern */}
      <path d={path} stroke={scaleColor} strokeWidth={4} fill="none" strokeLinecap="round"
        strokeDasharray="9 6" />
      {/* Belly highlight */}
      <path d={path} stroke="rgba(255,255,255,0.18)" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Head at `from`, tail tip at `to` */}
      <SnakeHead hx={s.x} hy={s.y} tx={e.x} ty={e.y} headColor={headColor} />
      <circle cx={e.x} cy={e.y} r={3} fill={outerColor} />
    </g>
  );
}

/* ─── Ladder SVG ─── */
function LadderSVG({ from, to, color }: { from: number; to: number; color: string }) {
  const s = getCellCoords(from, CELL_SIZE);
  const e = getCellCoords(to, CELL_SIZE);
  const { lS, lE, rS, rE, rungs } = ladderGeo(s, e, 7);

  const darkColor = color.replace(")", ", 0.6)").replace("rgb", "rgba");
  return (
    <g>
      {/* Shadow */}
      <g transform="translate(1.5,1.5)" opacity={0.35}>
        <line x1={lS.x} y1={lS.y} x2={lE.x} y2={lE.y} stroke="#000" strokeWidth={5.5} strokeLinecap="round" />
        <line x1={rS.x} y1={rS.y} x2={rE.x} y2={rE.y} stroke="#000" strokeWidth={5.5} strokeLinecap="round" />
      </g>
      {/* Rails */}
      <line x1={lS.x} y1={lS.y} x2={lE.x} y2={lE.y} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={rS.x} y1={rS.y} x2={rE.x} y2={rE.y} stroke={color} strokeWidth={5} strokeLinecap="round" />
      {/* Rail highlight */}
      <line x1={lS.x} y1={lS.y} x2={lE.x} y2={lE.y} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={rS.x} y1={rS.y} x2={rE.x} y2={rE.y} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeLinecap="round" />
      {/* Rungs */}
      {rungs.map((r, i) => (
        <g key={`rung-${from}-${i}`}>
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(0,0,0,0.3)" strokeWidth={4.5}
            strokeLinecap="round" transform="translate(1,1)" />
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={color} strokeWidth={4} strokeLinecap="round" />
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
            strokeLinecap="round" />
        </g>
      ))}
      {/* Cap circles */}
      <circle cx={s.x} cy={s.y} r={5} fill={color} />
      <circle cx={e.x} cy={e.y} r={5} fill={color} />
      <circle cx={s.x} cy={s.y} r={2.5} fill="rgba(255,255,255,0.4)" />
      <circle cx={e.x} cy={e.y} r={2.5} fill="rgba(255,255,255,0.4)" />
    </g>
  );
}

function getLadderColor(level: number, ladder: { to: number; reward: { type: string } } | number): string {
  if (typeof ladder === "number") return "#22c55e";
  if (ladder.reward.type === "snake")      return "#f97316";
  if (ladder.reward.type === "bonus_roll") return "#3b82f6";
  return "#22c55e";
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

export default function Board({ players, level, snakes, ladders, animatingPlayerId, animationPath, boardEvent = null, animationKey = 0 }: BoardProps) {
  const [animStep, setAnimStep]   = useState(0);
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
      if (step < animationPath.length) { setAnimStep(step); sounds.step(); }
      else {
        clearInterval(timer);
        const evt = boardEventRef.current;
        if (evt?.type === "snake")  { setAnimPhase("snake");  sounds.snake(); }
        else if (evt?.type === "ladder") { setAnimPhase("ladder"); sounds.ladder(); }
        else setAnimPhase("idle");
      }
    }, STEP_MS);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey, animatingPlayerId]);

  useEffect(() => {
    if (!animatingPlayerId) { setAnimStep(0); setAnimPhase("idle"); }
  }, [animatingPlayerId]);

  const cells = useMemo(() => {
    const result: number[] = [];
    for (let row = 9; row >= 0; row--) {
      const isEvenRow = (9 - row) % 2 === 0;
      for (let col = 0; col < 10; col++) {
        const actualCol = isEvenRow ? col : 9 - col;
        result.push(row * 10 + actualCol + 1);
      }
    }
    return result;
  }, []);

  const snakeEntries  = Object.entries(snakes);
  const ladderEntries = Object.entries(ladders);

  return (
    <div className="relative select-none"
      style={{
        width: BOARD_SIZE, height: BOARD_SIZE,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* ─── Cells ─── */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {cells.map((pos) => {
          const idx    = pos - 1;
          const row    = Math.floor(idx / 10);
          const col    = idx % 10;
          const isEven = (row + col) % 2 === 0;
          const style  = getCellBg(pos, level, isEven);
          const label  = getCellLabel(pos);
          return (
            <div
              key={pos}
              className="relative flex flex-col items-center justify-center overflow-hidden"
              style={{
                ...style,
                border: `1px solid ${(style as any).borderColor ?? "#263a54"}`,
              }}
            >
              {/* Cell number */}
              <span
                className="absolute font-mono font-bold leading-none pointer-events-none select-none"
                style={{
                  fontSize: pos === 100 ? "7.5px" : "8px",
                  top: "2px", left: "3px",
                  color: pos === 100 ? "#fbbf24" : pos === 1 ? "#93c5fd" :
                    "rgba(148,163,184,0.55)",
                }}
              >
                {pos}
              </span>
              {/* Cell icon */}
              {label && (
                <span className="text-sm leading-none select-none pointer-events-none" style={{ fontSize: "15px" }}>
                  {label}
                </span>
              )}
              {/* Shine overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.04) 0%,transparent 50%)" }} />
            </div>
          );
        })}
      </div>

      {/* ─── Snake & Ladder SVG layer ─── */}
      <svg className="absolute inset-0 pointer-events-none z-10" width={BOARD_SIZE} height={BOARD_SIZE}>
        {/* Ladders first (behind snakes) */}
        {level === 1 && ladderEntries.map(([from, to]) => (
          <LadderSVG key={`l-${from}`} from={parseInt(from)} to={to as number} color="#22c55e" />
        ))}
        {(level === 2 || level === 3) && ladderEntries.map(([from, ladder]) => {
          const l = ladder as { to: number; reward: { type: string } };
          return (
            <LadderSVG key={`l-${from}`} from={parseInt(from)} to={l.to}
              color={getLadderColor(level, l)} />
          );
        })}
        {/* Snakes on top */}
        {snakeEntries.map(([from, to], idx) => (
          <SnakeSVG key={`s-${from}`} from={parseInt(from)} to={to as number} idx={idx} level={level} />
        ))}
      </svg>

      {/* ─── Token SVG layer ─── */}
      <svg className="absolute inset-0 pointer-events-none z-20" width={BOARD_SIZE} height={BOARD_SIZE}>
        {players.map((player, pIdx) => {
          if (player.position === 0) return null;
          const isAnim = animatingPlayerId === player.id;
          const offset = pIdx * 11 - (players.length - 1) * 5.5;

          if (isAnim && animPhase === "walking" && animationPath.length > 0) {
            const step = Math.min(animStep, animationPath.length - 1);
            const pos  = animationPath[step];
            const c    = getCellCoords(pos, CELL_SIZE);
            const cx = c.x + offset; const cy = c.y;
            return (
              // Outer group stays mounted for the whole walking phase
              <motion.g key={player.id}>
                {/*
                  Inner group keyed by step — remounts on every step change.
                  This causes motion.circle/text inside to replay initial→animate,
                  creating a visible "hop" from above on each square.
                */}
                <motion.g key={`${player.id}-step-${step}`}
                  initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                  {/* Ripple ring that expands outward on landing */}
                  <motion.circle cx={cx} cy={cy} r={14}
                    fill="none" stroke="white" strokeWidth={2}
                    initial={{ opacity: 0.85, scale: 0.4 }}
                    animate={{ opacity: 0, scale: 2.4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  {/* Token falls from above — spring gives natural bounce on landing */}
                  <motion.circle r={13} cx={cx}
                    fill={player.color} stroke="white" strokeWidth={2.5}
                    filter="drop-shadow(0 4px 10px rgba(0,0,0,0.75))"
                    initial={{ cy: cy - 26 }}
                    animate={{ cy }}
                    transition={{ type: "spring", damping: 8, stiffness: 320, mass: 0.55 }}
                  />
                  {/* Label falls with token */}
                  <motion.text textAnchor="middle" fontSize={10} fill="white" fontWeight="bold"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                    initial={{ x: cx, y: cy - 22 }}
                    animate={{ x: cx, y: cy + 4 }}
                    transition={{ type: "spring", damping: 8, stiffness: 320, mass: 0.55 }}
                  >
                    {player.name[0].toUpperCase()}
                  </motion.text>
                  {/* Step counter badge e.g. "2/6" */}
                  <rect x={cx + 7} y={cy - 28} rx={3} ry={3}
                    width={20} height={12} fill="rgba(0,0,0,0.82)" />
                  <text x={cx + 17} y={cy - 19}
                    textAnchor="middle" fontSize={7.5} fill="#fbbf24" fontWeight="bold"
                    style={{ pointerEvents: "none", userSelect: "none" }}>
                    {step + 1}/{animationPath.length}
                  </text>
                </motion.g>
              </motion.g>
            );
          }

          if (isAnim && animPhase === "snake" && boardEvent?.type === "snake") {
            const start = getCellCoords(boardEvent.from, CELL_SIZE);
            const end   = getCellCoords(boardEvent.to, CELL_SIZE);
            const sIdx  = snakeEntries.findIndex(([k]) => k === String(boardEvent.from));
            const dir: 1 | -1 = sIdx % 2 === 0 ? 1 : -1;
            const p    = buildSnakePath(start, end, dir);
            const ctrl = {
              x: (start.x + end.x) / 2 + (sIdx % 2 === 0 ? 20 : -20),
              y: (start.y + end.y) / 2,
            };
            const pts = getBezierPoints(start, ctrl, end, 20);
            const xF  = pts.map(pt => pt.x + offset);
            const yF  = pts.map(pt => pt.y);
            return (
              <motion.g key={`${player.id}-snake`}>
                <motion.circle r={13} fill={player.color} stroke="#EF4444" strokeWidth={3}
                  filter="drop-shadow(0 2px 10px rgba(239,68,68,0.75))"
                  initial={{ cx: xF[0], cy: yF[0] }}
                  animate={{ cx: xF, cy: yF, rotate: [0, -20, 20, -14, 14, -8, 8, 0] }}
                  transition={{ duration: 0.9, ease: "easeIn" }} />
              </motion.g>
            );
          }

          if (isAnim && animPhase === "ladder" && boardEvent?.type === "ladder") {
            const start = getCellCoords(boardEvent.from, CELL_SIZE);
            const end   = getCellCoords(boardEvent.to, CELL_SIZE);
            return (
              <motion.g key={`${player.id}-ladder`}>
                <motion.circle r={13} fill={player.color} stroke="#22C55E" strokeWidth={3}
                  filter="drop-shadow(0 2px 12px rgba(34,197,94,0.75))"
                  initial={{ cx: start.x + offset, cy: start.y }}
                  animate={{ cx: end.x + offset, cy: end.y, scale: [1, 1.55, 0.8, 1.18, 0.95, 1] }}
                  transition={{ duration: 0.6, type: "spring", damping: 9, stiffness: 220 }} />
                <motion.text textAnchor="middle" fontSize={10} fill="white" fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  initial={{ x: start.x + offset, y: start.y + 4 }}
                  animate={{ x: end.x + offset, y: end.y + 4 }}
                  transition={{ duration: 0.6, type: "spring", damping: 9, stiffness: 220 }}>
                  {player.name[0].toUpperCase()}
                </motion.text>
              </motion.g>
            );
          }

          const coords = getCellCoords(player.position, CELL_SIZE);
          return (
            <motion.g key={player.id}>
              <motion.circle r={13} fill={player.color} stroke="white" strokeWidth={2.5}
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.55))"
                animate={{ cx: coords.x + offset, cy: coords.y }}
                transition={{ duration: 0.4, type: "spring" }} />
              <motion.text
                textAnchor="middle" fontSize={10} fill="white" fontWeight="bold"
                style={{ pointerEvents: "none", userSelect: "none" }}
                animate={{ x: coords.x + offset, y: coords.y + 4 }}
                transition={{ duration: 0.4, type: "spring" }}>
                {player.name[0].toUpperCase()}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
