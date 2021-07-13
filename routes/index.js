const requireCurrentUser = require('../middlewares/requireCurrentUser');
const authRouter = require('./auth');
const currentUserRouter = require('./currentUser');
const locationsRouter = require('./locations');
const storageRouter = require('./storage');
const syncRouter = require('./sync');

module.exports = (app) => {
  app.use('/auth', authRouter);
  app.use('/currentUser', requireCurrentUser, currentUserRouter);
  app.use('/sync', requireCurrentUser, syncRouter);
  app.use('/locations', requireCurrentUser, locationsRouter);
  app.use(
    '/locations/:locationId/experiments/:experimentId/storage',
    requireCurrentUser,
    storageRouter
  );
};
