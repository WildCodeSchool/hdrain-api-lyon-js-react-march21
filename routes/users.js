const usersRouter = require('express').Router();
const argon2 = require('argon2');

const User = require('../models/user.model');

// ARGON 2
const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2.argon2id,
};

const hashPassword = (plainPassword) =>
  argon2.hash(plainPassword, hashingOptions);

/* ___________________________________________________ */
usersRouter.get('/', async (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

usersRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);

  const newUser = new User({ username, hashedPassword });

  newUser
    .save()
    .then(() => res.json('User added'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

usersRouter.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json('Exercise Deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = usersRouter;
