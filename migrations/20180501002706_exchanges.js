exports.up = knex => knex.schema.createTable('exchanges', (table) => {
    table.bigIncrements().primary();
    table.string('ccxt_id').unique();
    table.string('name').notNullable();
  });

exports.down = knex => knex.schema.dropTableIfExists('exchanges');

