const usersRouter = require('express').Router();
const User = require('../models/UserModel');

// Get all users
usersRouter.get('/all', async (req, res) => {
  try {
    const allUsers = await User.findMany();
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create new user
usersRouter.post('/create', async (req, res) => {
  try {
    const validationErrors = User.validate(req.body);
    if (validationErrors)
      res.status(422).send({ errors: validationErrors.details });

    if (await User.usernameAlreadyExists(req.body.username))
      res.status(422).send({ error: 'Invalid Username' });

    const newUser = await User.create(req.body);
    res.status(201).send(`User created successfully: ${newUser.username}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = usersRouter;
