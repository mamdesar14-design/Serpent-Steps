import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Zap } from "lucide-react";

type Player = {
  id: string;
  name: string;
  position: number;
  score: number;
  color: string;
  bonusRolls: number;
  isConnected?: boolean;
};

type PlayerPanelProps = {
  players: Player[];
  currentPlayerIndex: number;
  myPlayerId: string | null;
  lastEvent: string | null;
};

export default function PlayerPanel({
  players,
  currentPlayerIndex,
  myPlayerId,
  lastEvent,
}: PlayerPanelProps) {
  const sorted = [...players].sort((a, b) => b.position - a.position || b.score - a.score);

  return (
    <div className="flex flex-col gap-3">
      {lastEvent && (
        <AnimatePresence mode="wait">
          <motion.div
            key={lastEvent}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-card/60 border border-border/40 rounded-xl p-3 text-sm text-foreground/90 text-center font-medium"
          >
            {lastEvent}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="space-y-2">
        {players.map((player, idx) => {
          const isCurrent = idx === currentPlayerIndex;
          const isMe = player.id === myPlayerId;
          const rank = sorted.findIndex((p) => p.id === player.id) + 1;

          return (
            <motion.div
              key={player.id}
              layout
              className={`relative rounded-xl border p-3 transition-all duration-300 overflow-hidden ${
                isCurrent
                  ? "border-primary/60 shadow-lg shadow-primary/10"
                  : "border-border/30"
              }`}
              style={{
                background: isCurrent
                  ? `linear-gradient(135deg, hsl(220 25% 18%), ${player.color}15)`
                  : "hsl(220 25% 17% / 0.7)",
              }}
              animate={isCurrent ? { scale: [1, 1.01, 1] } : { scale: 1 }}
              transition={{ duration: 2, repeat: isCurrent ? Infinity : 0 }}
            >
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `${player.color}08` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              <div className="relative flex items-center gap-3">
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold text-white shadow-md"
                    style={{ background: player.color, borderColor: isCurrent ? "white" : `${player.color}80` }}
                  >
                    {player.name[0].toUpperCase()}
                  </div>
                  {!player.isConnected && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                      {player.name}
                      {isMe && (
                        <span className="ml-1 text-xs text-primary/70 font-normal">(you)</span>
                      )}
                    </p>
                    {rank === 1 && players.length > 1 && (
                      <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    )}
                    {isCurrent && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Star className="w-3.5 h-3.5 text-primary shrink-0" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Sq.</span>
                      <span className="text-xs font-bold text-foreground">{player.position}</span>
                    </div>
                    <div className="w-px h-3 bg-border/50" />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Pts.</span>
                      <span className="text-xs font-bold text-foreground">{player.score}</span>
                    </div>
                    {player.bonusRolls > 0 && (
                      <>
                        <div className="w-px h-3 bg-border/50" />
                        <div className="flex items-center gap-1 text-blue-400">
                          <Zap className="w-3 h-3" />
                          <span className="text-xs font-bold">{player.bonusRolls}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: rank === 1 ? "#F59E0B30" : "hsl(220 25% 25%)",
                      color: rank === 1 ? "#F59E0B" : "hsl(220 15% 60%)",
                    }}
                  >
                    #{rank}
                  </div>
                </div>
              </div>

              {player.position > 0 && (
                <div className="mt-2.5 relative">
                  <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: player.color }}
                      animate={{ width: `${player.position}%` }}
                      transition={{ duration: 0.8, type: "spring" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
