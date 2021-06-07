/* eslint-disable prefer-arrow-callback */
const usersRouter = require('express').Router();

const User = require('../models/user.model');

/* ___________________________________________________ */
usersRouter.get('/', async (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

usersRouter.post('/', (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });

  newUser
    .save()
    .then(() => res.json('User added'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = usersRouter;
