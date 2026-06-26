import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import gamesRouter from "./games.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(gamesRouter);

export default router;
