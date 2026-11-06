import type { Request, Response } from "express";
import { User } from "../model/user";
import { createMarketSchema } from "../types/market";
import { Market } from "../model/market";
import { signupSchema } from "../types/auth";
import { onrampSchema } from "../types/onramp";


export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { username, password } = parsed.data;

    const exists = await User.findOne({ username });
    if (exists) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    

    const user = await User.create({ username, password });
    res.status(201).json({ id: user._id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}

export async function signin(req: Request, res: Response): Promise<void> {
  try {

    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { username, password } = parsed.data;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({ id: user._id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}



export async function onramp(req: Request, res: Response): Promise<void> {
  try {
    const parsed = onrampSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { userId, amount } = parsed.data;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.usdBalance += amount;
    await user.save();

    res.status(200).json({ usdBalance: user.usdBalance });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}

export async function createMarket(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createMarketSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const { userId, title } = parsed.data;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const market = await Market.create({ creatorId: user._id, title });
    res.status(201).json({ id: market._id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
}