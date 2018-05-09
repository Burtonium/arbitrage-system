module.exports = (fetchMock) => {
    fetchMock.get(new RegExp('bitstamp.net/api/v2/trading-pairs-info'), async(url, opts) => {
        return require(`./trading-pairs-info`);
    });

    fetchMock.get(new RegExp('bitstamp.net/api/v2/order_book'), async(url, opts) => {
        return require('./order_book');
    });
    
    fetchMock.post(new RegExp('bitstamp.net/api/v2/balance'), async(url, opts) => {
        return require('./balance');
    });
};
