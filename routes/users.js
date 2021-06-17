const usersRouter = require('express').Router();
const User = require('../models/UserModel');

// const { hashPassword } = require('../models/UserModel');

// Get all users
usersRouter.get('/', async (req, res) => {
  try {
    const allUsers = await User.findMany();
    console.log(allUsers);
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create new user
// eslint-disable-next-line consistent-return
usersRouter.post('/', async (req, res) => {
  try {
    const validationErrors = User.validate(req.body);
    if (validationErrors)
      return res.status(422).send({ errors: validationErrors.details });

    if (await User.usernameAlreadyExists(req.body.username))
      return res.status(422).send({ error: 'Invalid Username' });

    const newUser = await User.create(req.body);
    console.log(req.body);
    console.log(newUser);
    res.status(201).send(`User created successfully: ${newUser.username}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete selected user by id
/*
usersRouter.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    res.status(202).send(await User.deleteUser(req.params.id));
    // if (deletedUser) return res.status(202).send('User deleted seccessfully');
    return res.status(400).send('User not found');
  } catch (error) {
    return res.status(500).send(`Error: ${error}`);
  }
});
*/

module.exports = usersRouter;
