import type { Request, Response } from "express";
import { User } from "../model/user";
import { Market } from "../model/market";
import { createMarketSchema } from "../types/market";

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
