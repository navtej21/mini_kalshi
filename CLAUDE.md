# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Runtime is Bun (not Node); there is no build step.

- `bun install`
- `bun run dev` — run `index.ts` with `--watch`; `bun start` — run once. Serves on port 3000.
- `bun test` — run all tests. Single file: `bun test tests/orderbook.test.ts`; single test: `bun test -t "<test name substring>"`.
- `bun run typecheck` (`bun check`); `bun fmt` to format.

Env: `MONGO_URL` (defaults to `mongodb://localhost:27017/mini-kalshi`). `index.ts` awaits `mongoose.connect` at startup, so MongoDB must be running.

## Architecture

A mini prediction-market (Kalshi-like) backend: Express 5 + Mongoose + Zod, TypeScript ESM.

- `index.ts` mounts routers under `/api/v1/{auth,onramp,market}`. Note `/api/v1/market` exposes `POST /` (create market) and `POST /split`.
- Layering per feature: `routes/<x>.ts` → `controller/<x>.ts` → `model/*.ts` (Mongoose), with Zod request schemas in `types/<x>.ts`. Controllers validate with `safeParse`, return `{ error }` with 400/404, and don't use auth middleware — `userId` is passed in the request body.
- `routes/routes.ts` looks like a stale leftover (imports `createMarket`/`onramp` from `controller/auth`, which don't exist there); it isn't imported by `index.ts`.
- `engine/orderbook.ts` is a standalone in-memory `OrderBook` class (price-time priority matching; `addOrder` returns `Trade[]`, `cancelOrder`, `bids` sorted desc, `asks` asc). It is not yet wired into any controller/route and does not touch the database. It is developed test-first (`tests/orderbook.test.ts`, bun:test, pure unit tests).

### Domain model / units

- All money is integer **cents**. Contract prices are integer cents 1–99; a YES+NO pair costs 100 cents (`split` charges `quantity * 100`, credits equal YES and NO `StockBalance` rows, and bumps `Market.totalIssued`).
- `User` has `usdBalance` and `lockedUsdBalance` (held by open buy orders); `StockBalance` is unique per `(userId, marketId, type: YES|NO)` with `quantity` and `locked`. Upsert with `$inc` rather than read-modify-write.
- `Market.resolution` is `"yes" | "no" | null`.

### Tests

- `tests/orderbook.test.ts` — pure unit tests, no server needed.
- `index.test.ts` and `tests/split.test.ts` are integration tests that call a **running server** at `http://localhost:3000` via axios (start `bun run dev` and MongoDB first). They create users with random usernames; data accumulates in the DB.
