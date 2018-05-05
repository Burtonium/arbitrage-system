exports.up = knex => knex.schema.createTable('currency_pairs', (table) => {
    table.bigIncrements().primary();
    table.string('base', 10).references('code').inTable('currencies').index();
    table.string('quote', 10).references('code').inTable('currencies').index();
    table.unique(['base', 'quote']);
  });

exports.down = knex => knex.schema.dropTableIfExists('currency_pairs');

