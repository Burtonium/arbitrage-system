const { Model } = require('../database');
const { omit } = require('lodash');

class ExchangeSettings extends Model {
  static get tableName() {
    return 'exchange_settings';
  }

  static get timestamp() {
    return false;
  }

  static get hidden() {
    return ['secret', 'password', 'id', 'exchangeId', 'twofa'];
  }
  
  $formatJson(json) {
    const f = omit(json, ExchangeSettings.hidden);
    f.buyMarginPercent = parseFloat(f.buyMarginPercent);
    f.sellMarginPercent = parseFloat(f.sellMarginPercent);
    return f;
  }
  
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        sellMarginPercent: { type: 'number' },
        buyMarginPercent: { type: 'number' },
      }
    };
  }

  static get relationMappings() {
    return {
      exchange: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/exchange`,
        join: {
          from: 'exchange_settings.exchangeId',
          to: 'exchanges.id'
        }
      }
    };
  }
}

module.exports = ExchangeSettings;
