const usersRouter = require('express').Router();
const User = require('../models/UserModel');

// Get all users
usersRouter.get('/', async (req, res) => {
  try {
    const allUsers = await User.findMany();
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create new user
usersRouter.post('/', async (req, res) => {
  try {
    const validationErrors = User.validate(req.body);
    if (validationErrors)
      return res.status(422).send({ errors: validationErrors.details });

    if (await User.usernameAlreadyExists(req.body.username))
      return res.status(422).send({ error: 'Invalid Username' });

    const newUser = await User.create(req.body);
    return res
      .status(201)
      .send(`User created successfully: ${newUser.username}`);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = usersRouter;
