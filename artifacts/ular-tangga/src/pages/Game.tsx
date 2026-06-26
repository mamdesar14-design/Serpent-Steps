import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/lib/socket";
import { EXPLANATION_TEXTS, getRandomText, ExplanationText } from "@/lib/gameData";
import Board from "@/components/Board";
import Dice from "@/components/Dice";
import QuestionModal from "@/components/QuestionModal";
import PlayerPanel from "@/components/PlayerPanel";
import { Copy, Play, Home as HomeIcon, Trophy, ArrowLeft, Share2 } from "lucide-react";

type Player = {
  id: string;
  name: string;
  position: number;
  score: number;
  color: string;
  bonusRolls: number;
  isConnected?: boolean;
};

type GameState = {
  roomCode: string;
  level: number;
  status: "waiting" | "playing" | "finished";
  players: Player[];
  currentPlayerIndex: number;
  winnerId: string | null;
  hostId: string;
  awaitingAnswer: boolean;
  pendingDiceValue: number | null;
  lastEvent: string | null;
};

export default function Game() {
  const params = useParams<{ roomCode: string }>();
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchStr);
  const myPlayerId = searchParams.get("playerId");
  const level = parseInt(searchParams.get("level") || "1");
  const isSolo = searchParams.get("solo") === "1";

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentText, setCurrentText] = useState<ExplanationText | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(null);
  const [animationPath, setAnimationPath] = useState<number[]>([]);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const usedTextIds = useRef<string[]>([]);
  const socketRef = useRef(getSocket());

  const roomCode = params.roomCode;
  const socket = socketRef.current;

  const myPlayer = gameState?.players.find((p) => p.id === myPlayerId);
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex ?? 0];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isHost = gameState?.hostId === myPlayerId;

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_room", { roomCode, playerId: myPlayerId });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("game_state", (state: GameState) => {
      setGameState(state);
      if (state.awaitingAnswer && state.pendingDiceValue !== null) {
        const currentP = state.players[state.currentPlayerIndex];
        if (currentP?.id === myPlayerId) {
          setDiceValue(state.pendingDiceValue);
          const text = getRandomText(state.level, usedTextIds.current);
          setCurrentText(text);
          setQuestionIdx(Math.floor(Math.random() * text.questions.length));
          setShowQuestion(true);
        }
      }
    });

    socket.on("game_started", (state: GameState) => {
      setGameState(state);
    });

    socket.on("dice_rolled", ({ game, playerId, diceValue: dv }: { game: GameState; playerId: string; diceValue: number }) => {
      setGameState(game);
      setDiceValue(dv);
      setRolling(false);
      if (playerId === myPlayerId) {
        const text = getRandomText(game.level, usedTextIds.current);
        setCurrentText(text);
        setQuestionIdx(Math.floor(Math.random() * text.questions.length));
        setShowQuestion(true);
      }
    });

    socket.on("move_result", ({ game, playerId, moved, newPosition, event, reward }: any) => {
      setGameState(game);
      setShowQuestion(false);

      if (moved) {
        setAnimatingPlayerId(playerId);
        const prevPos = gameState?.players.find((p) => p.id === playerId)?.position ?? 0;
        const path: number[] = [];
        for (let i = prevPos + 1; i <= newPosition; i++) path.push(i);
        setAnimationPath(path);

        if (reward?.description) {
          setRewardMsg(reward.description);
          setTimeout(() => setRewardMsg(null), 3000);
        }

        setTimeout(() => {
          setAnimatingPlayerId(null);
          setAnimationPath([]);
        }, path.length * 200 + 500);
      }
    });

    socket.on("game_over", ({ game }: { game: GameState }) => {
      setGameState(game);
    });

    if (socket.connected) {
      setConnected(true);
      socket.emit("join_room", { roomCode, playerId: myPlayerId });
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("game_state");
      socket.off("game_started");
      socket.off("dice_rolled");
      socket.off("move_result");
      socket.off("game_over");
    };
  }, [roomCode, myPlayerId]);

  const rollDice = useCallback(() => {
    if (!isMyTurn || rolling || showQuestion || gameState?.status !== "playing") return;
    const val = Math.floor(Math.random() * 6) + 1;
    setRolling(true);
    setDiceValue(null);
    setTimeout(() => {
      setRolling(false);
      setDiceValue(val);
      socket.emit("roll_dice", { roomCode, playerId: myPlayerId, diceValue: val });
    }, 1200);
  }, [isMyTurn, rolling, showQuestion, gameState, roomCode, myPlayerId, socket]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      setShowQuestion(false);
      if (currentText) {
        usedTextIds.current = [...usedTextIds.current.slice(-9), currentText.id];
      }
      socket.emit("submit_answer", {
        roomCode,
        playerId: myPlayerId,
        correct,
        diceValue: diceValue ?? 1,
      });
    },
    [roomCode, myPlayerId, diceValue, currentText, socket],
  );

  const startGame = () => {
    socket.emit("start_game", { roomCode });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const winner = gameState?.players.find((p) => p.id === gameState.winnerId);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground text-sm">Connecting to game...</p>
        </div>
      </div>
    );
  }

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

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Level {level}</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 text-xs font-mono font-bold hover:border-primary/40 transition-all"
          >
            {copied ? (
              <span className="text-green-400">Copied!</span>
            ) : (
              <>
                <span className="text-foreground tracking-wider">{roomCode}</span>
                <Copy className="w-3 h-3 text-muted-foreground" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}
          />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-3 md:p-4 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-start">
          {gameState.status === "waiting" && (
            <motion.div
              className="w-full max-w-md mb-4 bg-card/60 border border-border/40 rounded-2xl p-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-bold text-lg text-center mb-1">Waiting for players...</h2>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Share the room code with friends
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center mb-4">
                <p className="text-3xl font-black font-mono tracking-[0.3em] text-primary">
                  {roomCode}
                </p>
              </div>
              <div className="text-sm text-muted-foreground text-center mb-4">
                {gameState.players.length} / 5 players joined
              </div>
              {isHost && (
                <button
                  onClick={startGame}
                  disabled={gameState.players.length < 1}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                >
                  <Play className="w-4 h-4" />
                  Start Game ({gameState.players.length} player{gameState.players.length !== 1 ? "s" : ""})
                </button>
              )}
              {!isHost && (
                <p className="text-center text-sm text-muted-foreground">
                  Waiting for host to start...
                </p>
              )}
            </motion.div>
          )}

          <div
            className="rounded-2xl border border-border/30 overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(220 30% 13%), hsl(220 25% 11%))",
            }}
          >
            <Board
              players={gameState.players}
              level={level}
              animatingPlayerId={animatingPlayerId}
              animationPath={animationPath}
            />
          </div>

          {gameState.status === "playing" && (
            <motion.div
              className="mt-4 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isMyTurn && !showQuestion && (
                <motion.p
                  className="text-sm font-bold text-primary"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Your turn! Roll the dice.
                </motion.p>
              )}
              {!isMyTurn && (
                <p className="text-sm text-muted-foreground">
                  {currentPlayer?.name}'s turn...
                </p>
              )}
              <Dice
                value={diceValue}
                rolling={rolling}
                onRoll={rollDice}
                disabled={!isMyTurn || gameState.status !== "playing"}
                canRoll={isMyTurn && !showQuestion && !rolling}
              />
            </motion.div>
          )}
        </div>

        <div className="w-56 md:w-64 shrink-0 flex flex-col gap-3 overflow-y-auto">
          <PlayerPanel
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            myPlayerId={myPlayerId}
            lastEvent={gameState.lastEvent}
          />

          <div className="bg-card/40 border border-border/30 rounded-xl p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-2">Legend</p>
            <div className="flex items-center gap-2"><span>🐍</span><span>Snake — slide down</span></div>
            <div className="flex items-center gap-2"><span>🪜</span><span>Ladder — climb up</span></div>
            {level === 2 && (
              <>
                <div className="flex items-center gap-2"><span>🎭</span><span>Surprise trap!</span></div>
                <div className="flex items-center gap-2"><span>🎲</span><span>Bonus roll!</span></div>
              </>
            )}
            <div className="flex items-center gap-2"><span>🏆</span><span>Square 100 = Win!</span></div>
          </div>
        </div>
      </div>

      {showQuestion && currentText && isMyTurn && (
        <QuestionModal
          text={currentText}
          questionIndex={questionIdx}
          diceValue={diceValue ?? 1}
          onAnswer={handleAnswer}
          level={level}
          playerName={myPlayer?.name ?? "Player"}
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
        {gameState.status === "finished" && winner && (
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
                <h2 className="text-2xl font-black text-foreground mb-1">
                  {winner.id === myPlayerId ? "You Win!" : `${winner.name} Wins!`}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Reached square 100!
                </p>

                <div className="bg-card/50 rounded-xl p-3 mb-6 text-sm">
                  <div className="font-bold text-foreground mb-2">Final Scores</div>
                  {[...gameState.players]
                    .sort((a, b) => b.score - a.score)
                    .map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">#{i + 1}</span>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: p.color }}
                          />
                          <span className={p.id === myPlayerId ? "text-primary font-bold" : "text-foreground"}>
                            {p.name}
                          </span>
                        </div>
                        <span className="font-bold">{p.score} pts</span>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setLocation("/")}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                >
                  <HomeIcon className="w-4 h-4" />
                  Back to Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
