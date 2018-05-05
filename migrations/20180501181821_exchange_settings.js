exports.up = knex => knex.schema.createTable('exchange_settings', (table) => {
    table.bigIncrements().primary();
    table.bigInteger('exchange_id').unsigned().references('id').inTable('exchanges').unique();
    table.decimal('profit_margin_percent', 10, 5).defaultTo(5); // TODO buy, sell
    table.string('secret');
    table.string('api_key');
    table.string('uid');
    table.string('password');
  });

exports.down = knex => knex.schema.dropTableIfExists('exchange_settings');

