// const mongoose = require('mongoose');
const pgp = require('pg-promise');
const { PrismaClient } = require('@prisma/client');
const { DATABASE_URL } = require('./env');
require('dotenv').config();

const prisma = new PrismaClient();

/* ----------------------- DB CONNECTION -----------------------------------------*/

const db = pgp(DATABASE_URL);

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
