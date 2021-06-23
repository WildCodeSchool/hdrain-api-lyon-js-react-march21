const authRouter = require('./auth');
// const currentUserRouter = require('./currentUser');
const usersRouter = require('./users');
const locationsRouter = require('./locations');
const experimentsRouter = require('./experiments');
const sensorsRouter = require('./sensors');
const uploadRouter = require('./uploads');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  // app.use('/currentUser', currentUserRouter);
  app.use('/locations', locationsRouter);
  app.use('/sensors', sensorsRouter);
  app.use('/experiments', experimentsRouter);
  app.use('/upload', uploadRouter);
};
