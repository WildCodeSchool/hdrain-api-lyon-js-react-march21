const mongoose = require('mongoose');
const{ DATABASE_URL } = require('./env')
require('dotenv').config()
/* ----------------------- DB CONNECTION -----------------------------------------*/

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const mongoDB = mongoose.connection;
mongoDB
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => {
    console.log('connected to mongoDB');
  });


module.exports = mongoDB;

