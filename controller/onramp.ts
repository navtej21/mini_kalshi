import type { Request, Response } from "express";
import { User } from "../model/user";
import { onrampSchema } from "../types/onramp";

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
