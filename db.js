// const mongoose = require('mongoose');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { DB_USERNAME, DB_URL, DB_NAME, DB_PASSWORD, DB_PORT } = require('./env');
require('dotenv').config();

const prisma = new PrismaClient();

/* ----------------------- DB CONNECTION -----------------------------------------*/

const db = new Pool({
  user: DB_USERNAME,
  host: DB_URL,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

/*
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
*/

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
