import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import {
  getGame,
  startGame,
  movePlayer,
  setAwaitingAnswer,
  disconnectPlayer,
  reconnectPlayer,
  joinGame,
} from "./lib/gameState.js";

const app: Express = express();
export const httpServer = createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
  path: "/api/socket.io",
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "Socket connected");

  socket.on("join_room", ({ roomCode, playerId }: { roomCode: string; playerId: string }) => {
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.playerId = playerId;
    reconnectPlayer(roomCode, playerId);
    const game = getGame(roomCode);
    if (game) {
      socket.emit("game_state", game);
      io.to(roomCode).emit("player_joined", { game, playerId });
    }
  });

  socket.on("join_game_socket", ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
    const result = joinGame(roomCode, playerName);
    if (!result) {
      socket.emit("error", { message: "Cannot join game" });
      return;
    }
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.playerId = result.player.id;
    socket.emit("joined", { playerId: result.player.id, game: result.game });
    io.to(roomCode).emit("game_state", result.game);
  });

  socket.on("start_game", ({ roomCode }: { roomCode: string }) => {
    const game = startGame(roomCode);
    if (game) {
      io.to(roomCode).emit("game_started", game);
      io.to(roomCode).emit("game_state", game);
    }
  });

  socket.on("roll_dice", ({ roomCode, playerId, diceValue }: { roomCode: string; playerId: string; diceValue: number }) => {
    const game = getGame(roomCode);
    if (!game || game.status !== "playing") return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== playerId) return;

    const updatedGame = setAwaitingAnswer(roomCode, diceValue);
    if (updatedGame) {
      io.to(roomCode).emit("dice_rolled", { game: updatedGame, playerId, diceValue });
    }
  });

  socket.on("submit_answer", ({
    roomCode,
    playerId,
    correct,
    diceValue,
  }: {
    roomCode: string;
    playerId: string;
    correct: boolean;
    diceValue: number;
  }) => {
    const result = movePlayer(roomCode, playerId, diceValue, correct);
    if (result) {
      io.to(roomCode).emit("move_result", {
        game: result.game,
        playerId,
        moved: result.moved,
        newPosition: result.newPosition,
        event: result.event,
        reward: result.reward,
        correct,
      });
      io.to(roomCode).emit("game_state", result.game);
      if (result.game.status === "finished") {
        io.to(roomCode).emit("game_over", { winnerId: result.game.winnerId, game: result.game });
      }
    }
  });

  socket.on("disconnect", () => {
    const { roomCode, playerId } = socket.data;
    if (roomCode && playerId) {
      disconnectPlayer(roomCode, playerId);
      const game = getGame(roomCode);
      if (game) {
        io.to(roomCode).emit("player_disconnected", { playerId, game });
      }
    }
    logger.info({ socketId: socket.id }, "Socket disconnected");
  });
});

export default app;
