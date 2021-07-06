const fs = require('fs');
const util = require('util');
// const path = require('path');
const globCB = require('glob');
const ExperimentModel = require('../models/ExperimentModel');

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
const readFile = util.promisify(fs.readFile);
const glob = util.promisify(globCB);

// Path to scan
const mainPath = `${process.env.LOCAL_TARGET}/**/[0-9][0-9]h[0-9][0-9]`;

const readArrayFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return buffer.toString('utf8').trim().split('\n').map(Number);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const readStationStatusFromFile = async (pathToFile) => {
  try {
    const buffer = await readFile(pathToFile);
    return JSON.parse(buffer);
  } catch (error) {
    console.error(error);
    return { error };
  }
};

function getDateFromFileDirectory(pathToFolder) {
  const [directoryDate] = pathToFolder.match(/(\d{4})+.{12}/g);
  const splitDirectoryDate = directoryDate.split('/');
  const [hours, minutes] = splitDirectoryDate[3].split('h');
  const [years, months, days] = splitDirectoryDate;
  return new Date(years, months, days, hours, minutes);
}

const saveFilesToDB = async (pathToFiles) => {
  try {
    const folders = await glob(pathToFiles);
    const timestamps = await ExperimentModel.getAllTimestamps();
    const newExperiementsArray = folders.map((folder) => {
      const date = getDateFromFileDirectory(folder);
      if (!timestamps[date]) {
        // Si il n'existe pas un fichier : done.txt alors
        const [y1, y2, x] = Promise.all([
          readArrayFromFile(`${folder}/J`),
          readArrayFromFile(`${folder}/Jb`),
          readArrayFromFile(`${folder}/JNL`),
        ]);
        return {
          timestamp: getDateFromFileDirectory(folder),
          neuralNetworkLog: `${folder}/diagnostics.png`,
          assimilationLog: `${folder}/bash_assim.log`,
          rainGraph: JSON.stringify({ y1, y2, x }),
          costGraph: `${folder}/diagnostics.png`,
          parameters: `${folder}/config.cfg`,
          location: 'Abidjan',
        };
      }
      return null;
    });
    await ExperimentModel.createMany(newExperiementsArray);
  } catch (error) {
    console.error(error);
  }
};

saveFilesToDB(mainPath);

module.exports = readArrayFromFile;
