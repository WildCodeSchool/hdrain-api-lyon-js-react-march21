const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  try {
    console.log(req.session.userId);
    req.currentUser = await User.findOne(req.session.userId);
    next();
  } catch (err) {
    return res.status(401).send(err);
  }
};
