import { Router } from "express";
import { onramp } from "../controller/onramp";

const router = Router();

router.post("/", onramp);

export default router;
