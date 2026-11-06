import { Router } from "express";
import authRouter from "./auth";
import onrampRouter from "./onramp";
import marketRouter from "./market";

const router = Router();

router.use("/auth", authRouter);
router.use("/onramp", onrampRouter);
router.use("/market", marketRouter);

export default router;
