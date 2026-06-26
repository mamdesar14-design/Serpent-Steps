# Snake & Ladder — English Explanation Text Game

An educational Snake & Ladder game where players answer English explanation text questions to move their pieces. Supports up to 5 players online in real time.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API + Socket.io server (port 8080)
- `pnpm --filter @workspace/ular-tangga run dev` — run the frontend (port 21981)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Socket.io (real-time multiplayer)
- Frontend: React + Vite + Framer Motion
- DB: In-memory game state (no persistent DB needed)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (game CRUD endpoints)
- `artifacts/api-server/src/lib/gameState.ts` — in-memory game state + snake/ladder maps
- `artifacts/api-server/src/app.ts` — Express + Socket.io server (socket events)
- `artifacts/api-server/src/routes/games.ts` — REST routes (create/join/get game)
- `artifacts/ular-tangga/src/lib/gameData.ts` — 16 explanation texts × 5 questions each
- `artifacts/ular-tangga/src/lib/socket.ts` — Socket.io client singleton
- `artifacts/ular-tangga/src/pages/Home.tsx` — lobby/menu
- `artifacts/ular-tangga/src/pages/Game.tsx` — main game page (socket events, game logic)
- `artifacts/ular-tangga/src/components/Board.tsx` — 10×10 SVG board with snakes/ladders drawn
- `artifacts/ular-tangga/src/components/Dice.tsx` — animated dice
- `artifacts/ular-tangga/src/components/QuestionModal.tsx` — reading + question phase
- `artifacts/ular-tangga/src/components/PlayerPanel.tsx` — player score/rank panel

## Architecture decisions

- Socket.io runs at `/api/socket.io/` so it's covered by the existing `/api` proxy path — no extra toml entry needed.
- Game state is held in-memory on the server (Map of roomCode → GameState). Rooms auto-expire after 30 minutes of waiting.
- Questions are randomly selected from the pool each roll; the last 10 used texts are excluded to avoid repetition.
- Level 1: 10 snakes, 8 ladders (always take you up). Level 2: 14 snakes, 10 ladders with mixed rewards (points, bonus rolls, or surprise snake traps).
- Frontend uses Framer Motion for all board animations (token movement, dice spin, modal entrance).

## Product

- **Home**: Create room (host), join by code, or solo practice. Host selects Level 1 or 2.
- **Waiting lobby**: Shows room code to share. Host clicks Start when ready (1–5 players).
- **Game board**: 10×10 board with snakes/ladders drawn as SVG paths. Players are colored tokens with initials.
- **Turn flow**: Active player clicks dice → dice spins → question modal appears → read text → answer question → correct: move forward + points / wrong: stay.
- **Level 2 extras**: More snakes, ladder rewards vary (points / bonus rolls / hidden snake traps), shorter timer (30 s vs 45 s).
- **Win condition**: First player to reach square 100 wins. Victory modal shows final scoreboard.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Socket.io path is `/api/socket.io` — changing it requires updating both `app.ts` and `socket.ts`.
- Do NOT use `pnpm dev` at workspace root. Start via workflows or individual filters.
- After OpenAPI spec changes, always re-run codegen before touching generated files.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
