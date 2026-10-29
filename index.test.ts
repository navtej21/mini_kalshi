import { test, expect } from "bun:test";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000/api/v1";
const PASSWORD="abc123";


const USERNAME = `navtej-${Math.random()}`;

// test("If username is small, the signup endpoint should return a 400 status code", async () => {
//     try {
//         await axios.post(`${BACKEND_URL}/auth/signup`, {
//             username: "a",
//             password: "asdasdadskjadskj"
//         });

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(400);
//     }
// });

// test("If the username and password are not present it should return a 400", async () => {
//     try {
//         await axios.post(`${BACKEND_URL}/auth/signup`, {});

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(400);
//     }
// });

// test("A valid signup should return 201 and an id", async () => {
//     const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
//         username: USERNAME,
//         password: "123123"
//     });
//     expect(res.status).toBe(201);
//     expect(res.data.id).toBeDefined();
// });

// test("Signing up with an existing username should return a 409", async () => {
//     try {
//         await axios.post(`${BACKEND_URL}/auth/signup`, {
//             username: USERNAME,
//             password: "123123"
//         });

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(409);
//     }
// });



// test("If the username and password are not present it should return a 400", async () => {
//     try {
//         await axios.post(`${BACKEND_URL}/auth/signin`, {});

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(400);
//     }
// });

// test("If the user does not exist it should return a 401", async () => {
//     try {
//         await axios.post(`${BACKEND_URL}/auth/signin`, {
//             username: "nobody-here",
//             password: PASSWORD
//         });

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(401);
//     }
// });

// test("If the password is wrong it should return a 401", async () => {
//     await axios.post(`${BACKEND_URL}/auth/signup`, {
//         username: USERNAME,
//         password: PASSWORD
//     });

//     try {
//         await axios.post(`${BACKEND_URL}/auth/signin`, {
//             username: USERNAME,
//             password: "wrong-password"
//         });

//         throw new Error("Request should have failed");
//     } catch (e: any) {
//         console.log(e.status);
//         expect(e.status).toBe(401);
//     }
// });

// test("A valid signin should return 200 and the user id", async () => {
//     const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
//         username: USERNAME,
//         password: PASSWORD
//     });
//     expect(res.status).toBe(200);
//     expect(res.data.id).toBeDefined();
// });


// write a test for onRamp

// test("Onramp should add the amount to the user's balance", async () => {
//     const signup = await axios.post(`${BACKEND_URL}/auth/signup`, {
//         username: `navtej-${Math.random()}`,
//         password: "123123"
//     });
//     const userId = signup.data.id;

//     const res = await axios.post(`${BACKEND_URL}/onramp`, {
//         userId,
//         amount: 100
//     });

//     expect(res.status).toBe(200);
//     expect(res.data.usdBalance).toBe(100);
// });





test("a user can create a market",async ()=>{
    const signup=await axios.post(`${BACKEND_URL}/auth/signup`,{
        username:`navtej-${Math.random()}`,
        password:"123123"
    });


    const userId=signup.data.id;

    const res=await axios.post(`${BACKEND_URL}/market`,{
        userId:signup.data.id,
        title:"Will it rain tommarow"
    });


    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
})