import { Router } from "express";
import { createMarket, onramp, signin, signup } from "../controller/auth";

const router=Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/onramp",onramp);
router.post("/", createMarket);

export default router;
