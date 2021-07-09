const authRouter = require('./auth');
const currentUserRouter = require('./currentUser');
const locationsRouter = require('./locations');
const storageRouter = require('./storage');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/currentUser', currentUserRouter);
  // app.use('/sensors', sensorsRouter);
  // app.use('/experiments', experimentsRouter);
  app.use('/locations', locationsRouter);
  app.use(
    '/locations/:locationId/experiments/:experimentId/storage',
    storageRouter
  );
};
