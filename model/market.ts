import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  totalIssued: { type: Number, default: 0 },
  resolution: { type: String, enum: ["yes", "no", null], default: null },
});

export const Market = mongoose.model("Market", marketSchema);
