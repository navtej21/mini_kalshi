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
