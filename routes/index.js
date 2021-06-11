const usersRouter = require('./users');
const authRouter = require('./auth');
const currentUserRouter = require('./currentUser');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/currentUser', currentUserRouter);
};
