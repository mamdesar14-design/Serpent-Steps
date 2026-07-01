import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DiceProps = {
  value: number | null;
  rolling: boolean;
  onRoll: () => void;
  disabled: boolean;
  canRoll: boolean;
};

const DOT_POSITIONS: Record<number, Array<{ top: string; left: string }>> = {
  1: [{ top: "50%", left: "50%" }],
  2: [{ top: "25%", left: "25%" }, { top: "75%", left: "75%" }],
  3: [{ top: "25%", left: "25%" }, { top: "50%", left: "50%" }, { top: "75%", left: "75%" }],
  4: [{ top: "25%", left: "25%" }, { top: "25%", left: "75%" }, { top: "75%", left: "25%" }, { top: "75%", left: "75%" }],
  5: [{ top: "25%", left: "25%" }, { top: "25%", left: "75%" }, { top: "50%", left: "50%" }, { top: "75%", left: "25%" }, { top: "75%", left: "75%" }],
  6: [{ top: "22%", left: "25%" }, { top: "22%", left: "75%" }, { top: "50%", left: "25%" }, { top: "50%", left: "75%" }, { top: "78%", left: "25%" }, { top: "78%", left: "75%" }],
};

function DiceFace({ value }: { value: number }) {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  return (
    <div className="relative w-12 h-12">
      {dots.map((pos, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle at 35% 35%, #ffffff, #e2e8f0)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
}

export default function Dice({ value, rolling, onRoll, disabled, canRoll }: DiceProps) {
  const [displayValue, setDisplayValue] = useState(value ?? 1);
  const [isAnimating, setIsAnimating]   = useState(false);

  useEffect(() => {
    if (rolling) {
      setIsAnimating(true);
      const interval = setInterval(() => setDisplayValue(Math.floor(Math.random() * 6) + 1), 80);
      return () => clearInterval(interval);
    } else {
      setIsAnimating(false);
      if (value !== null) setDisplayValue(value);
      return undefined;
    }
  }, [rolling, value]);

  const canPress = canRoll && !disabled && !rolling;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={onRoll}
        disabled={!canPress}
        whileHover={canPress ? { scale: 1.08, y: -2 } : {}}
        whileTap={canPress ? { scale: 0.93, y: 1 } : {}}
        className="relative w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer select-none"
        style={{
          background: canPress
            ? "linear-gradient(145deg, hsl(220 28% 26%), hsl(220 28% 18%))"
            : "linear-gradient(145deg, hsl(220 15% 18%), hsl(220 15% 14%))",
          border: canPress
            ? "2px solid hsl(258 80% 60% / 0.7)"
            : "2px solid hsl(220 15% 26% / 0.5)",
          boxShadow: canPress
            ? "0 6px 0 hsl(220 28% 12%), 0 8px 20px rgba(0,0,0,0.5), 0 0 20px hsl(258 80% 50% / 0.15), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 3px 0 hsl(220 15% 10%), 0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          cursor: canPress ? "pointer" : "not-allowed",
          opacity: !canPress && disabled ? 0.4 : 1,
          transition: "box-shadow 0.15s, border-color 0.15s",
        }}
      >
        {/* Top-left corner dot (3D effect) */}
        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-white/10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={isAnimating ? `a-${displayValue}` : `v-${displayValue}`}
            initial={{ opacity: 0.6, rotateY: isAnimating ? -70 : 0, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: isAnimating ? 0.06 : 0.18 }}
          >
            <DiceFace value={displayValue} />
          </motion.div>
        </AnimatePresence>

        {isAnimating && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: "2px solid hsl(258 90% 70%)" }}
            animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 8px hsl(258 90% 50% / 0.3)", "0 0 20px hsl(258 90% 60% / 0.6)", "0 0 8px hsl(258 90% 50% / 0.3)"] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          />
        )}
      </motion.button>

      <motion.p
        className="text-xs text-muted-foreground text-center font-medium"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {rolling ? "Rolling…" : canRoll && !disabled ? "Click to roll!" : disabled ? "Wait your turn" : "Answer first!"}
      </motion.p>
    </div>
  );
}
