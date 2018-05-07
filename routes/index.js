const router = require('express').Router();
const CurrencyPair = require('../models/currency_pair');
const Settings = require('../models/exchange_settings');
const Exchange = require('../models/exchange');
const Market = require('../models/market');
const Quote = require('../models/quote');
const Order = require('../models/order');
const { pick } = require('lodash');

const { ServiceUnavailable , PairNotFound, InvalidParameters, OrderbookOverflow } = require('./errors');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const requires = (params) => {
  return (req, res, next) => {
    const missing = [];
    Object.entries(params).forEach(kv => {
      kv[1].forEach(param => {
        if (!req[kv[0]][param]) {
          missing.push(param);
        }
      });
    });
    let error = undefined;
    if (missing.length > 0) {
      error = new InvalidParameters(`Missing parameters: '${missing.join(', ')}'`);
    }
    return next(error);
  };
};

router.post('/:base/:quote/quote', requires({ body: ['amount', 'side'] }), async (req, res) => {
  const quote = req.params.quote.toUpperCase();
  const base = req.params.base.toUpperCase();
  const pair = await CurrencyPair.query().where({ base, quote }).first();
  const side = req.body.side;
  const amount = parseFloat(req.body.amount);
  
  if (!isNumeric(amount)) {
    throw new InvalidParameters('Amount is invalid');
  }
  
  if (!pair) {
    throw new PairNotFound();
  }

  let exchanges = (await Exchange.query()
    .eager('[markets,settings]')
    .modifyEager('markets', q => q.where('currencyPairId', pair.id))
    .whereExists(Settings.query().whereRaw('exchange_settings.exchange_id = exchanges.id'))
    .whereExists(Market.query().whereRaw(`markets.exchange_id = exchanges.id AND markets.currency_pair_id = ${pair.id}`)))
    .filter(e => e.has.fetchOrderBook && e.has.fetchBalance);
  
  
  if (exchanges.length === 0) {
    throw new ServiceUnavailable();
  } 
  
  // Load settings
  await Promise.all(exchanges.map(e => e.loadSettings()));
  try {
    exchanges.every(e => e.ccxt.checkRequiredCredentials());
  } catch (error) {
    throw new ServiceUnavailable();
  }
  
  const balancesPromises = Promise.all(exchanges.map(e => e.ccxt.fetchBalance()));
  
  const orderbooks = await Promise.all(exchanges.map(async e => ({ 
    ... (await e.ccxt.fetchOrderBook(e.markets[0].symbol)),
    exchange: e
  })));
  
  const prices = orderbooks.map((book) => {
    const bookSide = side === 'buy' ? book.asks : book.bids;
    let remaining = amount;
    const filteredBook = [];
    
    book.exchange

    bookSide.map(s => ({ price: s[0], amount: s[1] })).every((cur) => {
      let data;
      if (cur.amount > remaining) {
        data = { price: cur.price, amount: remaining };
        remaining = 0;
      } else if (cur.amount < remaining) {
        data = cur;
        remaining -= cur.amount;
      }
      filteredBook.push(data);
      return remaining > 0; // break loop if remaining is 0
    });
    
    if (remaining > 0) {
      throw new OrderbookOverflow();
    }
      
    const price = filteredBook.reduce((acc, cur) => {
      const ratio = cur.amount / amount;
      return (cur.price * ratio) + acc;
    }, 0);
    
    return { price, exchange: book.exchange };
  });
  
  const balances = await balancesPromises;
  
  for (let i = 0; i < prices.length; i++) {
    if (side === 'buy' && ((prices[i].price * amount) > balances[i].free[quote])) {
      prices.splice(i, 1);
    } else if (side === 'sell' && amount > balances[i].free[base]) {
      prices.splice(i, 1);
    }
  }
  
  const bestPrice = prices.reduce((acc, cur) => {
    if (side === 'buy' && cur.price < acc.price) {
      acc = cur;
    } else if (side === 'sell' && cur.price > acc.price) {
      acc = cur;
    }
    return acc;
  }, prices[0]);
  
  const margin = bestPrice.exchange.settings.profitMarginPercent;
  const quotePrice = side === 'buy' ? 
    bestPrice.price * (1 + (parseFloat(margin) / 100)) :
    bestPrice.price * (1 - (parseFloat(margin) / 100));
  
  const quoted = await bestPrice.exchange.markets[0].$relatedQuery('quotes').insert({
    price: quotePrice,
    side,
    amount
  });
  
  res.status(201).json({ quoted });
});

router.post('/order', requires({ body: ['quoteId'] }), async (req, res) => {
  const quoteId = req.body.quoteId;
  const quoted = await Quote.query().where('id', quoteId).eager('[market.exchange.settings,order]').first();
  if (!quoted) {
    return res.status(404).send('Quote not found');
  }
  
  if (quoted.order) {
    return res.status(400).send('There is already an order for that quote');
  }

  if (quoted.createdAt < Quote.expiryTime) {
    return res.status(400).send('Quote expired');
  }
  
  await quoted.market.exchange.loadSettings();

  const order = await quoted.createOrder({
    symbol: quoted.market.symbol,
    type: 'limit',
    limitPrice: quoted.price,
    side: quoted.side,
    amount: quoted.amount
  });

  await order.updateInfo();
  const updated = await Order.query().where('id', order.id).eager('trades');
  
  if (updated.status !== 'closed') {
    await updated.cancel();
    throw new Error();
  }
  res.status(201).json({
      ...pick(updated, ['orderId', 'side', 'status', 'createdAt', 'filled']),
      price: quoted.price,
    });
});

router.post('/settings', async (req, res) => {
  
});

module.exports = router;