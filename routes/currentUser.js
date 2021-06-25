const currentUserRouter = require('express').Router();
const asyncHandler = require('express-async-handler');
// const requireCurrentUser = require('../middlewares/requireCurrentUser');
const { prisma } = require('../db');

currentUserRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    console.log(req.userId);
    req.currentUser = await prisma.session.findFirst({
      where: { sid: req.sessionID },
    });
    console.log(req.currentUser);
    res.status(200).send(req.currentUser);
  })
);

module.exports = currentUserRouter;
