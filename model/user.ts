import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  usdBalance: { type: Number, default: 0 },       // cents
  lockedUsdBalance: { type: Number, default: 0 }, // cents held by open buy orders
});

export const User = mongoose.model("User", userSchema);
