const fs = require('fs');
const util = require('util');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);

const readArrayFromFile = async (path) => {
  try {
    // You can now use `readFile()` with `await`!
    const buffer = await readFile(path);
    const table = buffer.toString('utf8').trim().split('\n').map(Number);
    console.log(table);
  } catch (error) {
    console.error(error);
  }
};

readArrayFromFile('./scripts/Jb');

module.exports = readArrayFromFile;
