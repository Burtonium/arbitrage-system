const config = require('../knexfile.js');
const knex = require('knex')(config);
const objection = require('objection');
const objectionTimestamp = require('objection-timestamp');

objectionTimestamp.register(objection, {
  create: 'created_at',
  update: 'updated_at'
});

objection.Model.knex(knex);

module.exports = {
  knex,
  Model: objection.Model
};
