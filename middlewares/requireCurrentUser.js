const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  try {
    req.currentUser = await User.findOne(req.session.userId);
    console.log(req.currentUser);
  } catch (err) {
    return res.sendStatus(401);
  }
  return next();
};
