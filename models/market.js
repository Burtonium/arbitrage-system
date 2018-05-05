const { Model } = require('../database');
const _ = require('lodash');

class Market extends Model {
  static get tableName() {
    return 'markets';
  }

  static get timestamp() {
    return false;
  }

  static get relationMappings() {
    return {
      pair: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/currency_pair`,
        join: {
          from: 'markets.currencyPairId',
          to: 'currency_pairs.id'
        }
      },
      exchange: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/exchange`,
        join: {
          from: 'markets.exchangeId',
          to: 'exchanges.id'
        },
      },
      quotes: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/quote`,
        join: {
          from: 'markets.id',
          to: 'quotes.marketId'
        }
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/order`,
        join: {
          from: 'markets.id',
          to: 'orders.marketId'
        }
      }
    };
  }

  async createOrder(quoteId, order) {
    const created = await this.exchange.createOrder(order);
    return this.$relatedQuery('orders').insert({
      quoteId,
      status: 'open',
      ..._.pick(created, [ 'orderId', 'type', 'side', 'amount', 'limitPrice'])
    });
  }
}

module.exports = Market;
