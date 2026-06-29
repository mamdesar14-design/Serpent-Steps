import { useState, useCallback, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRandomText,
  getRandomLevel3Text,
  ExplanationText,
  Level3ExplanationText,
  SNAKES_LEVEL1, LADDERS_LEVEL1,
  SNAKES_LEVEL2, LADDERS_LEVEL2,
  SNAKES_LEVEL3, LADDERS_LEVEL3,
} from "@/lib/gameData";
import Board from "@/components/Board";
import Dice from "@/components/Dice";
import QuestionModal from "@/components/QuestionModal";
import Confetti from "@/components/Confetti";
import { sounds } from "@/lib/sounds";
import { ArrowLeft, Home as HomeIcon, RotateCcw, Volume2, VolumeX } from "lucide-react";

type AnyText = ExplanationText | Level3ExplanationText;

type RewardInfo = { type: string; value: number; description: string };
type BoardEvent = { type: "snake" | "ladder" | "none"; from: number; to: number; reward?: RewardInfo };

function getSnakes(level: number): Record<number, number> {
  if (level === 3) return SNAKES_LEVEL3;
  if (level === 2) return SNAKES_LEVEL2;
  return SNAKES_LEVEL1;
}
function getLadders(level: number): Record<number, number | { to: number; reward: RewardInfo }> {
  if (level === 3) return LADDERS_LEVEL3;
  if (level === 2) return LADDERS_LEVEL2;
  return LADDERS_LEVEL1;
}
function resolveLadder(val: number | { to: number; reward: RewardInfo }): { to: number; reward?: RewardInfo } {
  if (typeof val === "number") return { to: val };
  return { to: val.to, reward: val.reward };
}

const PLAYER_COLOR = "#8B5CF6";
const STREAK_BONUSES: Record<number, number> = { 3: 30, 5: 50, 7: 100 };

