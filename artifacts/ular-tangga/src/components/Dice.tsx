import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DiceProps = {
  value: number | null;
  rolling: boolean;
  onRoll: () => void;
  disabled: boolean;
  canRoll: boolean;
};

const DICE_FACES: Record<number, number[][]> = {
  1: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  2: [[1, 0, 0], [0, 0, 0], [0, 0, 1]],
  3: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  4: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
  5: [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
  6: [[1, 0, 1], [1, 0, 1], [1, 0, 1]],
};

function DiceFace({ value }: { value: number }) {
  const face = DICE_FACES[value] || DICE_FACES[1];
  return (
    <div className="grid grid-cols-3 gap-1 w-12 h-12 p-2">
      {face.flat().map((dot, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-100 ${
            dot ? "bg-white shadow-md" : "bg-transparent"
          }`}
          style={{ aspectRatio: "1" }}
        />
      ))}
    </div>
  );
}

export default function Dice({ value, rolling, onRoll, disabled, canRoll }: DiceProps) {
  const [displayValue, setDisplayValue] = useState(value ?? 1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (rolling) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
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
        whileHover={canPress ? { scale: 1.05 } : {}}
        whileTap={canPress ? { scale: 0.95 } : {}}
        className={`relative w-20 h-20 rounded-2xl border-2 flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${
          canPress
            ? "border-primary/60 bg-card hover:border-primary hover:bg-card/80 shadow-lg shadow-primary/20 pulse-glow"
            : "border-muted/30 bg-muted/20 cursor-not-allowed opacity-50"
        }`}
        style={{
          background: canPress
            ? "linear-gradient(135deg, hsl(220 25% 20%), hsl(220 25% 15%))"
            : undefined,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isAnimating ? `anim-${displayValue}` : `val-${displayValue}`}
            initial={{ opacity: 0.7, rotateY: isAnimating ? -90 : 0 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: isAnimating ? 0.05 : 0.2 }}
          >
            <DiceFace value={displayValue} />
          </motion.div>
        </AnimatePresence>

        {isAnimating && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}
      </motion.button>

      <motion.p
        className="text-xs text-muted-foreground text-center font-medium"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {rolling
          ? "Rolling..."
          : canRoll && !disabled
          ? "Click to roll!"
          : disabled
          ? "Wait your turn"
          : "Answer first!"}
      </motion.p>
    </div>
  );
}
