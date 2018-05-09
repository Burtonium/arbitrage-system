const { URLSearchParams, URL } = require('url');

const makeId = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 22; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const makeIntId =  () => { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) };

module.exports = (fetchMock) => {
    const orders = [];
    fetchMock.get(new RegExp('api.binance.com/api/v1/exchangeInfo'), async(url, opts) => {
        return require(`./exchangeInfo`);
    });

    fetchMock.get(new RegExp('api.binance.com/api/v1/depth'), async(url, opts) => {
        return require('./depth');
    });
    
    fetchMock.get(new RegExp('api.binance.com/api/v3/account'), async(url, opts) => {
        return require('./account');
    });
    
    fetchMock.post(new RegExp('api.binance.com/api/v3/order'), async(url, opts) => {
        const parsed = new URLSearchParams(opts.body);
        const amount = parsed.get('quantity');
        const symbol = parsed.get('symbol');
        const price = parsed.get('price');
        const type = parsed.get('type');
        const side = parsed.get('side');
        const order = {
            symbol,
            orderId: makeIntId(),
            clientOrderId: makeId(),
            transactTime: new Date().getTime(),
            price,
            origQty: amount,
            status: "FILLED",
            timeInForce: "GTC",
            type,
            side
        };
        orders.push(order);
        return order;
    });
    
    fetchMock.get(new RegExp('api.binance.com/api/v3/order'), async(url, opts) => {
        const { searchParams } = new URL(url);
        const orderId = searchParams.get('orderId');
        const type = searchParams.get('type');
        const symbol = searchParams.get('symbol');
        const order = orders.find(o => o.orderId == orderId);
        return {
          "symbol": symbol,
          "orderId": orderId,
          "clientOrderId": order.clientOrderId,
          "price": order.price,
          "origQty": order.origQty,
          "executedQty": order.origQty,
          "status": "FILLED",
          "timeInForce": "GTC",
          "type": type,
          "side": order.side,
          "stopPrice": "0.0",
          "icebergQty": "0.0",
          "time": new Date().getTime(),
          "isWorking": true
        };
    });
    
    fetchMock.get(new RegExp('api.binance.com/api/v3/myTrades'), async(url, opts) => {
        const { searchParams } = new URL(url);
        const orderId = searchParams.get('orderId');
        const symbol = searchParams.get('symbol');
        const trades = orders.map(o => ({
            "id": makeIntId(),
            "orderId": o.orderId,
            "price": o.price,
            "qty": "12.00000000",
            "commission": "10.10000000",
            "commissionAsset": "BNB",
            "time": 1499865549590,
            "isBuyer": true,
            "isMaker": false,
            "isBestMatch": true
        }))
        return trades;
    });
};
