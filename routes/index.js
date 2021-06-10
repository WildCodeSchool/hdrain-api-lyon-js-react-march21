const usersRouter = require('./users');
const authRouter = require('./auth');
const locationsRouter = require('./locations');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/locations', locationsRouter);
};
