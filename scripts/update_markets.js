const ccxt = require('ccxt');

const Market = require('../models/market');
const Exchange = require('../models/exchange');
const CurrencyPair = require('../models/currency_pair');

(async () =>{
  await Market.query().del();
  for (let i = 0; i < ccxt.exchanges.length; i++) {
    const e = ccxt.exchanges[i];
    console.log(`Loading ${e} markets (${i + 1} of ${ccxt.exchanges.length})`);
    const exchange = new ccxt[e]();

    try {
      await exchange.loadMarkets(true);

      let record = await Exchange.query().select('id').where({ ccxtId: e }).first();
      if (!record) {
        const insert = await Exchange.query().insert({ ccxt_id: e, name: exchange.name });
        record = insert;
      }

      const exchangeId = record.id;
      if (exchangeId) {
        await Promise.all(Object.values(exchange.markets).map(async (market) => {
          let pair = await CurrencyPair.query().where({ 
            quote: market.quote, 
            base: market.base 
          }).first();
          if (!pair) {
            try {
              pair = await CurrencyPair.query().insert({ 
                quote: market.quote, 
                base: market.base 
              });
            } catch (error) {
              console.warn(`Warning: Unsupported pair ${market.base}/${market.quote}`);
            }
          }
          return pair && Market.query().insert({ 
            symbol: market.symbol, 
            currencyPairId: pair.id, 
            exchangeId 
          }).catch(e => e);
        }));
      }
    } catch (e) {
      console.error('An error occured:', e.message);
    }
  }
  process.exit();
})();