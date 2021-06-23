const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  try {
    req.currentUser = await User.findOne(req.session.userId);
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};
