const { Model } = require('../database');

class Currency extends Model {
  static get tableName() {
    return 'currencies';
  }

  static get timestamp() {
    return false;
  }

  static get idColumn() {
    return 'code';
  }
}

module.exports = Currency;
