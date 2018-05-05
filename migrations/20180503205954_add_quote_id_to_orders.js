exports.up = knex => knex.schema.table('orders', (table) =>{
  table.uuid('quote_id').references('id').inTable('quotes').index();
  table.unique('quote_id');
});
  
exports.down = knex => knex.schema.table('orders', (table) => {
  table.dropColumn('quote_id');
});
