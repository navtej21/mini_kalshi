import type { Request, Response } from "express";
import { User } from "../model/user";
import { signinSchema, signupSchema } from "../types/auth";

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
    const parsed = signinSchema.safeParse(req.body);
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
