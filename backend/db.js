// db.js
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL in environment');
  process.exit(1);
}

const opts = { connectionString };

if (process.env.DB_SSL === 'true') {
  opts.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(opts);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { query: (text, params) => pool.query(text, params), pool };
