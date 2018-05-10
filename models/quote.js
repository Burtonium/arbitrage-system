const { Model } = require('../database');
const guid = require('objection-guid')();

class Quote extends guid(Model) {
  static get tableName() {
    return 'quotes';
  }

  static get timestamp() {
    return {
      create: true,
      update: false
    };
  }
  
  static get expiryTime() {
    return new Date(Date.now() - 30000);
  }
  
    
  static get namedFilters() {
    return {
      notExpired: (builder) => {
        builder.where('createdAt', '<', Quote.expiryTime);
      }
    };
  }
  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['price', 'amount'],
      
      properties: {
        price: { type: 'float' },
        amount: { type: 'float' },
        side: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      market: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/market`,
        join: {
          from: 'quotes.marketId',
          to: 'markets.id'
        }
      },
      order: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/order`,
        join: {
          from: 'quotes.id',
          to: 'orders.quoteId'
        }
      }
    }
  }

  async createOrder(order) {
    const market = this.market || this.$relatedQuery('market');
    return market.createOrder(this.id, order);
  }
}

module.exports = Quote;
