const usersRouter = require('express').Router();
const User = require('../models/data');

usersRouter.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (await User.emailAlreadyExists(email))
    return res.status(422).send({ error: 'this email is already taken' });

  const validationErrors = User.validate(req.body);
  if (validationErrors)
    return res.status(422).send({ errors: validationErrors.details });

  if (await User.emailAlreadyExists(email))
    return res.status(422).send({ error: 'this email is already taken' });

  const newUser = await User.create({ email, password });
  return res.status(201).send({ id: newUser.id, email: newUser.email });
});

module.exports = usersRouter;
