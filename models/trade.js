const { Model } = require('../database');

class Trade extends Model {
  static get tableName() {
    return 'trades';
  }

  static get timestamp() {
    return false;
  }

  static get virtualAttributes() {
    return ['cost'];
  }

  get cost() {
    return parseFloat(this.filled) * parseFloat(this.price);
  }
}

module.exports = Trade;
