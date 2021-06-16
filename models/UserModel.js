const argon2 = require('argon2');
const Joi = require('joi');
const { prisma } = require('../db');

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
  !!(await prisma.user.findOne({ where: { username } }));

// Function to return the user with a given username
const findByUsername = async (username) =>
  prisma.user.findOne({ where: { username } });

// Check the user's password
const verifyPassword = (plainPassword, hashedPassword) =>
  argon2.verify(hashedPassword, plainPassword, hashingOptions);

// Validates a user name and password
const validate = (data) =>
  Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().min(8).max(100).required(),
  }).validate(data, { abortEarly: false }).error;

const { findMany } = prisma.user;

const create = async ({ username, password }) => {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: { username, hashedPassword },
  });
};

const deleteUser = async ({ userId }) =>
  prisma.user.delete({ where: { id: userId } });

module.exports = {
  hashPassword,
  usernameAlreadyExists,
  findByUsername,
  verifyPassword,
  validate,
  findMany,
  create,
  deleteUser,
};
