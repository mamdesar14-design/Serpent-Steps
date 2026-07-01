import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/lib/socket";
import {
  getRandomText, getRandomLevel3Text, ExplanationText, Level3ExplanationText,
  SNAKES_LEVEL1, LADDERS_LEVEL1, SNAKES_LEVEL2, LADDERS_LEVEL2, SNAKES_LEVEL3, LADDERS_LEVEL3,
} from "@/lib/gameData";
import Board from "@/components/Board";
import Dice from "@/components/Dice";
import QuestionModal from "@/components/QuestionModal";
import PlayerPanel from "@/components/PlayerPanel";
import Confetti from "@/components/Confetti";
import GameBackground from "@/components/GameBackground";
import { sounds } from "@/lib/sounds";
import { checkAndUnlock, Badge } from "@/lib/achievements";
import { Copy, Play, Trophy, ArrowLeft, LogOut, Home as HomeIcon, RotateCcw, Volume2, VolumeX, Send, MessageSquare, Clock3 } from "lucide-react";

type AnyText = ExplanationText | Level3ExplanationText;

type Player = {
  id: string;
  name: string;
  position: number;
  score: number;
  color: string;
  bonusRolls: number;
  streak?: number;
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
  const [currentText, setCurrentText] = useState<AnyText | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(null);
  const [animationPath, setAnimationPath] = useState<number[]>([]);
  const [boardEvent, setBoardEvent] = useState<import("@/components/Board").TokenBoardEvent>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [emojiReactions, setEmojiReactions] = useState<Array<{ id: number; playerId: string; name: string; emoji: string }>>([]);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; playerId: string; playerName: string; text: string; color: string; ts: number }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [turnLog, setTurnLog] = useState<Array<{ id: number; icon: string; text: string; ts: number }>>([]);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "history">("history");
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [mySnakesHit, setMySnakesHit] = useState(0);
  const [myWrongAnswers, setMyWrongAnswers] = useState(0);
  const usedTextIds = useRef<string[]>([]);
  const questionShownRef = useRef(false);
  const emojiIdRef = useRef(0);
  const msgIdRef = useRef(0);
  const logIdRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef(getSocket());

  const roomCode = params.roomCode;
  const socket = socketRef.current;

  const myPlayer = gameState?.players.find((p) => p.id === myPlayerId);
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex ?? 0];
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const isHost = gameState?.hostId === myPlayerId;

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      socket.emit("join_room", { roomCode, playerId: myPlayerId });
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onGameState(state: GameState) {
      setGameState(state);
      if (state.awaitingAnswer && state.pendingDiceValue !== null && !questionShownRef.current) {
        const currentP = state.players[state.currentPlayerIndex];
        if (currentP?.id === myPlayerId) {
          setDiceValue(state.pendingDiceValue);
          const text = state.level === 3
            ? getRandomLevel3Text(usedTextIds.current)
            : getRandomText(state.level, usedTextIds.current);
          setCurrentText(text);
          setQuestionIdx(Math.floor(Math.random() * text.questions.length));
          questionShownRef.current = true;
          setShowQuestion(true);
        }
      }
    }
    function onGameStarted(state: GameState) {
      setGameState(state);
    }
    function onPlayerJoined({ game }: { game: GameState; playerId: string }) {
      setGameState(game);
    }
    function onPlayerDisconnected({ game }: { game: GameState; playerId: string }) {
      setGameState(game);
    }
    function onDiceRolled({ game, playerId, diceValue: dv }: { game: GameState; playerId: string; diceValue: number }) {
      setGameState(game);
      setDiceValue(dv);
      setRolling(false);
      if (playerId === myPlayerId && !questionShownRef.current) {
        const text = game.level === 3
          ? getRandomLevel3Text(usedTextIds.current)
          : getRandomText(game.level, usedTextIds.current);
        setCurrentText(text);
        setQuestionIdx(Math.floor(Math.random() * text.questions.length));
        questionShownRef.current = true;
        setShowQuestion(true);
      }
    }
    function onMoveResult({ game, playerId, moved, newPosition, reward, streakBonus, correct }: any) {
      setGameState(game);
      questionShownRef.current = false;
      setShowQuestion(false);

      // Track stats for achievements
      if (playerId === myPlayerId) {
        if (correct === false) setMyWrongAnswers(p => p + 1);
        if (game.lastEvent?.includes("slid") || game.lastEvent?.includes("Snake")) setMySnakesHit(p => p + 1);
      }

      const isSnakeEvt = game.lastEvent?.includes("slid") || game.lastEvent?.includes("Snake");
      const isLadderEvt = game.lastEvent?.includes("Ladder") || game.lastEvent?.includes("climbed");

      if (correct === false) sounds.wrong();
      else if (moved) {
        if (!isSnakeEvt && !isLadderEvt) sounds.correct();
        // snake/ladder sounds are now played by Board after the walk animation
      } else {
        sounds.correct();
      }

      // Add to turn log
      const logIcon = !correct ? "❌" : isSnakeEvt ? "🐍" : isLadderEvt ? "🪜" : "✅";
      const logText = game.lastEvent ?? (correct ? `Moved to ${newPosition}` : "Stayed in place");
      setTurnLog(prev => [...prev.slice(-29), { id: ++logIdRef.current, icon: logIcon, text: logText, ts: Date.now() }]);

      if (streakBonus > 0 && playerId === myPlayerId) {
        const streakNum = game.players.find((p: any) => p.id === playerId)?.streak ?? 0;
        setStreakMsg(`🔥 ${streakNum} streak! +${streakBonus} bonus pts`);
        sounds.streak();
        setTimeout(() => setStreakMsg(null), 3000);
      }

      if (moved) {
        const prevPos = gameState?.players.find((p) => p.id === playerId)?.position ?? 0;

        // Detect snake/ladder trigger square to split walk path from teleport animation
        const snakesMap: Record<number, number> =
          level === 3 ? SNAKES_LEVEL3 : level === 2 ? SNAKES_LEVEL2 : SNAKES_LEVEL1;
        const laddersMap: Record<number, number | { to: number; reward: { type: string } }> =
          level === 3 ? LADDERS_LEVEL3 : level === 2 ? LADDERS_LEVEL2 : LADDERS_LEVEL1;

        let walkEnd = newPosition;
        let evt: import("@/components/Board").TokenBoardEvent = null;

        if (isSnakeEvt) {
          for (const [from, to] of Object.entries(snakesMap)) {
            if ((to as number) === newPosition && parseInt(from) > prevPos) {
              walkEnd = parseInt(from);
              evt = { type: "snake", from: parseInt(from), to: newPosition };
              break;
            }
          }
        } else if (isLadderEvt) {
          for (const [from, val] of Object.entries(laddersMap)) {
            const dest = typeof val === "number" ? val : (val as { to: number }).to;
            if (dest === newPosition && parseInt(from) > prevPos) {
              walkEnd = parseInt(from);
              evt = { type: "ladder", from: parseInt(from), to: newPosition };
              break;
            }
          }
        }

        const path: number[] = [];
        for (let i = prevPos + 1; i <= walkEnd; i++) path.push(i);

        setAnimatingPlayerId(playerId);
        setAnimationPath(path);
        setBoardEvent(evt);
        setAnimationKey(k => k + 1);

        if (reward?.description) {
          setRewardMsg(reward.description);
          setTimeout(() => setRewardMsg(null), 3000);
        }

        const eventTime = evt ? 1100 : 0;
        setTimeout(() => {
          setAnimatingPlayerId(null);
          setAnimationPath([]);
          setBoardEvent(null);
        }, path.length * 175 + eventTime + 400);
      }
    }
    function onGameOver({ game }: { game: GameState }) {
      setGameState(game);
      sounds.win();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      // Check achievements
      const me = game.players.find(p => p.id === myPlayerId);
      if (me) {
        const won = game.winnerId === myPlayerId;
        setMySnakesHit(prev => {
          setMyWrongAnswers(prevW => {
            const total = me.score > 0 ? (me.score / 10) + prevW : prevW;
            const acc = total > 0 ? Math.round(((total - prevW) / total) * 100) : 100;
            const earned = checkAndUnlock({ won, level, streak: me.streak ?? 0, snakesHit: prev, accuracy: acc });
            if (earned.length > 0) {
              setNewBadges(earned);
              setTimeout(() => setNewBadges([]), 6000);
            }
            return prevW;
          });
          return prev;
        });
      }
    }
    function onChatMessage(msg: { playerId: string; playerName: string; text: string; color: string; ts: number }) {
      const id = ++msgIdRef.current;
      setChatMessages(prev => [...prev.slice(-49), { id, ...msg }]);
      setSidebarTab("chat");
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
    function onEmojiReact({ playerId, emoji }: { playerId: string; emoji: string }) {
      const player = gameState?.players.find(p => p.id === playerId);
      const name = player?.name ?? "Player";
      sounds.emoji();
      const id = ++emojiIdRef.current;
      setEmojiReactions(prev => [...prev, { id, playerId, name, emoji }]);
      setTimeout(() => setEmojiReactions(prev => prev.filter(r => r.id !== id)), 3000);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("game_state", onGameState);
    socket.on("game_started", onGameStarted);
    socket.on("player_joined", onPlayerJoined);
    socket.on("player_disconnected", onPlayerDisconnected);
    socket.on("dice_rolled", onDiceRolled);
    socket.on("move_result", onMoveResult);
    socket.on("game_over", onGameOver);
    socket.on("emoji_react", onEmojiReact);
    socket.on("chat_message", onChatMessage);

    if (socket.connected) {
      setConnected(true);
      socket.emit("join_room", { roomCode, playerId: myPlayerId });
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("game_state", onGameState);
      socket.off("game_started", onGameStarted);
      socket.off("player_joined", onPlayerJoined);
      socket.off("player_disconnected", onPlayerDisconnected);
      socket.off("dice_rolled", onDiceRolled);
      socket.off("move_result", onMoveResult);
      socket.off("game_over", onGameOver);
      socket.off("emoji_react", onEmojiReact);
      socket.off("chat_message", onChatMessage);
    };
  }, [roomCode, myPlayerId]);

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text || !myPlayerId || !myPlayer) return;
    socket.emit("chat_message", { roomCode, playerId: myPlayerId, playerName: myPlayer.name, text, color: myPlayer.color });
    setChatInput("");
  }, [chatInput, myPlayerId, myPlayer, socket, roomCode]);

  const rollDice = useCallback(() => {
    if (!isMyTurn || rolling || showQuestion || gameState?.status !== "playing") return;
    const val = Math.floor(Math.random() * 6) + 1;
    setRolling(true);
    setDiceValue(null);
    sounds.dice();
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
      <GameBackground />
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
          <button
            onClick={() => { const m = !muted; setMuted(m); sounds.setMuted(m); }}
            className="p-1.5 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
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
              <button
                onClick={() => {
                  socket.emit("leave_room", { roomCode, playerId: myPlayerId });
                  setLocation("/");
                }}
                className="w-full mt-2 py-2.5 rounded-xl border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/50 flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Leave Room
              </button>
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
              boardEvent={boardEvent}
              animationKey={animationKey}
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

          {gameState.status === "playing" && gameState.players.length > 1 && (
            <div className="bg-card/40 border border-border/30 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">React</p>
              <div className="flex gap-1.5 flex-wrap">
                {["🔥", "👏", "😂", "😱", "💪"].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      socket.emit("emoji_react", { roomCode, playerId: myPlayerId, emoji });
                      sounds.emoji();
                    }}
                    className="text-xl hover:scale-125 transition-transform active:scale-95 p-1 rounded-lg hover:bg-muted/40"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card/40 border border-border/30 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: 180, maxHeight: 240 }}>
            <div className="flex border-b border-border/30">
              {[
                { key: "history", icon: <Clock3 className="w-3 h-3" />, label: "Log" },
                { key: "chat", icon: <MessageSquare className="w-3 h-3" />, label: "Chat" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSidebarTab(tab.key as "chat" | "history")}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors ${sidebarTab === tab.key ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            {sidebarTab === "history" && (
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {turnLog.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No turns yet</p>
                )}
                {[...turnLog].reverse().map(entry => (
                  <div key={entry.id} className="flex items-start gap-1.5 text-xs">
                    <span className="shrink-0">{entry.icon}</span>
                    <span className="text-muted-foreground leading-snug">{entry.text}</span>
                  </div>
                ))}
              </div>
            )}

            {sidebarTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {chatMessages.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No messages yet</p>
                  )}
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-xs">
                      <span className="font-bold" style={{ color: msg.color }}>{msg.playerName}: </span>
                      <span className="text-foreground/80 break-all">{msg.text}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                {gameState.status === "playing" && (
                  <div className="p-1.5 border-t border-border/30 flex gap-1">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendChat()}
                      placeholder="Type..."
                      maxLength={100}
                      className="flex-1 bg-card/50 border border-border/30 rounded-lg px-2 py-1.5 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/50"
                    />
                    <button
                      onClick={sendChat}
                      disabled={!chatInput.trim()}
                      className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
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

      <AnimatePresence>
        {emojiReactions.map(r => (
          <motion.div
            key={r.id}
            className="fixed bottom-24 left-1/2 z-40 pointer-events-none"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -60, scale: 1.4 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">{r.emoji}</span>
              <span className="text-xs text-white/80 font-bold bg-black/50 rounded px-1">{r.name}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Confetti active={showConfetti} />

      <AnimatePresence>
        {newBadges.length > 0 && (
          <motion.div
            className="fixed top-16 right-4 z-50 space-y-2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
          >
            {newBadges.map(b => (
              <motion.div
                key={b.id}
                className="flex items-center gap-2 bg-card/95 border border-yellow-500/40 rounded-xl px-4 py-2.5 shadow-xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className="text-xs font-black text-yellow-400">Badge Unlocked!</p>
                  <p className="text-xs font-bold text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </div>
              </motion.div>
            ))}
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

                {newBadges.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    <p className="text-xs font-black text-yellow-400 uppercase tracking-wider">🏅 Badges Earned!</p>
                    {newBadges.map(b => (
                      <div key={b.id} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
                        <span className="text-xl">{b.emoji}</span>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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

                <div className="flex gap-2">
                  {isHost && (
                    <button
                      onClick={() => socket.emit("rematch", { roomCode })}
                      className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                      style={{ background: "linear-gradient(135deg, hsl(142 70% 40%), hsl(142 70% 30%))" }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Rematch
                    </button>
                  )}
                  {!isHost && (
                    <div className="flex-1 py-3 rounded-xl border border-border/40 text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: "2s" }} />
                      Waiting for host...
                    </div>
                  )}
                  <button
                    onClick={() => setLocation("/")}
                    className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                  >
                    <HomeIcon className="w-4 h-4" />
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
