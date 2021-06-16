const argon2 = require('argon2');
const Joi = require('joi');
const connection = require('../db');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // If you type some space after the username, the space will be removed
  },
  hashedPassword: {
    type: Object,
    required: true,
  },
});

const User = connection.model('User', UserSchema);

// ARGON 2
const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2.argon2id,
};

const hashPassword = (plainPassword) =>
  argon2.hash(plainPassword, hashingOptions);

// Function to validate the unicity of a user username
const usernameAlreadyExists = async (username) =>
  !!(await User.findOne({ username }));

// Function to return the user with a given username
const findByUsername = async (username) => User.findOne({ username });

// Check the user's password
const verifyPassword = (plainPassword, hashedPassword) =>
  argon2.verify(hashedPassword, plainPassword, hashingOptions);

// Validates a user name and password
const validate = (data) =>
  Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().min(8).max(100).required(),
  }).validate(data, { abortEarly: false }).error;

module.exports = {
  User,
  hashPassword,
  usernameAlreadyExists,
  findByUsername,
  verifyPassword,
  validate,
};
