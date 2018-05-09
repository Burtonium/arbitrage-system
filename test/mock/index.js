const poloniex = require('./poloniex');
const bitstamp = require('./bitstamp');
const binance = require('./binance');

module.exports = (fetchMock) => {
    poloniex(fetchMock);
    bitstamp(fetchMock);
    binance(fetchMock);
};