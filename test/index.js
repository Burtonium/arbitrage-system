const dotenv = require('dotenv');
const fs = require('fs');
const envConfig = dotenv.parse(fs.readFileSync('.env.test'));
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}

const assert = require('assert');
const fetchMock = require('./mock-ponyfill');

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(require('chai-uuid'));
chai.should();
const { knex } = require('../database');
const Market = require('../models/market');

describe('API routes', () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  
  afterEach(fetchMock.reset);
  
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
        done();
      });
    });
  });
  describe('POST /order', () => {
    let quote = null;
    before(async () => {
      
    });
    
    it('Should place an order', async () => {
      const market = await Market.query().where('symbol', 'BCH/BTC').first();
      quote = await market.$relatedQuery('quotes').insert({
        price: 0.2,
        side: 'buy',
        amount: 0.1
      });
      return new Promise((resolve) => {
        chai.request(app).post('/order').send({ quoteId: quote.id }).end((err, res) => {
          expect(err).to.be.equal(null);
          res.should.have.status(201);
          resolve();
        });
      });
    }).timeout(20000);
  });
});