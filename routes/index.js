const authRouter = require('./auth');
const usersRouter = require('./users');
const locationRouter = require('./locationRoute');
const experienceRouter = require('./experienceRoute');
const sensorRouter = require('./sensorRoute');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/location', locationRouter);
  app.use('/sensor', sensorRouter);
  app.use('/experience', experienceRouter);
};
