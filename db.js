const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

/* ----------------------- DB CONNECTION -----------------------------------------*/

const db = new Pool({
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
