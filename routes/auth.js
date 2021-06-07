const authRouter = require('express').Router();
const User = require('../models/data');

authRouter.post('/checkCredentials', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (user) {
    if (await User.verifyPassword(password, user.hashedPassword)) {
      res.send('Valid credentials');
    } else {
      res.send('invalid credentials');
    }
  } else {
    res.send('invalid credentials');
  }
});

module.exports = authRouter;
