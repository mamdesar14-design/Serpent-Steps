import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Users, LogIn, Plus, Gamepad2, Info } from "lucide-react";

const COLOR_PALETTE = [
  "#EF4444", "#F97316", "#F59E0B", "#10B981",
  "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4",
  "#84CC16", "#A78BFA",
];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
        Token Color
      </label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
            style={{
              background: c,
              borderColor: value === c ? "white" : "transparent",
              boxShadow: value === c ? `0 0 0 3px ${c}60` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"menu" | "create" | "join" | "solo">("menu");
  const [hostName, setHostName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [level, setLevel] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  useEffect(() => {
    const saved = localStorage.getItem("ular_tangga_color");
    if (saved && COLOR_PALETTE.includes(saved)) setSelectedColor(saved);
  }, []);

  function saveColor(c: string) {
    setSelectedColor(c);
    localStorage.setItem("ular_tangga_color", c);
  }

  async function createGame() {
    if (!hostName.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: hostName.trim(), level, color: selectedColor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLocation(`/game/${data.roomCode}?playerId=${data.players[0].id}&level=${level}`);
    } catch (e: any) {
      setError(e.message || "Failed to create game");
    } finally {
      setLoading(false);
    }
  }

  async function joinGame() {
    if (!playerName.trim()) { setError("Please enter your name"); return; }
    if (!roomCode.trim()) { setError("Please enter room code"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/games/${roomCode.trim().toUpperCase()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim(), color: selectedColor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const gameRes = await fetch(`/api/games/${data.roomCode}`);
      const game = await gameRes.json();
      setLocation(`/game/${data.roomCode}?playerId=${data.playerId}&level=${game.level}`);
    } catch (e: any) {
      setError(e.message || "Failed to join game");
    } finally {
      setLoading(false);
    }
  }

  function startSolo() {
    if (!playerName.trim()) { setError("Please enter your name"); return; }
    setLocation(`/solo?name=${encodeURIComponent(playerName.trim())}&level=${level}&color=${encodeURIComponent(selectedColor)}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13) % 100}%`,
              opacity: 0.06,
            }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          >
            {["🐍", "🪜", "🎲", "📚", "⭐", "🏆"][i % 6]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(258 90% 50%), hsl(196 80% 45%))" }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-4xl">🐍</span>
          </motion.div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Snake & Ladder
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            English Explanation Text Challenge
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>Up to 5 players</span>
            </div>
            <div className="w-px h-4 bg-border/50" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Online multiplayer</span>
            </div>
          </div>
        </div>

        <div className="bg-card/60 border border-border/40 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {mode === "menu" && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <button
                  onClick={() => setMode("create")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                >
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <div>Create New Game</div>
                    <div className="text-xs font-normal opacity-80">Host a room for up to 5 players</div>
                  </div>
                </button>

                <button
                  onClick={() => setMode("join")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold border border-border/50 text-foreground transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-primary/50"
                  style={{ background: "hsl(220 25% 18%)" }}
                >
                  <LogIn className="w-5 h-5" />
                  <div className="text-left">
                    <div>Join Game</div>
                    <div className="text-xs font-normal text-muted-foreground">Enter a room code</div>
                  </div>
                </button>

                <button
                  onClick={() => setMode("solo")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold border border-border/40 text-muted-foreground transition-all hover:scale-[1.02] active:scale-[0.98] hover:text-foreground"
                  style={{ background: "hsl(220 25% 16%)" }}
                >
                  <Gamepad2 className="w-5 h-5" />
                  <div className="text-left">
                    <div>Solo Practice</div>
                    <div className="text-xs font-normal">Play alone to practice</div>
                  </div>
                </button>

                <div className="pt-3 border-t border-border/30">
                  <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl p-3">
                    <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Answer English explanation text questions to move your piece. 
                      Correct = roll dice moves you forward. Wrong = stay in place!
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-bold text-foreground">Create a Game Room</h2>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    value={hostName}
                    onChange={(e) => { setHostName(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && createGame()}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-foreground placeholder-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 1, label: "Level 1", desc: "MCQ • 45s timer • 10 snakes", emoji: "🟢" },
                      { val: 2, label: "Level 2", desc: "Hard MCQ • 30s • 14 snakes", emoji: "🟡" },
                      { val: 3, label: "Level 3", desc: "Matching • 90s • 17 snakes! ☠️", emoji: "🔴" },
                    ].map((l) => (
                      <button
                        key={l.val}
                        onClick={() => setLevel(l.val)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                          level === l.val
                            ? l.val === 3
                              ? "border-purple-500 bg-purple-500/15 text-foreground"
                              : "border-primary bg-primary/15 text-foreground"
                            : "border-border/40 text-muted-foreground hover:border-border"
                        }`}
                      >
                        <div className="font-bold mb-0.5">{l.emoji} {l.label}</div>
                        <div className="opacity-80 leading-tight">{l.desc}</div>
                      </button>
                    ))}
                  </div>
                  {level === 3 && (
                    <p className="text-xs text-purple-400 mt-2 font-medium">⚠️ Level 3: matching questions require you to pair concepts — extremely challenging!</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setMode("menu"); setError(""); }}
                    className="flex-1 py-2.5 rounded-xl border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={createGame}
                    disabled={loading}
                    className="flex-2 flex-grow-[2] py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(258 90% 45%))" }}
                  >
                    {loading ? "Creating..." : "Create Room"}
                  </button>
                </div>
              </motion.div>
            )}

            {mode === "join" && (
              <motion.div
                key="join"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-bold text-foreground">Join a Game Room</h2>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    value={playerName}
                    onChange={(e) => { setPlayerName(e.target.value); setError(""); }}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-foreground placeholder-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Room Code
                  </label>
                  <input
                    value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && joinGame()}
                    placeholder="e.g. ABC123"
                    maxLength={8}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-foreground placeholder-muted-foreground/50 text-sm font-mono tracking-widest focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setMode("menu"); setError(""); }}
                    className="flex-1 py-2.5 rounded-xl border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={joinGame}
                    disabled={loading}
                    className="flex-2 flex-grow-[2] py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, hsl(196 80% 45%), hsl(196 80% 35%))" }}
                  >
                    {loading ? "Joining..." : "Join Room"}
                  </button>
                </div>
              </motion.div>
            )}

            {mode === "solo" && (
              <motion.div
                key="solo"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-bold text-foreground">Solo Practice</h2>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    value={playerName}
                    onChange={(e) => { setPlayerName(e.target.value); setError(""); }}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-card/50 text-foreground placeholder-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 1, label: "Level 1", desc: "MCQ • 45s", emoji: "🟢" },
                      { val: 2, label: "Level 2", desc: "Hard MCQ • 30s", emoji: "🟡" },
                      { val: 3, label: "Level 3", desc: "Matching ☠️ • 90s", emoji: "🔴" },
                    ].map((l) => (
                      <button
                        key={l.val}
                        onClick={() => setLevel(l.val)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                          level === l.val
                            ? l.val === 3
                              ? "border-purple-500 bg-purple-500/15 text-foreground"
                              : "border-primary bg-primary/15 text-foreground"
                            : "border-border/40 text-muted-foreground hover:border-border"
                        }`}
                      >
                        <div className="font-bold mb-0.5">{l.emoji} {l.label}</div>
                        <div className="opacity-80 leading-tight">{l.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => { setMode("menu"); setError(""); }}
                    className="flex-1 py-2.5 rounded-xl border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={startSolo}
                    className="flex-2 flex-grow-[2] py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, hsl(142 70% 40%), hsl(142 70% 30%))" }}
                  >
                    Start Practice
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
