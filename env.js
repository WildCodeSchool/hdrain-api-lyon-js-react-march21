require('dotenv').config();

function getEnv(varibale) {
  const value = process.env[varibale];
  if (typeof value === 'undefined') {
    console.warn(`Seems like the variable "${varibale}" is not set in the environment. 
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

const inProdEnv = getEnv('NODE_ENV') === 'production';
const inDevEnv = getEnv('NODE_ENV') === 'development';
const inTestEnv = getEnv('NODE_ENV') === 'test';

const PORT = getEnv(`PORT${inTestEnv ? '_TEST' : ''}`);
const DATABASE_URL = getEnv(`DATABASE_URL`);

const CORS_ALLOWED_ORIGINS = getEnv(`CORS_ALLOWED_ORIGINS`);
const SESSION_COOKIE_DOMAIN = getEnv(`SESSION_COOKIE_DOMAIN`);
const SESSION_COOKIE_NAME = getEnv(`SESSION_COOKIE_NAME`);
const SESSION_COOKIE_SECRET = getEnv(`SESSION_COOKIE_SECRET`);

module.exports = {
  getEnv,
  inTestEnv,
  inDevEnv,
  inProdEnv,
  PORT,
  CORS_ALLOWED_ORIGINS,
  SESSION_COOKIE_DOMAIN,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_SECRET,
  DATABASE_URL,
};
