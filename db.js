const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

console.log(process.env.DB_PORT);

/* ----------------------- DB CONNECTION -----------------------------------------*/

const db = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.on('error', console.error.bind(console, 'connection error:')).once(
  'open',
  () => {
    console.log('database connection established successfully');
  }
);

module.exports = {
  db,
  prisma,
};
