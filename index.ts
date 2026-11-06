import express from "express";
import mongoose from "mongoose";
import apiRouter from "./routes/routes";

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

const MONGO_URL = process.env.MONGO_URL ?? "mongodb://localhost:27017/mini-kalshi";

await mongoose.connect(MONGO_URL);
console.log("connected to mongodb");

app.listen(3000, () => {
    console.log("started with 3000");
});
