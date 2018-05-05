exports.up = knex => knex.schema.createTable('orders', (table) => {
    table.bigIncrements().primary();
    table.string('order_id');
    table.bigInteger('market_id').unsigned().references('id').inTable('markets').index();
    table.enum('status', ['open', 'closed', 'canceled', 'error']).notNullable().defaultTo('open');
    table.enum('type', ['market', 'limit']).notNullable();
    table.enum('side', ['buy', 'sell']).notNullable();
    table.decimal('amount', 30, 15).notNullable();
    table.decimal('limit_price', 30, 15);
    table.unique(['order_id', 'market_id']);
    table.timestamps();
  });

exports.down = knex => knex.schema.dropTableIfExists('orders');
