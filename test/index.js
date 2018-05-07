const dotenv = require('dotenv');
const fs = require('fs');
const { URLSearchParams } = require('url');
const envConfig = dotenv.parse(fs.readFileSync('.env.test'));
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}

const assert = require('assert');
const fetchMock = require('./mock-ponyfill');
const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { knex } = require('../database');

describe('API routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        return knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });
  
  afterEach(fetchMock.reset);
  
  describe('/POST /:baseCurrency/:quoteCurrency/quote', () => {
    fetchMock.post(new RegExp('poloniex.com/tradingApi'), async (url, opts) => {
      console.log('URL:', url);
      const parsed = new URLSearchParams(opts.body);
      console.log(parsed.get('command'));
    });
    it('should return a quote id', () => {
      const quote = {
        amount: 0.1,
        side: 'buy'
      }
      chai.request(app).post('/BCH/BTC/quote').send(quote).end((err, res) => {
        console.log(res.body);
      });
    });
  });
});