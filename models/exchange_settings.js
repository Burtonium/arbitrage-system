const { Model } = require('../database');
const _ = require('lodash');

class ExchangeSettings extends Model {
  static get tableName() {
    return 'exchange_settings';
  }

  static get timestamp() {
    return false;
  }

  static get hidden() {
    return ['secret', 'password'];
  }
  
  $formatJson(json) {
    return _.omit(json, ExchangeSettings.hidden());
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
