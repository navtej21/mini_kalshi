import { Router } from "express";
import { createMarket, merge, split } from "../controller/market";

const router = Router();

router.post("/", createMarket);
router.post("/split", split);
router.post("/merge", merge);

export default router;
