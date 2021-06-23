const currentUserRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

currentUserRouter.get(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    res.json(req.currentUser);
  })
);

module.exports = currentUserRouter;
