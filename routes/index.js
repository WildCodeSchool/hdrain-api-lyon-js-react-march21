const usersRouter = require('./users');
const authRouter = require('./auth');
const currentUserRouter = require('./currentUser');
const locationsRouter = require('./locations');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/currentUser', currentUserRouter);
  app.use('/locations', locationsRouter);
};
