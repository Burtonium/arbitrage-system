require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const { knexSnakeCaseMappers } = require('objection');
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_NAME;
const port = process.env.DB_PORT || '5432';
const host = process.env.DB_HOST || 'localhost';

module.exports =  {
  client: process.env.DB_CLIENT || 'pg',
  connection: process.env.DB_URL || `postgres://${user}:${pass}@${host}:${port}/${db}`,
  ...knexSnakeCaseMappers(),
  seeds: {
    directory: `${__dirname}/seeds/${env}`
  }
};

