# Arbitrage System

A Javascript library for for arbitrage of cryptocurrency sales on ezbtc.ca 

This API is meant to be consumed by private networking since **no security features are implemented**.

Current feature list

- Support for producing quotes that expire in 30 seconds
- Arbitrage for a list of exchanges provided by the [ccxt](https://github.com/ccxt/ccxt) library.
- Filters for balances and chooses the best price within the available exchanges
- Proxy requests to exchange APIs to avoid rate limiting
- Works with Nodejs version 8+

This API does not currently:

- Check minimums and maximums amounts for orders on exchanges
- Lock balances for the duration of the quote
- Encrypt or cipher any of the exchange credentials

## Install

Clone it locally first:
```shell
https://github.com/teamezrepo/new-alts.git new-alts
```

Install required dependencies
```shell
npm install
```

Copy the .example.env file. Remember to fill in your environment variables for 
your setup. Leaving proxies variable empty just means your app will not be using any proxies.
```shell
cd new-alts && cp .example.env ./.env
```

Make a .env.test file and enter in the name of a test database. This will ensure none of the
development data is lost when testing. You may also override any other environment variables here.
```shell 
echo 'DB_NAME=test' > .env.test 
```

Migrate the database to the latest version
```shell
knex migrate:latest
```

Seed the database with all the supported currencies
```shell
knex seed:run
```

Fetch all markets supported by the ccxt library. This should be done periodically if the 
any of the markets your app depends on become unsupported.
```shell
npm run update-markets
```

Run your app
```shell
npm start
```

# Routes

## Create quote

  Creates a quote according to the criterion provided.

* **URL**

  /:baseCurrency/:quoteCurrency/quote

* **Method:**

  `POST` 

* **Data Params**

  **Required:**
  
  amount:[float] > 0,
  side:[string:'buy' || 'sell']

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```json
    {"quoted":{"price":0.18225843300000003,"side":"buy","amount":0.1,"marketId":"4","created_at":"2018-05-10T20:45:41.385Z","id":"dc075490-b660-4a12-adec-673bc9fe96f4"}}
    ```
 
* **Error Responses:**

  * **HTTP Status Code:** 400 Bad Request <br />
    **Code 4** Invalid Parameters <br />

  * **HTTP Status Code:** 404 Not Found <br />
    **Message** Pair not found <br />

  * **HTTP Status Code:** 500 Error <br />
    **Message** Something went wrong <br />
 
  * **HTTP Status Code:** 503 Service Unavailable <br />
    **Code 5** OrderbookOverflow <br>
    **Code 6** InsufficientFunds <br />
    **Code 8** IncorrectCredentials <br />
    **Code 9** NoExchangesAvailable <br />


## Place order

  Creates an order on the exchange quoted exchange

* **URL**

  /order

* **Method:**

  `POST` 

* **Data Params**

  **Required:**
  
  quoteId: [uuid]

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    ```json
    {"order":{"orderId":"5919788691279685","side":"buy","status":"closed","createdAt":"2018-05-10T21:25:48.659Z","filled":0.1,"price":0.2}}
    ```
 
* **Error Responses:**

  * **HTTP Status Code:** 400 Bad Request <br />
    **Code 3** InvalidParameters <br />
    **Code 10** OrderDuplicate <br />
    **Code 11** QuoteExpired <br />

  * **HTTP Status Code:** 404 Not Found <br />
    **Message** Quote not found <br />
  
  * **HTTP Status Code:** 500 Error <br />
    **Message** Something Went Wrong <br />

  * **HTTP Status Code:** 503 Service Unavailable <br />
    **Code 7** OrderNotFilled <br>


## Get exchanges

  Returns all available exchanges, their required credentials, settings and available markets

* **URL**

  /exchanges

* **Method:**

  `GET` 

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
  ```json
  {"exchanges":[{"id":"binance","name":"Binance","settings":{"sellMarginPercent":5,"buyMarginPercent":5,"apiKey":"testkey","uid":null,"login":null},"markets":[{"symbol":"ETH/BTC"},{"symbol":"BCH/BTC"},{"symbol":"LTC/BTC"}],"requires":{"apiKey":true,"secret":true,"uid":false,"login":false,"password":false,"twofa":false}},{"id":"bitstamp","name":"Bitstamp","settings":{"sellMarginPercent":5,"buyMarginPercent":5,"apiKey":"testkey","uid":null,"login":null},"markets":[{"symbol":"ETH/BTC"},{"symbol":"BCH/BTC"},{"symbol":"LTC/BTC"}],"requires":{"apiKey":true,"secret":true,"uid":false,"login":false,"password":false,"twofa":false}},{"id":"poloniex","name":"Poloniex","settings":{"sellMarginPercent":5,"buyMarginPercent":5,"apiKey":"testkey","uid":null,"login":null},"markets":[{"symbol":"ETH/BTC"},{"symbol":"BCH/BTC"},{"symbol":"LTC/BTC"}],"requires":{"apiKey":true,"secret":true,"uid":false,"login":false,"password":false,"twofa":false}}]}
   ```

## Create exchange settings

  Creates an exchange setting required for arbitrage

* **URL**

  /:id/settings

* **Method:**

  `PUT` 

* **Params**

  **Required:**
  
  id: [string]

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 
    'Success'
 
* **Error Responses:**

  * **HTTP Status Code:** 404 Not Found <br />
    **Message** Exchange not found <br />
  
  * **HTTP Status Code:** 500 Error <br />
    **Message** Something Went Wrong <br />

## Contributors

[Matt Burton](https://github.com/burtonium)

## License
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
