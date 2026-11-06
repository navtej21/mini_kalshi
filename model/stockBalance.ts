import mongoose from "mongoose";

const stockBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marketId: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
  type: { type: String, enum: ["YES", "NO"], required: true },
  quantity: { type: Number, default: 0 },
  locked: { type: Number, default: 0 },
});




stockBalanceSchema.index({ userId: 1, marketId: 1, type: 1 }, { unique: true });

export const StockBalance = mongoose.model("StockBalance", stockBalanceSchema);