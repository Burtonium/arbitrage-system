// override env variables
const dotenv = require('dotenv');
const fs = require('fs');
const envConfig = dotenv.parse(fs.readFileSync('.env.test'));
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}

const mock = require('mock-require');
mock('ccxt', require('./fixtures/ccxt'));
const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(require('chai-uuid'));
chai.should();
const { knex } = require('../database');
const Market = require('../models/market');
const Exchange = require('../models/exchange');

describe('API routes', () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  
  describe('POST /:baseCurrency/:quoteCurrency/quote', () => {
    it('Should return a valid quote', (done) => {
      const quote = {
        amount: 0.1,
        side: 'buy'
      };
      chai.request(app).post('/BCH/BTC/quote').send(quote).end((err, res) => {
        expect(err).to.be.equal(null);
        res.should.have.status(201);
        res.body.should.be.a('Object');
        res.body.should.have.property('quoted');
        res.body.quoted.should.have.property('id');
        res.body.quoted.id.should.be.a.guid();
        res.body.quoted.should.have.property('price');
        expect(res.body.quoted.price).to.be.a('number');
        done();
      });
    });
  });
  
  describe('POST /order', () => {
    it('Should place an order', async () => {
      const market = await Market.query().where('symbol', 'BCH/BTC').first();
      let quote = await market.$relatedQuery('quotes').insert({
        price: 0.2,
        side: 'buy',
        amount: 0.1
      });
      
      return new Promise((resolve) => {
        chai.request(app).post('/order').send({ quoteId: quote.id }).end((err, res) => {
          expect(err).to.be.equal(null);
          res.should.have.status(201);
          res.body.should.have.property('order');
          resolve();
        });
      });
    });
  });
  
  describe('POST /settings', () => {
    it('Should create an exchange setting', (done) => {
      const insert = {
        id: 'bitstamp',
        apiKey: 'hohoho',
        secret: 'hohoho',
        buyMarginPercent: 5.5,
        sellMarginPercent: 4.5
      };
  
      chai.request(app).post('/settings').send(insert).end((err, res) => {
        expect(err).to.be.equal(null);
        res.should.have.status(201);
        Exchange.query().where('ccxtId', insert.id).eager('settings').first().then(({ settings }) => {
          const expected = settings.toJSON();
          expected.apiKey.should.be.equal(insert.apiKey);
          expected.buyMarginPercent.should.be.equal(insert.buyMarginPercent);
          expected.sellMarginPercent.should.be.equal(insert.sellMarginPercent);
          done();
        });
      });
    });
  });
  
  describe('GET /exchanges', () => {
    it('Should return exchanges and their settings', (done) => {
      chai.request(app).get('/exchanges').end((err, res) => {
        expect(err).to.be.equal(null);
        res.should.have.status(200);
        res.body.should.have.property('exchanges');
        res.body.exchanges.should.be.a('array');
        res.body.exchanges[0].should.have.property('requires');
        res.body.exchanges[0].should.have.property('settings');
        res.body.exchanges[0].should.have.property('id');
        res.body.exchanges[0].should.have.property('name');
        done();
      });
    });
  });
});