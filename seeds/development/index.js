const currencies = require('../currencies');

exports.seed = (knex) => {
    return currencies.seed(knex);
}
