const authRouter = require('./auth');
// const currentUserRouter = require('./currentUser');
const usersRouter = require('./users');
const locationsRouter = require('./locations');
const experimentsRouter = require('./experiments');
const sensorsRouter = require('./sensors');
const storageRouter = require('./storage');

module.exports = (app) => {
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  // app.use('/currentUser', currentUserRouter);
  app.use('/locations', locationsRouter);
  app.use(`/locations/:locationId/sensors`, sensorsRouter);
  app.use('/locations/:locationId/experiments', experimentsRouter);
  app.use('/locations/:locationId/experiments/:experimentId/storage', storageRouter);
};
