const mongoose = require('mongoose');
const { DATABASE_URL } = require('./env');
require('dotenv').config();
/* ----------------------- DB CONNECTION -----------------------------------------*/

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', () => {
    console.log('MongoDB database connection established successfully');
  });

module.exports = connection;
