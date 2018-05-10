const ccxt = require('ccxt');
const responses = require('./responses');

const makeIntId =  () => { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) };

class CcxtFixture extends ccxt.Exchange {
  async fetchMarkets() {
    await this.loadMarkets();
    return this.markets;
  }

  async loadMarkets(reload) {
    this.markets = responses.markets;
  }

  async fetchOrderBook(symbol, limit = undefined, params) {
    return responses.orderbook;
  }

  async fetchTrades(symbol, since, limit, params) {
    return this.trades;
  }
  
  async fetchTickers() {
    return responses.tickers;
  }

  async fetchTicker(symbol) {
    return responses.tickers[symbol];
  }

  async fetchBalance() {
    return responses.balances;
  }

  async createOrder(symbol, type, side, amount, price, params) {
    const timestamp = new Date().getTime();
    const order = { info: null,
      id: makeIntId(),
      timestamp: timestamp,
      datetime: this.iso8601(timestamp),
      lastTradeTimestamp: undefined,
      symbol: symbol,
      type: type,
      side: side,
      price: price,
      amount: amount,
      cost: amount * price,
      filled: amount,
      remaining: 0,
      status: 'closed',
      fee: undefined 
    };
    this.orders[order.id] = order;
    
    const tradePrice = order.side === 'buy' ? price * 0.95 : price * 1.05;
    const trade = {
      id: makeIntId(),
      timestamp: timestamp,
      datetime: this.iso8601(timestamp),
      order: order.id,
      side,
      price: tradePrice,
      amount,
      cost: amount * tradePrice
    };

    this.trades[trade.id] = trade;
    return order;
  }

  async cancelOrder(id, symbol, params) {
    if (this.orders) {
      const order = this.orders[id];
      if (order) {
        order.status = 'canceled';
      }
    }
  }

  async fetchOrder(id, symbol, params) {
    return this.orders[id];
  }

  async fetchOrders(symbol, params) {
    return this.orders || [];
  }
  
  async fetchMyTrades() {
    return Object.values(this.trades);
  }
}

ccxt.exchanges.forEach(e => {
  ccxt[e] = CcxtFixture;
});

module.exports = ccxt;