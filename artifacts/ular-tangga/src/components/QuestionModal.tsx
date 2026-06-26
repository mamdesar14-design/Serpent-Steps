import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExplanationText, Level3ExplanationText, Question, MatchingQuestion } from "@/lib/gameData";
import { CheckCircle, XCircle, Clock, BookOpen, ChevronRight, Shuffle, Link } from "lucide-react";

type AnyText = ExplanationText | Level3ExplanationText;

type QuestionModalProps = {
  text: AnyText | null;
  questionIndex: number;
  diceValue: number;
  onAnswer: (correct: boolean) => void;
  level: number;
  playerName: string;
};

const TIME_LIMIT = { 1: 45, 2: 30, 3: 90 };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MCQSection({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"question" | "result">("question");

  const handleClick = (idx: number) => {
    if (phase !== "question" || selected !== null) return;
    setSelected(idx);
    setPhase("result");
    setTimeout(() => onAnswer(idx === question.correct), 1800);
  };

  return (
    <div className="space-y-4">
      {phase === "question" && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground leading-snug">{question.question}</p>
          </div>
          <div className="grid gap-2.5">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleClick(idx)}
                className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-3"
                style={{ background: "hsl(220 25% 18%)", borderColor: "hsl(220 20% 28%)" }}
                whileHover={{ scale: 1.01, borderColor: "hsl(258 90% 60%)" }}
                whileTap={{ scale: 0.99 }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "hsl(258 90% 30%)", color: "hsl(258 90% 80%)" }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-foreground/90">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === "result" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className={`rounded-xl p-5 border text-center ${selected === question.correct ? "bg-green-900/30 border-green-500/40" : "bg-red-900/30 border-red-500/40"}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 300 }}
              className="flex justify-center mb-3"
            >
              {selected === question.correct ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400" />
              )}
            </motion.div>
            <h3 className={`text-xl font-bold mb-1 ${selected === question.correct ? "text-green-400" : "text-red-400"}`}>
              {selected === question.correct ? "Correct!" : selected === -1 ? "Time's Up!" : "Incorrect!"}
            </h3>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
            {selected === question.correct ? (
              <motion.p className="text-green-400 font-bold mt-2 text-sm" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
                Move forward! +points earned!
              </motion.p>
            ) : (
              <p className="text-red-400 font-bold mt-2 text-sm">Stay in place!</p>
            )}
          </div>
          <div className="bg-card/30 rounded-xl p-3 border border-border/20">
            <p className="text-xs text-muted-foreground mb-1">Correct answer:</p>
            <p className="text-sm font-medium text-foreground">
              {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const PAIR_COLORS = [
  { bg: "hsl(258 80% 35%)", border: "hsl(258 80% 55%)", text: "hsl(258 90% 85%)" },
  { bg: "hsl(196 70% 28%)", border: "hsl(196 70% 50%)", text: "hsl(196 80% 82%)" },
  { bg: "hsl(142 60% 22%)", border: "hsl(142 60% 42%)", text: "hsl(142 70% 75%)" },
  { bg: "hsl(38 80% 28%)", border: "hsl(38 80% 50%)", text: "hsl(38 90% 80%)" },
];

function MatchingSection({
  question,
  onAnswer,
}: {
  question: MatchingQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const shuffledRight = useMemo(() => shuffle(question.pairs.map((p, i) => ({ text: p.right, origIdx: i }))), [question.id]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({}); // leftIdx → shuffledRightIdx
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const leftToPairColor: Record<number, number> = {};
  let pairColorIdx = 0;
  Object.keys(pairs).forEach((k) => {
    leftToPairColor[parseInt(k)] = pairColorIdx++;
  });

  const rightToPairColor: Record<number, number> = {};
  Object.entries(pairs).forEach(([lk, rv], colorI) => {
    rightToPairColor[rv as number] = colorI;
  });

  const pairedLeftIdxs = Object.keys(pairs).map(Number);
  const pairedRightIdxs = Object.values(pairs);
  const allPaired = pairedLeftIdxs.length === question.pairs.length;

  const handleLeftClick = (idx: number) => {
    if (submitted) return;
    if (selectedLeft === idx) {
      setSelectedLeft(null);
      return;
    }
    if (pairs[idx] !== undefined) {
      const newPairs = { ...pairs };
      delete newPairs[idx];
      setPairs(newPairs);
      setSelectedLeft(idx);
    } else {
      setSelectedLeft(idx);
    }
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (submitted) return;
    if (selectedLeft === null) {
      const existingLeft = Object.entries(pairs).find(([, ri]) => ri === shuffledIdx);
      if (existingLeft) {
        const newPairs = { ...pairs };
        delete newPairs[parseInt(existingLeft[0])];
        setPairs(newPairs);
      }
      return;
    }
    const newPairs = { ...pairs };
    const existingLeft = Object.entries(pairs).find(([, ri]) => ri === shuffledIdx);
    if (existingLeft) delete newPairs[parseInt(existingLeft[0])];
    newPairs[selectedLeft] = shuffledIdx;
    setPairs(newPairs);
    setSelectedLeft(null);
  };

  const submit = () => {
    const isCorrect = question.pairs.every((pair, leftIdx) => {
      const sIdx = pairs[leftIdx];
      return sIdx !== undefined && shuffledRight[sIdx].origIdx === leftIdx;
    });
    setCorrect(isCorrect);
    setSubmitted(true);
    setTimeout(() => onAnswer(isCorrect), 2000);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
        <div className={`rounded-xl p-5 border text-center ${correct ? "bg-green-900/30 border-green-500/40" : "bg-red-900/30 border-red-500/40"}`}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="flex justify-center mb-3">
            {correct ? <CheckCircle className="w-12 h-12 text-green-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
          </motion.div>
          <h3 className={`text-xl font-bold mb-2 ${correct ? "text-green-400" : "text-red-400"}`}>
            {correct ? "All Pairs Correct!" : "Incorrect Matching!"}
          </h3>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
          {correct && (
            <motion.p className="text-green-400 font-bold mt-2 text-sm" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
              Move forward! +points earned!
            </motion.p>
          )}
        </div>
        <div className="bg-card/30 rounded-xl p-3 border border-border/20 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold mb-2">Correct matches:</p>
          {question.pairs.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-primary font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>
              <span className="text-foreground/80">{p.left}</span>
              <span className="text-muted-foreground mx-1">→</span>
              <span className="text-foreground/70">{p.right}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
        <p className="text-xs font-semibold text-foreground leading-snug">{question.instruction}</p>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-card/30 rounded-lg p-2">
        <Link className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
        <span>Click a left item, then click the matching right item to pair them. Click a paired item to undo.</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold text-center">Column A</p>
          {question.pairs.map((pair, leftIdx) => {
            const isPaired = pairs[leftIdx] !== undefined;
            const isSelected = selectedLeft === leftIdx;
            const colorI = isPaired ? Object.keys(pairs).indexOf(String(leftIdx)) : -1;
            const col = isPaired && colorI >= 0 ? PAIR_COLORS[colorI % PAIR_COLORS.length] : null;
            return (
              <motion.button
                key={leftIdx}
                onClick={() => handleLeftClick(leftIdx)}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left px-2 py-2 rounded-lg border text-xs font-medium transition-all"
                style={{
                  background: isSelected
                    ? "hsl(258 90% 25%)"
                    : col
                    ? col.bg
                    : "hsl(220 25% 18%)",
                  borderColor: isSelected
                    ? "hsl(258 90% 60%)"
                    : col
                    ? col.border
                    : "hsl(220 20% 28%)",
                  color: col ? col.text : isSelected ? "white" : "hsl(220 10% 75%)",
                  boxShadow: isSelected ? "0 0 0 2px hsl(258 90% 60% / 0.4)" : undefined,
                }}
              >
                <span className="font-bold mr-1">{String.fromCharCode(65 + leftIdx)}.</span>
                {pair.left}
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold text-center">Column B</p>
          {shuffledRight.map((item, shuffledIdx) => {
            const isPaired = pairedRightIdxs.includes(shuffledIdx);
            const colorI = isPaired ? Object.values(pairs).indexOf(shuffledIdx) : -1;
            const col = isPaired && colorI >= 0 ? PAIR_COLORS[colorI % PAIR_COLORS.length] : null;
            return (
              <motion.button
                key={shuffledIdx}
                onClick={() => handleRightClick(shuffledIdx)}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left px-2 py-2 rounded-lg border text-xs font-medium transition-all"
                style={{
                  background: col ? col.bg : selectedLeft !== null ? "hsl(220 25% 22%)" : "hsl(220 25% 18%)",
                  borderColor: col ? col.border : selectedLeft !== null ? "hsl(258 50% 40%)" : "hsl(220 20% 28%)",
                  color: col ? col.text : "hsl(220 10% 75%)",
                }}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {pairedLeftIdxs.length}/{question.pairs.length} matched
        </p>
        <motion.button
          onClick={submit}
          disabled={!allPaired}
          whileHover={allPaired ? { scale: 1.02 } : {}}
          whileTap={allPaired ? { scale: 0.98 } : {}}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: allPaired
              ? "linear-gradient(135deg, hsl(142 70% 35%), hsl(142 70% 28%))"
              : "hsl(220 25% 25%)",
          }}
        >
          {allPaired ? "Submit Matches ✓" : "Match all pairs first"}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function QuestionModal({
  text,
  questionIndex,
  diceValue,
  onAnswer,
  level,
  playerName,
}: QuestionModalProps) {
  const [phase, setPhase] = useState<"reading" | "question">("reading");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT[level as 1 | 2 | 3] ?? 45);
  const timedOut = useRef(false);

  const timeLimit = TIME_LIMIT[level as 1 | 2 | 3] ?? 45;
  const isLevel3 = level === 3;

  const question = text?.questions[questionIndex % text.questions.length] ?? null;
  const isMatching = question && "type" in question && question.type === "matching";

  useEffect(() => {
    setPhase("reading");
    setTimeLeft(timeLimit);
    timedOut.current = false;
  }, [text?.id, questionIndex, timeLimit]);

  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft <= 0) {
      if (!timedOut.current) {
        timedOut.current = true;
        onAnswer(false);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, onAnswer]);

  const startQuestion = () => {
    setPhase("question");
    setTimeLeft(timeLimit);
  };

  if (!text || !question) return null;

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor =
    timeLeft > timeLimit * 0.5 ? "#22C55E" : timeLeft > timeLimit * 0.25 ? "#F59E0B" : "#EF4444";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border/50 shadow-2xl"
          style={{ background: isLevel3 ? "linear-gradient(135deg, hsl(270 25% 12%), hsl(270 30% 9%))" : "linear-gradient(135deg, hsl(220 25% 15%), hsl(220 30% 12%))" }}
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: isLevel3 ? "hsl(270 70% 30%)" : "hsl(258 70% 25%)" }}
                >
                  {isLevel3 ? <Shuffle className="w-4 h-4 text-purple-300" /> : <BookOpen className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {playerName} rolled a {diceValue}!
                    {isLevel3 && <span className="ml-1 text-purple-400 font-bold">⚡ LEVEL 3</span>}
                  </p>
                  <h3 className="font-bold text-foreground leading-tight">{text.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border/30">
                <span className="text-lg font-mono font-bold">🎲 {diceValue}</span>
              </div>
            </div>

            {phase === "question" && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span style={{ color: timerColor }} className="font-bold font-mono">{timeLeft}s</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Level {level} • {isMatching ? "matching" : (question as Question).difficulty}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${timerPercent}%`, background: timerColor }}
                    animate={{ width: `${timerPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            {phase === "reading" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div
                  className="border rounded-xl p-4"
                  style={{
                    background: isLevel3 ? "hsl(270 20% 14%)" : "hsl(220 25% 17%)",
                    borderColor: isLevel3 ? "hsl(270 30% 28%)" : "hsl(220 20% 28%)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: isLevel3 ? "hsl(270 60% 70%)" : "hsl(220 20% 60%)" }}>
                    Read carefully — matching question follows:
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{text.content}</p>
                </div>
                <motion.button
                  onClick={startQuestion}
                  className="w-full py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{
                    background: isLevel3
                      ? "linear-gradient(135deg, hsl(270 80% 50%), hsl(270 80% 40%))"
                      : "linear-gradient(135deg, hsl(258 90% 60%), hsl(258 90% 50%))",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLevel3 ? "Ready to Match — Show Question" : "I'm Ready — Show Question"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {phase === "question" && isMatching && (
              <MatchingSection
                key={question.id}
                question={question as MatchingQuestion}
                onAnswer={(c) => {
                  timedOut.current = true;
                  onAnswer(c);
                }}
              />
            )}

            {phase === "question" && !isMatching && (
              <MCQSection
                question={question as Question}
                onAnswer={(c) => {
                  timedOut.current = true;
                  onAnswer(c);
                }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

