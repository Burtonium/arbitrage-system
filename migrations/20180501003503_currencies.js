exports.up = knex => knex.schema.createTable('currencies', (table) => {
    table.string('code', 10).primary();
    table.enum('type', ['crypto', 'fiat']).notNullable().index();
    table.integer('decimal_digits');
    table.string('symbol');
    table.string('label');
    table.string('icon');
    table.dateTime('created_at').defaultTo(knex.fn.now());
  });


exports.down = knex => knex.schema.dropTableIfExists('currencies');

