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
const inDevEnv = getEnv('NODE_ENV') === 'dev';
const inTestEnv = getEnv('NODE_ENV') === 'test';

const PORT = getEnv(`PORT${inTestEnv ? '_TEST' : ''}`);

module.exports = {
  getEnv,
  inTestEnv,
  inProdEnv,
  inDevEnv,
  PORT,
};

const test = {
  name: "Lyon", 
  coord: { longitude: 5.36, latitude: -3.01 },
  sensors: [
    {
      idNumber: 45,
      coord: { spotName: "Perrache", longitude: 5.01, latitude: -3.80 },
      status: 2,
    }
  ],
  experiences: [{
    timestamp: 'June 08, 2021 15:05:00',
    log: 'No data : Test',
  }],
}