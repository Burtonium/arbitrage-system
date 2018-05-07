const Currencies = require('../../models/currency');
const CurrencyPairs = require('../../models/currency_pair');
const Markets = require('../../models/market');
const Exchange = require('../../models/exchange');

const _ = require('lodash');
const currencies = require('../data/currencies');
exports.seed = async (knex) => {
  await CurrencyPairs.query().del();
  await Currencies.query().del();
  await Currencies.query().insert(currencies);
  
  const pairs = await CurrencyPairs.query().insert([{
      base: 'ETH',
      quote: 'BTC'
    }, {
      base: 'BCH',
      quote: 'BTC'
    }, {
      base: 'LTC',
      quote: 'BTC'
    }]);
    
  const exchanges = await Exchange.query().insertGraph([{
      name: 'bitstamp',
      ccxtId: 'bitstamp',
      settings: {
        uid: 123,
        apiKey: 'testkey',
        secret: 'testsecret'
      }
    }, {
      name: 'Poloniex',
      ccxtId: 'poloniex', 
      settings: {
        apiKey: 'testkey',
        secret: 'testsecret'
        }
      }, {
      name: 'Binance',
      ccxtId: 'binance',
      settings: {
        apiKey: 'testkey',
        secret: 'testsecret'
      }
    }]);
  
  await Promise.all(_.flatten(pairs.map((pair) => {
    return exchanges.map((exchange) => {
      return Markets.query().insert([{
        currencyPairId: pair.id,
        exchangeId: exchange.id,
        symbol: `${pair.base}/${pair.quote}`
      }]);
    });
  })));
};
