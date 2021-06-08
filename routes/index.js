const authRouter = require('./auth');
const usersRouter = require('./users');
const locationRouter = require('./locationRoute');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/location', locationRouter);
};
