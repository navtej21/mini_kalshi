import { test, expect } from "bun:test";
import axios from "axios";

const AUTH_URL = "http://localhost:3000/api/v1/auth";
const ONRAMP_URL = "http://localhost:3000/api/v1/onramp";
const MARKET_URL = "http://localhost:3000/api/v1/market";

test("splitting twice adds to the same balance", async () => {
    const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 10000 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });

    await axios.post(`${MARKET_URL}/split`, { userId, marketId: market.data.id, quantity: 10 });
    const res = await axios.post(`${MARKET_URL}/split`, { userId, marketId: market.data.id, quantity: 5 });

    expect(res.data.usdBalance).toBe(8500);
    expect(res.data.yes).toBe(15);
    expect(res.data.no).toBe(15);
});

test("split fails when the user cannot afford it", async () => {
  const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 500 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });

    try {
        await axios.post(`${MARKET_URL}/split`, { userId, marketId: market.data.id, quantity: 10 }); // costs 1000
        throw new Error("Request should have failed");
    } catch (e: any) {
        expect(e.status).toBe(400);
    }

    // nothing was taken: 5 pairs cost exactly the 500 we have
    const res = await axios.post(`${MARKET_URL}/split`, { userId, marketId: market.data.id, quantity: 5 });
    expect(res.data.usdBalance).toBe(0);
});


test("split fails when the market does not exist",async()=>{
     const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 500 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });

     try {
        await axios.post(`${MARKET_URL}/split`, { userId, marketId: "000000000000000000000000", quantity: 1 });
        throw new Error("Request should have failed");
    } catch (e: any) {
        expect(e.status).toBe(404);
    }
});


test.each([0, -3, 1.5])("split rejects bad quantity %p", async (quantity) => {
     const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 500 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });

    try {
        await axios.post(`${MARKET_URL}/split`, { userId, marketId: market.data.id, quantity });
        throw new Error("Request should have failed");
    } catch (e: any) {
        expect(e.status).toBe(400);
    }
});


test("merge fails when the user lacks matching pairs", async () => {
   const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 500 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });
    try {
        await axios.post(`${MARKET_URL}/merge`, { userId, marketId: market.data.id, quantity: 5 });
        throw new Error("Request should have failed");
    } catch (e: any) {
        expect(e.status).toBe(400);
    }
});

test("merge fails for a user with no tokens in that market", async () => {
 const signup = await axios.post(`${AUTH_URL}/signup`, { username: `navtej-${Math.random()}`, password: "123123" });
    const userId = signup.data.id;
    await axios.post(ONRAMP_URL, { userId, amount: 500 });
    const market = await axios.post(`${MARKET_URL}`, { userId, title: "Will it rain tomorrow?" });

    try {
        await axios.post(`${MARKET_URL}/merge`, { userId, marketId: market.data.id, quantity: 1 });
        throw new Error("Request should have failed");
    } catch (e: any) {
        expect(e.status).toBe(400);
    }
});