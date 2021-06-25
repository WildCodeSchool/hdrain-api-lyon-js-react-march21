const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  try {
    req.currentSessionId = await User.findOne(req.sessionID);
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};