export default function SoloPractice() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchStr);
  const playerName = searchParams.get("name") || "Player";
  const level = parseInt(searchParams.get("level") || "1");

  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentText, setCurrentText] = useState<AnyText | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [pendingDice, setPendingDice] = useState<number | null>(null);
  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(null);
  const [animationPath, setAnimationPath] = useState<number[]>([]);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, snakes: 0, ladders: 0 });
  const usedTextIds = useRef<string[]>([]);

  const players = [{
    id: "solo",
    name: playerName,
    position,
    score,
    color: PLAYER_COLOR,
    bonusRolls: 0,
    isConnected: true,
    streak,
  }];

  const rollDice = useCallback(() => {
    if (rolling || showQuestion || gameOver) return;
    const val = Math.floor(Math.random() * 6) + 1;
    setRolling(true);
    setDiceValue(null);
    sounds.dice();
    setTimeout(() => {
      setRolling(false);
      setDiceValue(val);
      setPendingDice(val);
      const text = level === 3
        ? getRandomLevel3Text(usedTextIds.current)
        : getRandomText(level, usedTextIds.current);
      setCurrentText(text);
      setQuestionIdx(Math.floor(Math.random() * text.questions.length));
      setShowQuestion(true);
    }, 1200);
  }, [rolling, showQuestion, gameOver, level]);

  const handleAnswer = useCallback((correct: boolean) => {
    setShowQuestion(false);
    if (currentText) {
      usedTextIds.current = [...usedTextIds.current.slice(-9), currentText.id];
    }

    if (!correct) {
      sounds.wrong();
      setStreak(0);
      setLastEvent("Wrong answer — stay in place!");
      setStats(s => ({ ...s, wrong: s.wrong + 1 }));
      return;
    }

    const dice = pendingDice ?? 1;
    const snakes = getSnakes(level);
    const ladders = getLadders(level);

    let newPos = Math.min(position + dice, 100);
    let event: BoardEvent = { type: "none", from: newPos, to: newPos };
    let bonusScore = 10;

    if (snakes[newPos] !== undefined) {
      sounds.snake();
      event = { type: "snake", from: newPos, to: snakes[newPos] };
      newPos = snakes[newPos];
      setStats(s => ({ ...s, correct: s.correct + 1, snakes: s.snakes + 1 }));
      setLastEvent(`🐍 Snake! Slid down from ${event.from} → ${event.to}`);
    } else if (ladders[newPos] !== undefined) {
      sounds.ladder();
      const resolved = resolveLadder(ladders[newPos] as any);
      event = { type: "ladder", from: newPos, to: resolved.to, reward: resolved.reward };
      newPos = resolved.to;
      if (resolved.reward?.type === "points") bonusScore += resolved.reward.value;
      setStats(s => ({ ...s, correct: s.correct + 1, ladders: s.ladders + 1 }));
      setLastEvent(`🪜 Ladder! Climbed from ${event.from} → ${event.to}`);
      if (resolved.reward?.description) {
        setRewardMsg(resolved.reward.description);
        setTimeout(() => setRewardMsg(null), 3000);
      }
    } else {
      sounds.correct();
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      setLastEvent(`Moved to square ${newPos} (+${bonusScore} pts)`);
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    const streakBonus = STREAK_BONUSES[newStreak] ?? (newStreak >= 7 ? STREAK_BONUSES[7] : 0);
    if (streakBonus > 0) {
      bonusScore += streakBonus;
      sounds.streak();
      setStreakMsg(`🔥 ${newStreak} streak! +${streakBonus} bonus pts`);
      setTimeout(() => setStreakMsg(null), 3000);
    }

    const path: number[] = [];
    for (let i = position + 1; i <= newPos; i++) path.push(i);

    setAnimatingPlayerId("solo");
    setAnimationPath(path);
    setTimeout(() => {
      setAnimatingPlayerId(null);
      setAnimationPath([]);
    }, path.length * 200 + 500);

    setScore(s => s + bonusScore);
    setPosition(newPos);

    if (newPos >= 100) {
      sounds.win();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setGameOver(true);
    }
  }, [currentText, pendingDice, level, position, streak]);

  const resetGame = () => {
    setPosition(0);
    setScore(0);
    setStreak(0);
    setDiceValue(null);
    setRolling(false);
    setShowQuestion(false);
    setCurrentText(null);
    setPendingDice(null);
    setAnimatingPlayerId(null);
    setAnimationPath([]);
    setLastEvent(null);
    setRewardMsg(null);
    setStreakMsg(null);
    setGameOver(false);
    setShowConfetti(false);
    setStats({ correct: 0, wrong: 0, snakes: 0, ladders: 0 });
    usedTextIds.current = [];
  };

  const levelLabel = level === 1 ? "Level 1 — MCQ" : level === 2 ? "Level 2 — Hard MCQ" : "Level 3 — Matching";
  const accuracy = stats.correct + stats.wrong > 0
    ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border/30 bg-card/40 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between shrink-0">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-card border border-border/40">
            🎮 Solo — {levelLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">{playerName}</span>
          <button
            onClick={() => { const m = !muted; setMuted(m); sounds.setMuted(m); }}
            className="p-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground transition-all"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetGame}
            className="p-1.5 rounded-lg hover:bg-card border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground transition-all"
            title="Restart game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-3 md:p-4 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-start">
          <div
            className="rounded-2xl border border-border/30 overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(220 30% 13%), hsl(220 25% 11%))" }}
          >
            <Board
              players={players}
              level={level}
              animatingPlayerId={animatingPlayerId}
              animationPath={animationPath}
            />
          </div>

          {!gameOver && (
            <motion.div
              className="mt-4 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {!showQuestion && !rolling && (
                <motion.p
                  className="text-sm font-bold text-primary"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Your turn! Roll the dice.
                </motion.p>
              )}
              {lastEvent && !showQuestion && (
                <p className="text-xs text-muted-foreground text-center max-w-xs">{lastEvent}</p>
              )}
              <Dice
                value={diceValue}
                rolling={rolling}
                onRoll={rollDice}
                disabled={showQuestion || rolling || gameOver}
                canRoll={!showQuestion && !rolling && !gameOver}
              />
            </motion.div>
          )}
        </div>

        <div className="w-52 md:w-60 shrink-0 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-card/60 border border-border/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0" style={{ background: PLAYER_COLOR }}>
                  {playerName.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm text-foreground truncate">{playerName}</p>
                  {streak >= 2 && (
                    <motion.span
                      className="text-xs font-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      {"🔥".repeat(Math.min(streak, 3))}
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Square {position}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-card/50 rounded-lg py-2">
                <p className="text-xl font-black text-primary">{score}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="bg-card/50 rounded-lg py-2">
                <p className="text-xl font-black text-foreground">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>

            {streak >= 2 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg py-2 text-center">
                <p className="text-xs font-bold text-orange-400">🔥 {streak} answer streak!</p>
              </div>
            )}

            <div className="text-xs space-y-1 pt-1 border-t border-border/30">
              <div className="flex justify-between text-muted-foreground">
                <span>✅ Correct</span><span className="font-bold text-green-400">{stats.correct}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>❌ Wrong</span><span className="font-bold text-red-400">{stats.wrong}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>🐍 Snakes hit</span><span className="font-bold">{stats.snakes}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>🪜 Ladders used</span><span className="font-bold">{stats.ladders}</span>
              </div>
            </div>
          </div>

          <div className="bg-card/40 border border-border/30 rounded-xl p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-2">Legend</p>
            <div className="flex items-center gap-2"><span>🐍</span><span>Snake — slide down</span></div>
            <div className="flex items-center gap-2"><span>🪜</span><span>Ladder — climb up</span></div>
            {level >= 2 && (
              <>
                <div className="flex items-center gap-2"><span>🎭</span><span>Surprise trap!</span></div>
                <div className="flex items-center gap-2"><span>🎲</span><span>Bonus roll!</span></div>
              </>
            )}
            <div className="flex items-center gap-2"><span>🏆</span><span>Square 100 = Win!</span></div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-primary mb-1">Solo Mode</p>
            <p className="leading-relaxed">Practice offline — no internet, no room code needed. Answer correctly to move!</p>
          </div>
        </div>
      </div>

      {showQuestion && currentText && (
        <QuestionModal
          text={currentText}
          questionIndex={questionIdx}
          diceValue={pendingDice ?? 1}
          onAnswer={handleAnswer}
          level={level}
          playerName={playerName}
        />
      )}

      <AnimatePresence>
        {rewardMsg && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-yellow-500/90 text-yellow-900 font-bold px-6 py-3 rounded-full shadow-xl text-sm"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
          >
            {rewardMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {streakMsg && (
          <motion.div
            className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-orange-500/90 text-white font-bold px-6 py-3 rounded-full shadow-xl text-sm"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
          >
            {streakMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <Confetti active={showConfetti} />

      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              className="relative z-10 w-full max-w-sm text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              <div
                className="rounded-3xl border border-border/40 p-8 shadow-2xl"
                style={{ background: "linear-gradient(135deg, hsl(220 25% 15%), hsl(220 30% 12%))" }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🏆
                </motion.div>
                <h2 className="text-2xl font-black text-foreground mb-1">You Won!</h2>
                <p className="text-muted-foreground text-sm mb-5">Reached square 100!</p>

                <div className="bg-card/50 rounded-xl p-4 mb-6 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Score</span>
                    <span className="font-black text-primary text-lg">{score} pts</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-bold text-green-400">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Correct Answers</span>
                    <span className="font-bold">{stats.correct}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Wrong Answers</span>
                    <span className="font-bold">{stats.wrong}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetGame}
                    className="flex-1 py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Play Again
                  </button>
                  <button
                    onClick={() => setLocation("/")}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                  >
                    <HomeIcon className="w-3.5 h-3.5" />
                    Home
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
