import { Router } from "express";
import { createMarket } from "../controller/market";

const router = Router();

router.post("/", createMarket);

export default router;
