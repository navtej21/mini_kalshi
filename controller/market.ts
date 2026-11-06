import type { Request, Response } from "express";
import { User } from "../model/user";
import { Market } from "../model/market";
import { createMarketSchema, mergeSchema, splitSchema } from "../types/market";
import { StockBalance } from "../model/stockBalance";

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

export const split = async (req: Request, res: Response): Promise<void> => {
  const parsed = splitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { userId, marketId, quantity } = parsed.data;

  try {
    const user = await User.findById(userId);
    const market = await Market.findById(marketId);
    if (!user || !market) {
      res.status(404).json({ error: "User or market not found" });
      return;
    }

    const cost = quantity * 100;
    if (user.usdBalance < cost) {
      res.status(400).json({ error: "Not enough balance" });
      return;
    }

    user.usdBalance -= cost;
    await user.save();

    // $inc + upsert: create the row if missing, otherwise add to it
    const yes = await StockBalance.findOneAndUpdate(
      { userId, marketId, type: "YES" },
      { $inc: { quantity } },
      { upsert: true, new: true },
    );
    const no = await StockBalance.findOneAndUpdate(
      { userId, marketId, type: "NO" },
      { $inc: { quantity } },
      { upsert: true, new: true },
    );

    market.totalIssued += quantity;
    await market.save();

    res.status(200).json({
      usdBalance: user.usdBalance,
      yes: yes!.quantity,
      no: no!.quantity,
    });
  } catch (e) {
    res.status(400).json({ error: "Bad request" }); // e.g. CastError on a bad id
  }
};

export const merge = async (req: Request, res: Response): Promise<void> => {
  const parsed = mergeSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { userId, marketId, quantity } = parsed.data;

  try {
    const user = await User.findById(userId);
    const market = await Market.findById(marketId);

    if (!user || !market) {
      res.status(404).json({ error: "User or market not found" });
      return;
    }

    const yes = await StockBalance.findOne({ userId, marketId, type: "YES" });
    const no = await StockBalance.findOne({ userId, marketId, type: "NO" });

    if (!yes || !no || yes.quantity < quantity || no.quantity < quantity) {
      res.status(400).json({ error: "Not enough tokens" });
      return;
    }
    yes.quantity -= quantity;
    no.quantity -= quantity;
    await yes.save();
    await no.save();

    user.usdBalance += quantity * 100;
    await user.save();

    market.totalIssued -= quantity;
    await market.save();

    res.status(200).json({
      usdBalance: user.usdBalance,
      yes: yes.quantity,
      no: no.quantity,
    });
  } catch (e) {
    res.status(400).json({ error: "Bad request" });
  }
};
