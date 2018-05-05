require('dotenv').config();
const { knexSnakeCaseMappers } = require('objection');
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_NAME;
const port = process.env.DB_PORT || '5432';
const host = process.env.DB_HOST || 'localhost';

module.exports =  {
  client: 'pg',
  connection: `postgres://${user}:${pass}@${host}:${port}/${db}`,
  ...knexSnakeCaseMappers()
};

