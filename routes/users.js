const usersRouter = require('express').Router();
const { User, hashPassword } = require('../models/UserModel');

// Get all users
usersRouter.get('/', async (req, res) => {
  try {
    res.status(200).send(await User.find({}, 'id username'));
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create new user
usersRouter.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, hashedPassword });
    const saveUser = await newUser.save();
    res.status(201).send(`User created successfully: ${saveUser.username}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete selected user by id
usersRouter.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) return res.status(202).send(deletedUser);
    return res.status(400).send('User not found');
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = usersRouter;
