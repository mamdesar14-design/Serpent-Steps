import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExplanationText, Question } from "@/lib/gameData";
import { CheckCircle, XCircle, Clock, BookOpen, ChevronRight } from "lucide-react";

type QuestionModalProps = {
  text: ExplanationText | null;
  questionIndex: number;
  diceValue: number;
  onAnswer: (correct: boolean) => void;
  level: number;
  playerName: string;
};

const TIME_LIMIT_LEVEL1 = 45;
const TIME_LIMIT_LEVEL2 = 30;

export default function QuestionModal({
  text,
  questionIndex,
  diceValue,
  onAnswer,
  level,
  playerName,
}: QuestionModalProps) {
  const [phase, setPhase] = useState<"reading" | "question" | "result">("reading");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(level === 1 ? TIME_LIMIT_LEVEL1 : TIME_LIMIT_LEVEL2);
  const [showText, setShowText] = useState(true);

  const question: Question | null = text?.questions[questionIndex % text.questions.length] ?? null;
  const timeLimit = level === 1 ? TIME_LIMIT_LEVEL1 : TIME_LIMIT_LEVEL2;

  useEffect(() => {
    setPhase("reading");
    setSelectedAnswer(null);
    setShowText(true);
    setTimeLeft(timeLimit);
  }, [text?.id, questionIndex, timeLimit]);

  useEffect(() => {
    if (phase !== "question") return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (phase !== "question" || selectedAnswer !== null) return;
      setSelectedAnswer(idx);
      setPhase("result");
      const correct = idx === question?.correct;
      setTimeout(() => {
        onAnswer(correct);
      }, 1800);
    },
    [phase, selectedAnswer, question, onAnswer],
  );

  const startQuestion = () => {
    setPhase("question");
    setTimeLeft(timeLimit);
  };

  if (!text || !question) return null;

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerColor =
    timeLeft > timeLimit * 0.5
      ? "#22C55E"
      : timeLeft > timeLimit * 0.25
      ? "#F59E0B"
      : "#EF4444";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(220 25% 15%), hsl(220 30% 12%))",
          }}
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="p-5 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {playerName} rolled a {diceValue}!
                  </p>
                  <h3 className="font-bold text-foreground leading-tight">{text.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border/30">
                <span className="text-lg font-mono font-bold" style={{ color: timerColor }}>
                  🎲 {diceValue}
                </span>
              </div>
            </div>

            {phase === "question" && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span style={{ color: timerColor }} className="font-bold font-mono">
                      {timeLeft}s
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Level {level} • {question.difficulty}
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full transition-all"
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card/40 border border-border/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
                    Read the following text:
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{text.content}</p>
                </div>
                <motion.button
                  onClick={startQuestion}
                  className="w-full py-3 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(258 90% 60%), hsl(258 90% 50%))" }}
                  whileHover={{ scale: 1.02, brightness: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  I'm Ready — Show Question
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {phase === "question" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {question.question}
                  </p>
                </div>

                <div className="grid gap-2.5">
                  {question.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3"
                      style={{
                        background: "hsl(220 25% 18%)",
                        borderColor: "hsl(220 20% 28%)",
                      }}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div
                  className={`rounded-xl p-5 border text-center ${
                    selectedAnswer === question.correct
                      ? "bg-green-900/30 border-green-500/40"
                      : "bg-red-900/30 border-red-500/40"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 300 }}
                    className="flex justify-center mb-3"
                  >
                    {selectedAnswer === question.correct ? (
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-400" />
                    )}
                  </motion.div>
                  <h3
                    className={`text-xl font-bold mb-1 ${
                      selectedAnswer === question.correct ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {selectedAnswer === question.correct ? "Correct!" : selectedAnswer === -1 ? "Time's Up!" : "Incorrect!"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>

                  {selectedAnswer === question.correct && (
                    <motion.p
                      className="text-green-400 font-bold mt-2 text-sm"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      Move forward {diceValue} squares! +{diceValue * 10} points
                    </motion.p>
                  )}
                  {selectedAnswer !== question.correct && (
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
