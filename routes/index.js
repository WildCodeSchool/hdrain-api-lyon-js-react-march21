const authRouter = require('./auth');
const usersRouter = require('./users');
const locationsRouter = require('./locations');
const experimentsRouter = require('./experiments');
const sensorsRouter = require('./sensors');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/locations', locationsRouter);
  app.use('/sensors', sensorsRouter);
  app.use('/experiments', experimentsRouter);
};
