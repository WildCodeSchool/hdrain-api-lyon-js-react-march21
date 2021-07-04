const fs = require('fs');
const util = require('util');
// const path = require('path');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);

const readArrayFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return buffer.toString('utf8').trim().split('\n').map(Number);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const test = async () => {
  const J = await readArrayFromFile('./storage/data/18h45/J');
  const Jb = await readArrayFromFile('./storage/data/18h45/Jb');
  console.log(J.length, Jb.length);
};
test();

module.exports = readArrayFromFile;
