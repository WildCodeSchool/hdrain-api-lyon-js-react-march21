const mongoose = require('mongoose');
require('dotenv').config()
/* ----------------------- DB CONNECTION -----------------------------------------*/

mongoose.connect(`${process.env.DB_URL}`, {useNewUrlParser: true, useUnifiedTopology: true});

const mongoDB = mongoose.connection;
mongoDB
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => {
    console.log('connected to mongoDB');
  });


module.exports = mongoDB;

