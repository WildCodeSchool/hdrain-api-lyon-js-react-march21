const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');

const initRoutes = require('./routes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());
app.set('x-powered-by', false); // for security
app.set('trust proxy', 1);

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

initRoutes(app);

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
