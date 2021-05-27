const argon2 = require('argon2');
const Joi = require('joi');
const db = require('../db');

// Function to validate the unicity of a user email
const emailAlreadyExists = (email) =>
  db.user.findFirst({ where: { email } }).then((user) => !!user);

const findByEmail = (email) => db.user.findFirst({ where: { email } });

// Function to hash a password
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
};
const hashPassword = (plainPassword) =>
  argon2.hash(plainPassword, hashingOptions);

// Function to verify the user password against the hashed one in the DB
const verifyPassword = (plainPassword, hashedPassword) =>
  argon2.verify(hashedPassword, plainPassword, hashingOptions);

// Function to create a new user
const create = async ({ email, password }) => {
  const hashedPassword = await hashPassword(password);
  return db.user.create({ data: { email, hashedPassword } });
};

const validate = (data) =>
  Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(100).required(),
  }).validate(data, { abortEarly: false }).error;

module.exports = {
  emailAlreadyExists,
  hashPassword,
  create,
  findByEmail,
  verifyPassword,
  validate,
};
