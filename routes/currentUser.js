const currentUserRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

currentUserRouter.get(
  '/',
  requireCurrentUser,
  asyncHandler(async (req, res) => {
    const { id, username } = req.currentUser;
    console.log(req.currentUser);

    res.json({ id, username });
  })
);

module.exports = currentUserRouter;
