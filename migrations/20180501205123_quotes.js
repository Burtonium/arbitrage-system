exports.up = knex => knex.schema.createTable('quotes', (table) => {
    table.uuid('id').notNullable().primary();
    table.bigInteger('market_id').unsigned().references('id').inTable('markets').index();
    table.decimal('amount', 30, 15).notNullable();
    table.decimal('price', 30, 15).notNullable();
    table.enum('side', ['buy', 'sell']).notNullable();
    table.dateTime('created_at').defaultTo(knex.fn.now()).index();
  });

exports.down = knex =>  knex.schema.dropTableIfExists('quotes');
