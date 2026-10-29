import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import onrampRouter from "./routes/onramp";
import marketRouter from "./routes/market";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/onramp", onrampRouter);
app.use("/api/v1/market", marketRouter);

const MONGO_URL = process.env.MONGO_URL ?? "mongodb://localhost:27017/mini-kalshi";

await mongoose.connect(MONGO_URL);
console.log("connected to mongodb");

app.listen(3000, () => {
    console.log("started with 3000");
});
