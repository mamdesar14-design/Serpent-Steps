import { Router } from "express";
import { createGame, joinGame, getGame } from "../lib/gameState.js";

const router = Router();

router.post("/games", (req, res) => {
  const { hostName, level } = req.body as { hostName: string; level: number };
  if (!hostName || !level) {
    res.status(400).json({ error: "hostName and level are required" });
    return;
  }
  const game = createGame(hostName, level);
  res.status(201).json(game);
});

router.get("/games/:roomCode", (req, res) => {
  const game = getGame(req.params.roomCode);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  res.json(game);
});

router.post("/games/:roomCode/join", (req, res) => {
  const { playerName } = req.body as { playerName: string };
  if (!playerName) {
    res.status(400).json({ error: "playerName is required" });
    return;
  }
  const result = joinGame(req.params.roomCode, playerName);
  if (!result) {
    res.status(400).json({ error: "Cannot join game (not found, full, or already started)" });
    return;
  }
  res.json({ playerId: result.player.id, roomCode: result.game.roomCode });
});

export default router;
