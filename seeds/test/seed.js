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
  
  const exchangeData = require('./data/exchanges');
  const exchanges = await Exchange.query().insertGraph(exchangeData);
  
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
