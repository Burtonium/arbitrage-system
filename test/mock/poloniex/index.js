const { URLSearchParams, URL } = require('url');
module.exports = (fetchMock) => {
    fetchMock.get(new RegExp('poloniex.com/public'), async(url, opts) => {
        const { searchParams } = new URL(url);
        const command = searchParams.get('command');
        let response = null;
        try {
            response = require(`./${command}`);
        }
        catch (error) {
            console.log(error);
        }
        return response;
    });

    fetchMock.post(new RegExp('poloniex.com/tradingApi'), async(url, opts) => {
        const parsed = new URLSearchParams(opts.body);
        const command = parsed.get('command');
        let response = null;
        try {
            response = require(`./${command}`);
        }
        catch (error) {
            console.log(error);
        }
        return response;
    });
}
