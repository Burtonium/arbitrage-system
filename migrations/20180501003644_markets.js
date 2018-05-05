exports.up = knex =>  knex.schema.createTable('markets', (table) => {
    table.bigIncrements().primary();
    table.bigInteger('exchange_id').unsigned().references('id').inTable('exchanges').notNullable();
    table.bigInteger('currency_pair_id').unsigned().references('id').inTable('currency_pairs').notNullable();
    table.string('symbol').notNullable().index();
    table.unique(['exchange_id', 'currency_pair_id']);
  });

exports.down = knex => knex.schema.dropTableIfExists('markets');