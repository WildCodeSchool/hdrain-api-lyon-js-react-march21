const authRouter = require('./auth');
const currentUserRouter = require('./currentUser');
const locationsRouter = require('./locations');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/currentUser', currentUserRouter);
  // app.use('/sensors', sensorsRouter);
  // app.use('/experiments', experimentsRouter);
  app.use('/locations', locationsRouter);
};
