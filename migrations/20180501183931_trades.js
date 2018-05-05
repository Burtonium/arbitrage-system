exports.up = knex => knex.schema.createTable('trades', (table) => {
    table.bigIncrements().primary();
    table.bigInteger('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
    table.decimal('filled', 30, 15).notNullable();
    table.decimal('price', 30, 15).notNullable();
    table.dateTime('timestamp').notNullable().index();
  });

exports.down = knex =>  knex.schema.dropTableIfExists('trades');
