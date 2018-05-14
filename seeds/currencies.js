const currencies = require('./data/currencies');

exports.seed = async (knex) => {
    await knex('currencies').del();
    return knex('currencies').insert(currencies);
}
