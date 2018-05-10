exports.up = knex => knex.schema.createTable('exchange_settings', (table) => {
    table.bigIncrements().primary();
    table.bigInteger('exchange_id').unsigned().references('id').inTable('exchanges').unique();
    table.decimal('sell_margin_percent', 10, 5).defaultTo(5);
    table.decimal('buy_margin_percent', 10, 5).defaultTo(5);
    table.string('secret');
    table.string('api_key');
    table.string('uid');
    table.string('login');
    table.string('password');
    table.string('twofa');
  });

exports.down = knex => knex.schema.dropTableIfExists('exchange_settings');

