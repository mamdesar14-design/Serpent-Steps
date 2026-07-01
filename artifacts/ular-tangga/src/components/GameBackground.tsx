import { useEffect, useRef } from "react";

type SnakeConfig = {
  x: number; y: number; scale: number; rotate: number;
  color: string; dur: number; delay: number; floatX: number; floatY: number;
};

type LadderConfig = {
  x: number; y: number; scale: number; rotate: number;
  color: string; dur: number; delay: number; floatX: number; floatY: number;
};

const SNAKES: SnakeConfig[] = [
  { x: 5, y: 8, scale: 1.4, rotate: -20, color: "#EF4444", dur: 14, delay: 0, floatX: 30, floatY: 20 },
  { x: 78, y: 5, scale: 1.0, rotate: 30, color: "#10B981", dur: 18, delay: 2, floatX: -20, floatY: 25 },
  { x: 15, y: 65, scale: 1.6, rotate: 15, color: "#F97316", dur: 16, delay: 5, floatX: 25, floatY: -20 },
  { x: 70, y: 55, scale: 1.2, rotate: -35, color: "#8B5CF6", dur: 20, delay: 1, floatX: -30, floatY: 15 },
  { x: 40, y: 80, scale: 0.9, rotate: 50, color: "#EC4899", dur: 13, delay: 3, floatX: 20, floatY: -30 },
  { x: 88, y: 30, scale: 1.3, rotate: -10, color: "#06B6D4", dur: 17, delay: 6, floatX: -25, floatY: -20 },
  { x: 55, y: 15, scale: 1.1, rotate: 70, color: "#F59E0B", dur: 15, delay: 4, floatX: 15, floatY: 30 },
];

const LADDERS: LadderConfig[] = [
  { x: 88, y: 72, scale: 1.3, rotate: -15, color: "#84CC16", dur: 22, delay: 0, floatX: -20, floatY: -15 },
  { x: 8, y: 40, scale: 1.0, rotate: 20, color: "#F59E0B", dur: 18, delay: 3, floatX: 25, floatY: 20 },
  { x: 50, y: 50, scale: 1.5, rotate: -30, color: "#A78BFA", dur: 25, delay: 7, floatX: -15, floatY: 25 },
  { x: 30, y: 15, scale: 0.9, rotate: 45, color: "#34D399", dur: 20, delay: 2, floatX: 20, floatY: -20 },
  { x: 65, y: 85, scale: 1.2, rotate: 10, color: "#FCD34D", dur: 16, delay: 5, floatX: -25, floatY: -10 },
  { x: 20, y: 85, scale: 1.1, rotate: -50, color: "#60A5FA", dur: 19, delay: 1, floatX: 30, floatY: 15 },
];

function SnakeSVG({ cfg }: { cfg: SnakeConfig }) {
  const id = `snake-${cfg.x}-${cfg.y}`;
  const wiggleId = `wiggle-${cfg.x}`;
  const floatId = `float-${cfg.x}-${cfg.y}`;
  return (
    <div
      style={{
        position: "absolute",
        left: `${cfg.x}%`,
        top: `${cfg.y}%`,
        opacity: 0.07,
        transform: `rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
        animation: `${floatId} ${cfg.dur}s ease-in-out infinite`,
        animationDelay: `${cfg.delay}s`,
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes ${floatId} {
          0%   { transform: rotate(${cfg.rotate}deg) scale(${cfg.scale}) translate(0px, 0px); }
          25%  { transform: rotate(${cfg.rotate + 5}deg) scale(${cfg.scale}) translate(${cfg.floatX * 0.5}px, ${cfg.floatY * 0.3}px); }
          50%  { transform: rotate(${cfg.rotate}deg) scale(${cfg.scale}) translate(${cfg.floatX}px, ${cfg.floatY}px); }
          75%  { transform: rotate(${cfg.rotate - 5}deg) scale(${cfg.scale}) translate(${cfg.floatX * 0.3}px, ${cfg.floatY * 0.7}px); }
          100% { transform: rotate(${cfg.rotate}deg) scale(${cfg.scale}) translate(0px, 0px); }
        }
        @keyframes ${wiggleId} {
          0%, 100% { d: path("M 20 100 Q 10 80 25 60 Q 40 40 25 20 Q 10 0 30 -15"); }
          25%      { d: path("M 20 100 Q 35 80 20 60 Q 5 40 20 20 Q 35 0 15 -15"); }
          50%      { d: path("M 20 100 Q 5 80 20 60 Q 35 40 20 20 Q 5 0 25 -15"); }
          75%      { d: path("M 20 100 Q 30 80 15 60 Q 0 40 15 20 Q 30 0 10 -15"); }
        }
      `}</style>
      <svg width="60" height="130" viewBox="-10 -30 60 145" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cfg.color} />
            <stop offset="100%" stopColor={cfg.color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 Q 10 80 25 60 Q 40 40 25 20 Q 10 0 30 -15"
          stroke={`url(#${id})`}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ animation: `${wiggleId} ${cfg.dur * 0.6}s ease-in-out infinite`, animationDelay: `${cfg.delay}s` }}
        />
        <circle cx="30" cy="-15" r="7" fill={cfg.color} />
        <circle cx="27" cy="-18" r="2" fill="white" opacity="0.8" />
        <circle cx="33" cy="-18" r="2" fill="white" opacity="0.8" />
        <path d="M 26 -10 Q 30 -7 34 -10" stroke={cfg.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 30 -8 L 27 -6 M 30 -8 L 33 -6" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function LadderSVG({ cfg }: { cfg: LadderConfig }) {
  const floatId = `lfloat-${cfg.x}-${cfg.y}`;
  const rungs = [10, 30, 50, 70, 90, 110];
  return (
    <div
      style={{
        position: "absolute",
        left: `${cfg.x}%`,
        top: `${cfg.y}%`,
        opacity: 0.06,
        transform: `rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
        animation: `${floatId} ${cfg.dur}s ease-in-out infinite`,
        animationDelay: `${cfg.delay}s`,
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes ${floatId} {
          0%   { transform: rotate(${cfg.rotate}deg) scale(${cfg.scale}) translate(0px, 0px); }
          33%  { transform: rotate(${cfg.rotate + 3}deg) scale(${cfg.scale}) translate(${cfg.floatX * 0.6}px, ${cfg.floatY * 0.4}px); }
          66%  { transform: rotate(${cfg.rotate - 2}deg) scale(${cfg.scale}) translate(${cfg.floatX}px, ${cfg.floatY}px); }
          100% { transform: rotate(${cfg.rotate}deg) scale(${cfg.scale}) translate(0px, 0px); }
        }
      `}</style>
      <svg width="60" height="130" viewBox="0 0 60 130" fill="none">
        <rect x="5" y="0" width="8" height="130" rx="4" fill={cfg.color} />
        <rect x="47" y="0" width="8" height="130" rx="4" fill={cfg.color} />
        {rungs.map(y => (
          <rect key={y} x="5" y={y} width="50" height="7" rx="3.5" fill={cfg.color} opacity="0.9" />
        ))}
      </svg>
    </div>
  );
}

export default function GameBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {SNAKES.map((cfg, i) => <SnakeSVG key={i} cfg={cfg} />)}
      {LADDERS.map((cfg, i) => <LadderSVG key={i} cfg={cfg} />)}
    </div>
  );
}
