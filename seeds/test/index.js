const currencies = require('../currencies');
const CurrencyPairs = require('../../models/currency_pair');
const Markets = require('../../models/market');
const Exchange = require('../../models/exchange');

const { flatten } = require('lodash');

exports.seed = async (knex) => {
  await currencies.seed(knex);
  
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
  
  await Promise.all(flatten(pairs.map((pair) => {
    return exchanges.map((exchange) => {
      return Markets.query().insert([{
        currencyPairId: pair.id,
        exchangeId: exchange.id,
        symbol: `${pair.base}/${pair.quote}`
      }]);
    });
  })));
};