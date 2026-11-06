export type Side = "buy" | "sell";

export interface Order {
  id: string;
  userId: string;
  side: Side;
  price: number; // cents
  qty: number;
}

export interface Trade {
  price: number; // cents
  qty: number;
  buyerId: string;
  sellerId: string;
}

export class OrderBook {
  bids: Order[] = []; // buyers
  asks: Order[] = []; // sellers


    addOrder(order: Order): Trade[] {
    validateOrder(order);
    const incoming = { ...order }; // never change the caller's object
    const trades: Trade[] = [];

    const isBuy = incoming.side === "buy";
    const opposite = isBuy ? this.asks : this.bids;

    while (incoming.qty > 0) {
      const best = opposite[0];
      const crosses =
        best !== undefined &&
        (isBuy ? incoming.price >= best.price : incoming.price <= best.price);
      if (!crosses) break;

      const qty = Math.min(incoming.qty, best.qty);
      trades.push({
        price: best.price,
        qty,
        buyerId: isBuy ? incoming.userId : best.userId,
        sellerId: isBuy ? best.userId : incoming.userId,
      });
      incoming.qty -= qty;
      best.qty -= qty;
      if (best.qty === 0) opposite.shift();
    }

    if (incoming.qty > 0) {
      if (isBuy) {
        this.bids.push(incoming);
        this.bids.sort((a, b) => b.price - a.price);
      } else {
        this.asks.push(incoming);
        this.asks.sort((a, b) => a.price - b.price);
      }
    }

    return trades;
  }


   cancelOrder(id: string): boolean {
    for (const side of [this.bids, this.asks]) {
      const i = side.findIndex((o) => o.id === id);
      if (i !== -1) {
        side.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}


function validateOrder(order: Order): void {
  if (order.side !== "buy" && order.side !== "sell") {
    throw new Error("Side must be buy or sell");
  }
  if (!Number.isInteger(order.qty) || order.qty <= 0) {
    throw new Error("Quantity must be a positive whole number");
  }
  if (!Number.isInteger(order.price) || order.price < 1 || order.price > 99) {
    throw new Error("Price must be a whole number of cents from 1 to 99");
  }
}