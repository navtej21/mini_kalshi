import {test,expect} from "bun:test";
import { OrderBook } from "../engine/orderbook";



test("new orderbook is empty",()=>{

    const book=new OrderBook();

    expect(book.bids.length).toBe(0);
    expect(book.asks.length).toBe(0);
})


test("a buy order rests in the bids", () => {
    const book = new OrderBook();

    book.addOrder({ id: "1", userId: "a", side: "buy", price: 70, qty: 10 });

    expect(book.bids).toEqual([{ id: "1", userId: "a", side: "buy", price: 70, qty: 10 }]);
    expect(book.asks).toEqual([]);
});


test("a sell order rests in the asks",()=>{

    const book=new OrderBook();

    book.addOrder({ id: "2", userId: "b", side: "sell", price: 80, qty: 5 });

    expect(book.asks).toEqual([{ id: "2", userId: "b", side: "sell", price: 80, qty: 5 }]);
    expect(book.bids).toEqual([]);
})


test("bids are sorted with the highest price first", () => {
    const book = new OrderBook();

    book.addOrder({ id: "1", userId: "a", side: "buy", price: 70, qty: 10 });
    book.addOrder({ id: "2", userId: "b", side: "buy", price: 75, qty: 10 });
    book.addOrder({ id: "3", userId: "c", side: "buy", price: 72, qty: 10 });

    expect(book.bids.map((o) => o.price)).toEqual([75, 72, 70]);
});


test("asks are sorted with the lowest price first",()=>{

    const book=new OrderBook();

    book.addOrder({ id: "1", userId: "a", side: "sell", price: 80, qty: 10 });
    book.addOrder({ id: "2", userId: "b", side: "sell", price: 75, qty: 10 });
    book.addOrder({ id: "3", userId: "c", side: "sell", price: 78, qty: 10 });


    expect(book.asks.map((o)=>o.price)).toEqual([75, 78, 80]);
});


test("a buy that crosses a resting sell trades at the sell's price", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "seller", side: "sell", price: 78, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "buyer", side: "buy", price: 80, qty: 10 });

    expect(trades).toEqual([{ price: 78, qty: 10, buyerId: "buyer", sellerId: "seller" }]);
    expect(book.asks).toEqual([]);
    expect(book.bids).toEqual([]);
});


test("a sell that crosses a resting buy trades at the buy's price", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "buyer", side: "buy", price: 75, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "seller", side: "sell", price: 72, qty: 10 });

    expect(trades).toEqual([{ price: 75, qty: 10, buyerId: "buyer", sellerId: "seller" }]);
    expect(book.bids).toEqual([]);
    expect(book.asks).toEqual([]);
});

test("a buy below the best ask must not trade",()=>{

   const book = new OrderBook();
   book.addOrder({ id: "1", userId: "seller", side: "sell", price: 78, qty: 10 });
   const trades = book.addOrder({ id: "2", userId: "buyer", side: "buy", price: 70, qty: 10 });


   expect(trades).toEqual([]);
   expect(book.asks.length).toBe(1);
   expect(book.bids.length).toBe(1);
})


test("a sell above the best bid must not trade",()=>{

    const book=new OrderBook();
    book.addOrder({ id: "1", userId: "buyer", side: "buy", price: 75, qty: 10 });
    const trades = book.addOrder({ id: "2", userId: "seller", side: "sell", price: 80, qty: 10 });


    expect(trades).toEqual([]);
    expect(book.asks.length).toBe(1);
    expect(book.bids.length).toBe(1);
});

test("a buy at exactly the ask price trades", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "seller", side: "sell", price: 78, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "buyer", side: "buy", price: 78, qty: 10 });

    expect(trades).toEqual([{ price: 78, qty: 10, buyerId: "buyer", sellerId: "seller" }]);
});


test("a bigger buy fills what it can and the rest rests in the book", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "seller", side: "sell", price: 78, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "buyer", side: "buy", price: 80, qty: 15 });

    expect(trades).toEqual([{ price: 78, qty: 10, buyerId: "buyer", sellerId: "seller" }]);
    expect(book.asks).toEqual([]);
    expect(book.bids).toEqual([{ id: "2", userId: "buyer", side: "buy", price: 80, qty: 5 }]);
});

