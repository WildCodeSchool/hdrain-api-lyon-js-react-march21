const usersRouter = require('./users');
const authRouter = require('./auth');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
};
