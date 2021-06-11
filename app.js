const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {
  PORT,
  CORS_ALLOWED_ORIGINS,
  DATABASE_URL,
  inTestEnv,
  inProdEnv,
  SESSION_COOKIE_SECRET,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_DOMAIN,
} = require('./env');
const initRoutes = require('./routes');
const handleRecordNotFoundError = require('./middlewares/handleRecordNotFoundError');
const handleValidationError = require('./middlewares/handleValidationError');
const handleServerInternalError = require('./middlewares/handleServerInternalError');

require('dotenv').config();

const port = PORT || 5000;

const app = express();

app.use(express.json());
app.set('x-powered-by', false); // for security
app.set('trust proxy', 1); // trust first proxy

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  session({
    key: SESSION_COOKIE_NAME,
    secret: SESSION_COOKIE_SECRET,
    store: MongoStore.create({
      mongoUrl: DATABASE_URL,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: inProdEnv,
      domain: SESSION_COOKIE_DOMAIN,
      sameSite: true,
    },
  })
);
app.use(handleRecordNotFoundError);
app.use(handleValidationError);
app.use(handleServerInternalError);

initRoutes(app);

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection
  .once('open', () => {
    console.log('MongoDB database connection established successfully');
  })
  .on('error', (err) => {
    console.error(err);
  });

const server = app.listen(port, () => {
  if (!inTestEnv) console.log(`Server is running on port: ${port}`);
});

// process setup : improves error reporting
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
});

module.exports = server;