test("a smaller buy partly fills a resting sell, which stays with less quantity", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "seller", side: "sell", price: 78, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "buyer", side: "buy", price: 80, qty: 4 });

    expect(trades).toEqual([{ price: 78, qty: 4, buyerId: "buyer", sellerId: "seller" }]);
    expect(book.asks).toEqual([{ id: "1", userId: "seller", side: "sell", price: 78, qty: 6 }]);
    expect(book.bids).toEqual([]);
});

test("a bigger sell fills what it can and the rest rests in the book", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "buyer", side: "buy", price: 75, qty: 10 });

    const trades = book.addOrder({ id: "2", userId: "seller", side: "sell", price: 72, qty: 15 });

    expect(trades).toEqual([{ price: 75, qty: 10, buyerId: "buyer", sellerId: "seller" }]);
    expect(book.bids).toEqual([]);
    expect(book.asks).toEqual([{ id: "2", userId: "seller", side: "sell", price: 72, qty: 5 }]);
});


test("a big buy walks through several asks,best price is first",()=>{

    const book=new OrderBook();

      book.addOrder({ id: "1", userId: "s1", side: "sell", price: 78, qty: 10 });
    book.addOrder({ id: "2", userId: "s2", side: "sell", price: 79, qty: 10 });

    const trades=book.addOrder({ id: "3", userId: "buyer", side: "buy", price: 80, qty: 25 });


     expect(trades).toEqual([
        { price: 78, qty: 10, buyerId: "buyer", sellerId: "s1" },
        { price: 79, qty: 10, buyerId: "buyer", sellerId: "s2" },
    ]);

    expect(book.asks.length).toBe(0);
    expect(book.bids).toEqual([{ id: "3", userId: "buyer", side: "buy", price: 80, qty: 5 }]);
});


test("a buy stops walking when the next ask is above its limit",()=>{

    const book=new OrderBook();

      book.addOrder({ id: "1", userId: "s1", side: "sell", price: 78, qty: 10 });
    book.addOrder({ id: "2", userId: "s2", side: "sell", price: 79, qty: 10 });
    book.addOrder({ id: "3", userId: "s3", side: "sell", price: 85, qty: 10 });


    const trades = book.addOrder({ id: "4", userId: "buyer", side: "buy", price: 80, qty: 25 });

    expect(trades.length).toBe(2);
    expect(book.asks.length).toBe(1);
    expect(book.bids.length).toBe(1);  
});


test("a buy that is filled partway through the second ask leaves the rest of it", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "s1", side: "sell", price: 78, qty: 10 });
    book.addOrder({ id: "2", userId: "s2", side: "sell", price: 79, qty: 10 });

    const trades = book.addOrder({ id: "3", userId: "buyer", side: "buy", price: 80, qty: 15 });

    expect(trades).toEqual([
        { price: 78, qty: 10, buyerId: "buyer", sellerId: "s1" },
        { price: 79, qty: 5, buyerId: "buyer", sellerId: "s2" },
    ]);
    expect(book.asks).toEqual([{ id: "2", userId: "s2", side: "sell", price: 79, qty: 5 }]);
    expect(book.bids).toEqual([]);
});


test("a big sell walks through several bids,best price first",()=>{

    const book=new OrderBook();

    book.addOrder({ id: "1", userId: "b1", side: "buy", price: 75, qty: 10 });
    book.addOrder({ id: "2", userId: "b2", side: "buy", price: 74, qty: 10 });

    const trades=book.addOrder({ id: "3", userId: "seller", side: "sell", price: 70, qty: 25 });

    expect(trades).toEqual([
        { price: 75, qty: 10, buyerId: "b1", sellerId: "seller" },
        { price: 74, qty: 10, buyerId: "b2", sellerId: "seller" },
    ]);
    expect(book.bids.length).toBe(0);
    expect(book.asks.length).toBe(1);
});


test("at the same ask price, the older sell order fills first", () => {
    const book = new OrderBook();
    book.addOrder({ id: "1", userId: "first", side: "sell", price: 78, qty: 10 });
    book.addOrder({ id: "2", userId: "second", side: "sell", price: 78, qty: 10 });

    const trades = book.addOrder({ id: "3", userId: "buyer", side: "buy", price: 80, qty: 10 });

    expect(trades).toEqual([{ price: 78, qty: 10, buyerId: "buyer", sellerId: "first" }]);
    expect(book.asks).toEqual([{ id: "2", userId: "second", side: "sell", price: 78, qty: 10 }]);
});