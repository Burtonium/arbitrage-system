const currencies = require('../data/currencies');

exports.seed = knex => knex('currencies').del()
    .then(() => {
      return knex('currencies').insert(currencies);
    }
  );
